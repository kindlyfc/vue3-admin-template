<template>
  <div>
    <a-modal
      v-if="visible"
      :visible="visible"
      :width="1300"
      :title="isdetail ? '区域详情' : !isUpdate ? '新增区域' : '编辑区域'"
      centered
      :destroyOnClose="true"
      :footer="null"
      @cancel="close"
    >
      <div>
        <!-- 信息录入区域 S -->
        <div flex-c mb20px>
          <span mr10px><span style="color: red">*</span> 区域名称:</span>
          <a-input
            style="width: 300px; margin-right: 20px"
            :disabled="isdetail"
            v-model:value="name"
            placeholder="请输入"
          ></a-input>
          <a-button v-if="!isdetail" class="mr-20px" @click="clearMap">重新绘制</a-button>
          <a-button v-if="!isdetail" class="mr-20px" @click="backPre">回退</a-button>
          <!-- <a-button class="mr-20px" type="primary" @click="over">完成绘制</a-button> -->
        </div>
        <div class="map_cont">
          <div v-if="!isdetail" class="search_cont">
            <a-input-search
              v-model:value="address"
              placeholder="请输入地址搜索"
              @change="Doserach"
            ></a-input-search>
          </div>
          <BaseAmap ref="baseAmap" :option="mapOption" @loaded="mapLoaded" />
        </div>
        <!-- 信息录入区域 E -->

        <!-- 底部按钮区域 S -->
        <div class="flex items-center justify-center">
          <!-- 确认按钮 -->
          <a-button
            v-if="!isdetail"
            class="mr-20px"
            :loading="submitLoading"
            type="primary"
            @click="submit"
            >确认</a-button
          >
          <!-- 取消按钮 -->
          <a-button class="w88px!" @click="close">取消</a-button>
        </div>
        <!-- 底部按钮区域 E -->
      </div>
    </a-modal>
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref, reactive, watch, nextTick } from 'vue';
  import { message } from 'ant-design-vue';
  import { gridAdd, gridupdate } from '@/api/rskPersonnel';
  import BaseAmap from '@/components/GAmap/GAmap.vue';
  /**
   * 新增名单库弹窗组件
   */
  export default defineComponent({
    name: 'AddGrid',
    props: {
      visible: {
        type: Boolean,
        default: false,
      },
      record: {
        type: Object,
        default: () => {},
      },
      allGrid: {
        type: Array,
        default: () => [],
      },
      isUpdate: {
        type: Boolean,
        default: false,
      },
      isdetail: {
        type: Boolean,
        default: false,
      },
    },
    components: { BaseAmap },
    setup(props, context) {
      const address = ref<any>('');
      const name = ref<any>('');
      const baseAmap = ref<any>();
      const mapOption = reactive({
        center: [104.0668, 30.5728],
      });

      const formRef = ref();
      const submitLoading = ref<boolean>(false);
      const MarkerList = ref<any>([]);
      const lastMarker = ref<any>([]);
      const record = ref<any>({});
      const polygonC = ref<any>(null);
      const form = reactive({
        id: '',
        warnType: '',
        warnId: '',
        warnNum: '',
        description: '',
      });

      const rules = reactive({
        description: [{ required: true, message: '请填写区域描述' }],
      });

      watch(
        () => props.record,
        (val: any) => {
          if (val && val.id) {
            nextTick(() => {
              setTimeout(() => {
                record.value = val;
                name.value = val.name;
                if (val.gridPoints.length) {
                  lastMarker.value = [];
                  MarkerList.value = val.gridPoints.map((v) => {
                    const marker = new baseAmap.value.AMap.Marker({
                      position: [Number(v.lng), Number(v.lat)],
                    });
                    lastMarker.value.push(marker);
                    return [v.lng, v.lat];
                  });
                  addPolygon(MarkerList.value);
                }
              }, 1000);
            });
          }
        },
        {
          immediate: true,
          deep: true,
        },
      );
      watch(
        () => props.allGrid,
        (val: any) => {
          if (val && val.length > 0 && !props.isUpdate) {
            nextTick(() => {
              setTimeout(() => {
                val.forEach((v) => {
                  const MarkerLs = v.gridPoints.map((v) => {
                    return [v.lng, v.lat];
                  });
                  addPolygonAll(MarkerLs);
                });
              }, 1000);
            });
          }
        },
        {
          immediate: true,
          deep: true,
        },
      );
      /**
       * 弹窗关闭
       */
      const close = () => {
        context.emit('close', false);
        clearData();
      };

      /*  清除数据 */
      const clearData = () => {
        lastMarker.value = [];
        MarkerList.value = [];
        address.value = '';
        name.value = '';
      };
      /**
       * 提交
       */
      async function submit() {
        if (!name.value) {
          message.warning(`请填写区域名称`);
          return;
        }
        if (MarkerList.value.length < 3) {
          message.warning(`请至少在地图上选择三个点位`);
          return;
        }

        let marker: any = MarkerList.value.map((v, index) => {
          return {
            lng: v[0],
            lat: v[1],
            sort: index + 1,
          };
        });
        let data: any = {
          id: record.value.id,
          name: name.value,
          gridPoints: marker,
        };
        if (!props.isUpdate) delete data.id;
        const promise = props.isUpdate ? gridupdate : gridAdd;
        submitLoading.value = true;
        try {
          await promise(data);
          message.success(`${props.isUpdate ? '编辑' : '新增'}成功`);
          close();
          context.emit('getList');
          clearData();
        } finally {
          submitLoading.value = false;
        }
      }
      /* 地图初始化之后 */
      const mapLoaded = () => {
        baseAmap.value.map.on('click', (e) => {
          if (props.isdetail) return;
          nextTick(() => {
            const lng = e.lnglat.getLng();
            const lat = e.lnglat.getLat();
            // baseAmap.value.map.clearMap();
            const marker = new baseAmap.value.AMap.Marker({
              position: [Number(lng), Number(lat)],
            });
            lastMarker.value.push(marker);
            marker.setMap(baseAmap.value.map);
            MarkerList.value.push([lng, lat]);
            if (MarkerList.value.length >= 3) {
              addPolygon(MarkerList.value);
            }
            baseAmap.value.AMap.plugin('AMap.Geocoder', function () {
              var geocoder = new baseAmap.value.AMap.Geocoder({
                // city 指定进行编码查询的城市，支持传入城市名、adcode 和 citycode
                city: '全国',
              });
              geocoder.getAddress([lng, lat], (status, result) => {
                if (status === 'complete' && result.regeocode.formattedAddress) {
                  address.value = result.regeocode.formattedAddress;
                } else {
                  message.warning('您选择的地址没有解析到结果');
                }
              });
            });
          });
        });
      };
      /*  地图搜索 */
      const Doserach = () => {
        baseAmap.value.AMap.plugin('AMap.PlaceSearch', function () {
          const place = new baseAmap.value.AMap.PlaceSearch({
            pageIndex: 1,
            pageSize: 10,
            extensions: 'all',
          });
          place.search(address.value, (status, res) => {
            // 查询成功时，res 即对应匹配的 POI 信息
            if (res.poiList?.pois) {
              const { lng } = res.poiList.pois[0].location;
              const { lat } = res.poiList.pois[0].location;
              const stationMarker = new baseAmap.value.AMap.Marker({
                position: [Number(lng), Number(lat)],
              });
              lastMarker.value.push(stationMarker);
              stationMarker.setMap(baseAmap.value.map);
              MarkerList.value.push([lng, lat]);
              if (MarkerList.value.length >= 3) {
                addPolygon(MarkerList.value);
              }
              baseAmap.value.map.setZoomAndCenter(10, [Number(lng), Number(lat)]);
            } else {
              message.warning('您填写的地址没有解析到结果');
            }
          });
        });
      };

      /* 地图区域绘制 */
      function addPolygon(data) {
        if (polygonC.value) {
          baseAmap.value.map.remove([polygonC.value]);
          polygonC.value = null;
        }
        setTimeout(() => {
          polygonC.value = new baseAmap.value.AMap.Polygon({
            path: data,
            fillColor: '#ccebc5',
            strokeOpacity: 1,
            fillOpacity: 0.5,
            strokeColor: '#2b8cbe',
            strokeWeight: 1,
            strokeStyle: 'dashed',
            strokeDasharray: [5, 5],
          });
          polygonC.value.on('mouseover', () => {
            polygonC.value.setOptions({
              fillOpacity: 0.7,
              fillColor: '#7bccc4',
            });
          });
          polygonC.value.on('mouseout', () => {
            polygonC.value.setOptions({
              fillOpacity: 0.3,
              fillColor: '#ccebc5',
            });
          });
          baseAmap.value.map.add(polygonC.value);
        }, 0);
      }
      /* 总览区域绘制 */
      function addPolygonAll(data, isclear = false) {
        setTimeout(() => {
          const polygonC = new baseAmap.value.AMap.Polygon({
            path: data,
            fillColor: '#ccebc5',
            strokeOpacity: 1,
            fillOpacity: 0.5,
            strokeColor: '#2b8cbe',
            strokeWeight: 1,
            strokeStyle: 'dashed',
            strokeDasharray: [5, 5],
          });
          polygonC.on('mouseover', () => {
            polygonC.setOptions({
              fillOpacity: 0.7,
              fillColor: '#7bccc4',
            });
          });
          polygonC.on('mouseout', () => {
            polygonC.setOptions({
              fillOpacity: 0.3,
              fillColor: '#ccebc5',
            });
          });
          baseAmap.value.map.add(polygonC);
        }, 0);
      }
      function clearMap() {
        if (polygonC.value) {
          baseAmap.value.map.remove([polygonC.value]);
          polygonC.value = null;
        }
        over();
        MarkerList.value = [];
        lastMarker.value = [];
      }
      function over() {
        lastMarker.value.forEach((v) => {
          baseAmap.value.map.remove(v);
        });
      }
      function backPre() {
        const marker = lastMarker.value.pop();
        baseAmap.value.map.remove(marker);
        MarkerList.value.pop();
        if (MarkerList.value.length >= 3) {
          addPolygon(MarkerList.value);
        } else {
          if (polygonC.value) {
            baseAmap.value.map.remove([polygonC.value]);
            polygonC.value = null;
          }
        }
      }
      return {
        form,
        rules,
        address,
        formRef,
        over,
        submitLoading,
        backPre,
        close,
        clearData,
        submit,
        baseAmap,
        mapOption,
        mapLoaded,
        Doserach,
        clearMap,
        name,
      };
    },
  });
</script>

<style lang="less" scoped>
  .top-line {
    border-top: 3px dashed #ccc;
  }

  .top {
    padding: 10px 0 20px;
  }

  .img-item {
    display: flex;
    flex-direction: column;
    height: 100%;

    :deep(.ant-tag) {
      margin-top: 15px;
    }
  }

  :deep(.ant-form-item) {
    margin-bottom: 10px;
  }

  :deep(.ant-upload-list-picture-card) {
    width: 220px !important;
    height: 220px !important;

    .ant-upload-list-picture-card-container,
    .ant-upload-select-picture-card {
      width: 100% !important;
      height: 100% !important;
    }
  }

  .type_title {
    text-align: left;
    font-size: 15px;
    font-family: PingFang SC-Bold, PingFang SC;
    color: #181717;
    border-bottom: 1px solid #e2dcdc;
    margin-bottom: 30px;
    margin-top: 30px;
  }

  .map_cont {
    width: 100%;
    height: 600px;
    margin-bottom: 20px;
    position: relative;
  }

  .search_cont {
    position: absolute;
    width: 500px;
    left: 50%;
    top: 20px;
    margin-left: -250px;
    display: flex;
    height: 35px;
    background: #ffffff;
    border-radius: 6px;
    border: 1.5px solid #eee;
    z-index: 1000;

    :deep(.ant-input-search-button) {
      border: none !important;
    }

    :deep(.ant-input) {
      flex: 4 !important;
      border: none !important;
      height: 32px !important;
    }
  }
</style>
