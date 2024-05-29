<template>
  <div>
    <a-modal
      v-if="visible"
      :visible="visible"
      width="900px"
      :title="isDisable ? '编辑点位' : '新增点位'"
      centered
      :destroyOnClose="true"
      :footer="null"
      @cancel="close"
    >
      <div>
        <!-- 信息录入区域 S -->
        <div class="top">
          <a-form ref="formRef" :model="form" :rules="rules" :labelCol="{ span: 5 }">
            <a-form-item name="name" label="点位名称">
              <a-input
                style="width: 320px"
                v-model:value="form.name"
                placeholder="请输入"
              ></a-input>
            </a-form-item>
            <a-form-item label="状态">
              <a-switch v-model:checked="form.enableFlag" />
            </a-form-item>
            <a-form-item name="lng" label="点位位置">
              <span>经度</span>
              <a-input
                style="width: 100px; margin: 0 10px"
                disabled
                v-model:value="form.lng"
                placeholder="请输入"
              ></a-input>
              <span>纬度</span>
              <a-input
                style="width: 100px; margin: 0 10px"
                disabled
                v-model:value="form.lat"
                placeholder="请输入"
              ></a-input>
            </a-form-item>
            <a-form-item name="address" label="点位地址">
              <a-input
                style="width: 320px"
                v-model:value="form.address"
                placeholder="请输入"
              ></a-input>
            </a-form-item>
            <a-form-item name="region" label="所属区域">
              <a-input
                style="width: 320px"
                v-model:value="form.region"
                placeholder="请输入"
              ></a-input>
            </a-form-item>
            <a-form-item name="street" label="所属街道">
              <a-input
                style="width: 320px"
                v-model:value="form.street"
                placeholder="请输入"
              ></a-input>
            </a-form-item>
          </a-form>

          <div class="map_cont relative">
            <div class="search_cont">
              <a-input-search
                v-model:value="address"
                placeholder="请输入地址搜索"
                @change="Doserach"
              ></a-input-search>
            </div>
            <BaseAmap ref="baseAmap" :option="mapOption" @loaded="mapLoaded" />
          </div>
        </div>
        <!-- 信息录入区域 E -->

        <!-- 底部按钮区域 S -->
        <div class="flex items-center justify-center">
          <!-- 确认按钮 -->
          <a-button class="mr-20px" :loading="submitLoading" type="primary" @click="submit"
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
  import BaseAmap from '@/components/GAmap/GAmap.vue';
  import { addPointer, updatePointer } from '@/api/alarmList';

  // import { warnList } from '@/api/rskPersonnel';
  /**
   * 新增名单库弹窗组件
   */
  export default defineComponent({
    name: 'AddListModal',
    props: {
      visible: {
        type: Boolean,
        default: false,
      },
      recordData: {
        type: Object,
        default: () => {},
      },
      isDisable: {
        type: Boolean,
        default: false,
      },
      riskLevelOptions: {
        type: Array,
        default: () => [],
      },
      addFunction: {
        //新增事件
        type: Function,
        default: () => {},
      },
      updateFunction: {
        //编辑事件
        type: Function,
        default: () => {},
      },
    },
    components: { BaseAmap },
    setup(props, context) {
      const formRef = ref();
      const submitLoading = ref<boolean>(false);
      const needAdd = ref<boolean>(false);
      const AlarmList = ref<any>([]);
      const address = ref<any>('');
      const baseAmap = ref<any>();
      const mapOption = reactive({
        center: [104.0668, 30.5728],
      });
      const form = reactive<any>({
        id: '',
        enableFlag: true,
        name: '',
        lng: '',
        lat: '',
        address: '',
        region: '',
        street: '',
      });

      const rules = reactive({
        name: [{ required: true, message: '必填项' }],
        lng: [{ required: true, message: '必填项' }],
        region: [{ required: true, message: '必填项' }],
        street: [{ required: true, message: '必填项' }],
        address: [{ required: true, message: '必填项' }],
      });

      watch(
        () => props.recordData,
        (val: any) => {
          if (val && val.id) {
            setTimeout(() => {
              const { id, enableFlag, name, lng, lat, street, region, address } = val;
              Object.assign(form, {
                id,
                enableFlag,
                name,
                lng,
                lat,
                street,
                address,
                region,
              });
              address.value = address;
            }, 10);
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
        formRef.value.resetFields();
        address.value = '';
        Object.assign(form, {
          id: '',
          enableFlag: true,
          name: '',
          lng: '',
          lat: '',
          address: '',
          region: '',
          street: '',
        });
      };
      /**
       * 提交
       */
      function submit() {
        formRef.value.validate().then(async () => {
          const { id, enableFlag, name, lng, lat, street, region, address } = form;
          let data: any = {
            id,
            enableFlag,
            name,
            lng,
            lat,
            street,
            region,
            address,
          };
          if (!props.isDisable) delete data.id;
          const promise = props.isDisable ? updatePointer : addPointer;
          submitLoading.value = true;
          try {
            await promise(data);
            message.success(`新增成功`);
            close();
            context.emit('getList');
            clearData();
          } finally {
            submitLoading.value = false;
          }
        });
      }

      function findNum($event) {
        form.warnNum = AlarmList.value.find((v) => {
          return v.value == $event;
        }).warnNum;
      }
      /* 地图初始化之后 */
      const mapLoaded = () => {
        if (form.id) {
          const lng = form.lng;
          const lat = form.lat;
          baseAmap.value.map.clearMap();
          const marker = new baseAmap.value.AMap.Marker({
            position: [Number(lng), Number(lat)],
          });
          marker.setMap(baseAmap.value.map);
          baseAmap.value.map.setCenter([Number(lng), Number(lat)]);
        }
        baseAmap.value.map.on('click', (e) => {
          nextTick(() => {
            form.lng = e.lnglat.getLng();
            form.lat = e.lnglat.getLat();
            const lng = e.lnglat.getLng();
            const lat = e.lnglat.getLat();
            baseAmap.value.map.clearMap();
            const marker = new baseAmap.value.AMap.Marker({
              position: [Number(lng), Number(lat)],
            });
            marker.setMap(baseAmap.value.map);
            baseAmap.value.AMap.plugin('AMap.Geocoder', function () {
              var geocoder = new baseAmap.value.AMap.Geocoder({
                // city 指定进行编码查询的城市，支持传入城市名、adcode 和 citycode
                city: '全国',
              });
              geocoder.getAddress([lng, lat], (status, result) => {
                if (status === 'complete' && result.regeocode.formattedAddress) {
                  address.value = result.regeocode?.formattedAddress;
                  form.address = result.regeocode?.formattedAddress;
                  form.region = result.regeocode?.addressComponent?.district || '';
                  form.street = result.regeocode?.addressComponent?.township || '';
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
              form.address = address.value;
              const { lng } = res.poiList.pois[0].location;
              const { lat } = res.poiList.pois[0].location;
              form.lng = lng;
              form.lat = lat;
              baseAmap.value.map.clearMap();
              const stationMarker = new baseAmap.value.AMap.Marker({
                position: [Number(lng), Number(lat)],
              });
              stationMarker.setMap(baseAmap.value.map);
              baseAmap.value.map.setZoomAndCenter(10, [Number(lng), Number(lat)]);
            } else {
              message.warning('您填写的地址没有解析到结果');
            }
          });
        });
      };
      return {
        form,
        rules,
        formRef,
        submitLoading,
        AlarmList,
        needAdd,
        mapOption,
        baseAmap,
        address,
        Doserach,
        close,
        mapLoaded,
        clearData,
        submit,
        findNum,
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
    height: 400px;
    border-radius: 12px;
    overflow: hidden;
  }

  .search_cont {
    position: absolute;
    width: 400px;
    left: 220px;
    top: 20px;
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
