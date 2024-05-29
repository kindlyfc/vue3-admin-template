<template>
  <div>
    <a-modal
      v-if="visible"
      :visible="visible"
      :width="isDisable ? 300 : 500"
      :title="isDisable ? '编辑摄像头' : '新增设备'"
      centered
      :destroyOnClose="true"
      :footer="null"
      @cancel="close"
    >
      <div>
        <!-- 信息录入区域 S -->
        <div class="top">
          <a-form
            ref="formRef"
            :model="form"
            :rules="rules"
            :labelCol="{ span: isDisable ? 10 : 6 }"
          >
            <a-form-item v-if="!isDisable" name="deviceSerial" label="设备序列号">
              <a-input
                style="width: 300px"
                v-model:value="form.deviceSerial"
                placeholder="请输入"
              ></a-input>
            </a-form-item>
            <a-form-item v-if="!isDisable" name="name" label="设备名称">
              <a-input
                style="width: 300px"
                v-model:value="form.name"
                placeholder="请输入"
              ></a-input>
            </a-form-item>
            <a-form-item v-if="!isDisable" name="deviceType" label="设备类型">
              <a-select
                style="width: 300px"
                v-model:value="form.deviceType"
                placeholder="请选择"
                :options="[
                  { value: 1, label: 'UPS' },
                  { value: 2, label: '摄像头' },
                ]"
              ></a-select>
            </a-form-item>
            <a-form-item
              name="snapshotInterval"
              v-if="form.deviceType == 2 || isDisable"
              label="抓拍时间间隔"
            >
              <a-input-number :min="1" id="inputNumber" v-model:value="form.snapshotInterval" /> S
            </a-form-item>
            <a-form-item v-if="!isDisable" name="description" label="状态">
              <a-switch v-model:checked="form.enabled" />
            </a-form-item>
            <!-- <a-form-item v-if="!isDisable" name="lng" label="设备位置">
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
            </a-form-item> -->
          </a-form>

          <!-- <div v-if="!isDisable" class="map_cont relative">
            <div class="search_cont">
              <a-input-search
                v-model:value="address"
                placeholder="请输入地址搜索"
                @change="Doserach"
              ></a-input-search>
            </div>
            <BaseAmap ref="baseAmap" :option="mapOption" @loaded="mapLoaded" />
          </div> -->
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
  import { addDevice, upodateDevice } from '@/api/alarmList';

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
        deviceSerial: '',
        name: '',
        lng: '',
        lat: '',
        deviceType: '',
        snapshotInterval: '',
        enabled: true,
      });

      const rules = reactive({
        deviceSerial: [{ required: true, message: '必填项' }],
        name: [{ required: true, message: '必填项' }],
        lng: [{ required: true, message: '必填项' }],
        deviceType: [{ required: true, message: '必填项' }],
        snapshotInterval: [{ required: true, message: '必填项' }],
      });

      watch(
        () => props.recordData,
        (val: any) => {
          if (val && val.id) {
            setTimeout(() => {
              const { id, deviceSerial, name, lng, lat, deviceType, snapshotInterval, enabled } =
                val;
              Object.assign(form, {
                id,
                deviceSerial,
                name,
                lng,
                lat,
                deviceType,
                snapshotInterval,
                enabled,
              });
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
          deviceSerial: '',
          name: '',
          lng: '',
          lat: '',
          deviceType: '',
          snapshotInterval: '',
          enabled: true,
        });
      };
      /**
       * 提交
       */
      function submit() {
        formRef.value.validate().then(async () => {
          const { id, deviceSerial, name, lng, lat, deviceType, snapshotInterval, enabled } = form;
          let data: any = {
            id,
            deviceSerial,
            name,
            lng,
            lat,
            deviceType,
            snapshotInterval,
            enabled,
          };
          if (!props.isDisable) delete data.id;
          const promise = props.isDisable ? upodateDevice : addDevice;
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
