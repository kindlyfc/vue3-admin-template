<template>
  <div>
    <a-modal
      v-if="visible"
      :visible="visible"
      :width="900"
      title="点位详情"
      centered
      :destroyOnClose="true"
      :footer="null"
      @cancel="close"
    >
      <div>
        <!-- 信息录入区域 S -->
        <div flex-c mb20px>
          <span mr10px><span style="color: red">*</span> 点位名称:</span>
          <span>{{ form.name }}</span>
        </div>
        <div class="map_cont">
          <BaseAmap ref="baseAmap" :option="mapOption" @loaded="mapLoaded" />
        </div>
        <!-- 信息录入区域 E -->

        <!-- 底部按钮区域 S -->
        <div class="flex items-center justify-center">
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
      recordData: {
        type: Object,
        default: () => {},
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
      const form = reactive({
        id: '',
        lng: '',
        lat: '',
        name: '',
      });

      watch(
        () => props.recordData,
        (val: any) => {
          if (val && val.id) {
            setTimeout(() => {
              const { id, lng, lat, name } = val;
              Object.assign(form, {
                id,
                lng,
                lat,
                name,
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
        lastMarker.value = [];
        MarkerList.value = [];
        address.value = '';
        name.value = '';
      };

      /* 地图初始化之后 */
      const mapLoaded = () => {
        nextTick(() => {
          const lng = form.lng;
          const lat = form.lat;
          baseAmap.value.map.clearMap();
          const marker = new baseAmap.value.AMap.Marker({
            position: [Number(lng), Number(lat)],
          });
          marker.setMap(baseAmap.value.map);
          baseAmap.value.map.setCenter([Number(lng), Number(lat)]);
        });
      };

      return {
        form,
        address,
        formRef,
        submitLoading,
        close,
        clearData,
        baseAmap,
        mapOption,
        mapLoaded,
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
