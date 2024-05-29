<template>
  <div>
    <a-modal
      v-model:visible="visibleModel"
      :width="500"
      title="报警数据推送地址配置"
      centered
      :footer="null"
      :afterClose="close"
      :destroyOnClose="true"
    >
      <a-spin :spinning="getUrlLoading">
        <div>
          <!-- 布控操作区 S -->
          <div class="top top-line">
            <div class="flex items-center mt20px">
              <span class="mr10px w190px">报警数据推送地址：</span>
              <a-input v-model:value="url" />
            </div>
          </div>
          <!-- 布控操作区 E -->

          <!-- 底部按钮区域 S -->
          <div class="flex items-center justify-center">
            <!-- 确认按钮 -->
            <a-button class="mr-20px" type="primary" :loading="setLoading" @click="setUrlHandle"
              >确认</a-button
            >
            <!-- 取消按钮 -->
            <a-button class="w88px!" @click="visibleModel = false">取消</a-button>
          </div>
          <!-- 底部按钮区域 E -->
        </div>
      </a-spin>
    </a-modal>
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref, watch } from 'vue';
  import { InfoCircleFilled } from '@ant-design/icons-vue';
  import { useAsyncState, useVModel } from '@vueuse/core';

  import { getAlarmPushUrl, setAlarmPushUrl } from '@/api/systemManagement';
  import { message } from 'ant-design-vue';

  /**
   * 报警推送地址配置弹窗组件
   */
  export default defineComponent({
    name: 'AlarmDataPushAddressModal',
    props: {
      visible: {
        type: Boolean,
        default: false,
      },
      afterClose: {
        type: Function,
      },
      showAdd: {
        type: Boolean,
        default: false,
      },
    },
    components: {
      InfoCircleFilled,
    },
    setup(props, context) {
      const url = ref('');

      const visibleModel = useVModel(props, 'visible', context.emit);

      /**
       * 弹窗关闭
       */
      const close = () => {
        props.afterClose && props.afterClose();
      };

      /**
       * 获取报警推送地址
       */
      const { isLoading: getUrlLoading, execute: getUrl } = useAsyncState(
        () => {
          return getAlarmPushUrl();
        },
        '',
        {
          immediate: false,
          onSuccess(data) {
            url.value = data;
          },
        },
      );

      /**
       * 设置报警推送地址
       */
      const { isLoading, execute } = useAsyncState(
        (params) => {
          return setAlarmPushUrl(params);
        },
        {},
        {
          immediate: false,
          onSuccess() {
            message.success('报警推送地址更新成功');
            visibleModel.value = false;
          },
          onError() {
            message.error('报警推送地址更新失败');
          },
        },
      );

      const setUrlHandle = () => {
        execute(0, { path: url.value });
      };

      watch(
        () => props.visible,
        (val) => {
          if (val) {
            getUrl();
          }
        },
      );

      return {
        visibleModel,
        url,
        getUrlLoading,
        setLoading: isLoading,
        setUrlHandle,
        close,
      };
    },
  });
</script>

<style lang="less" scoped>
  .top-line {
    border-top: 3px dashed #ccc;
  }

  .top {
    padding: 20px 0;
  }
</style>
