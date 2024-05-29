<template>
  <div>
    <a-modal
      v-model:visible="visibleModel"
      :width="350"
      title="抓拍库记录存储时间配置"
      centered
      :footer="null"
      :afterClose="close"
      :destroyOnClose="true"
    >
      <div>
        <!-- 布控操作区 S -->
        <div class="top top-line">
          <a-tag color="error" class="p6px! b-rd-6px!">
            <template #icon>
              <InfoCircleFilled />
            </template>
            抓拍人脸信息超过存储期限后将会进行删除优化
          </a-tag>
          <div class="flex items-center mt20px">
            <span class="mr10px">存储期限：</span>
            <a-input class="w220px!" v-model:value="deadline" type="number" suffix="天" />
          </div>
        </div>
        <!-- 布控操作区 E -->

        <!-- 底部按钮区域 S -->
        <div class="flex items-center justify-center">
          <!-- 确认按钮 -->
          <a-button class="mr-20px" type="primary" :loading="submitLoading" @click="submit"
            >确认</a-button
          >
          <!-- 取消按钮 -->
          <a-button class="w88px!" @click="visibleModel = false">取消</a-button>
        </div>
        <!-- 底部按钮区域 E -->
      </div>
    </a-modal>
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref, watch, computed } from 'vue';
  import { InfoCircleFilled } from '@ant-design/icons-vue';

  import { getStorageDeadline, updateStorageDeadline } from '@/api/candidPhotoBase';
  import { message, Modal } from 'ant-design-vue';

  /**
   * 人员识别记录弹窗组件
   */
  export default defineComponent({
    name: 'TimeSettingModal',
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
      const visibleModel = ref(false);
      const deadline = ref(0);
      const submitLoading = ref(false);

      watch(
        () => props.visible,
        (val) => {
          visibleModel.value = val;

          if (val) {
            getDeadline();
          }
        },
      );

      watch(visibleModel, (val) => {
        context.emit('update:visible', val);
      });

      /**
       * 弹窗关闭
       */
      const close = () => {
        props.afterClose && props.afterClose();
      };

      /**
       * 获取过期时间
       */
      function getDeadline() {
        getStorageDeadline().then((res) => {
          deadline.value = res.day;
        });
      }

      /**
       * 提交数据
       */
      function submit() {
        if (submitLoading.value) return;

        submitLoading.value = true;

        Modal.confirm({
          title: '提示',
          content: '抓拍人脸信息超过存储期限后将会进行删除优化，确认更改?',
          onOk: () => {
            updateStorageDeadline(Number(deadline.value))
              .then((res) => {
                console.log(res);
                message.success('存储时间更新成功');
                visibleModel.value = false;
              })
              .catch((err) => {
                console.log('存储时间失败', err);
                // message.error('存储时间更新失败');
              })
              .finally(() => {
                submitLoading.value = false;
              });
          },
        });
      }

      return {
        visibleModel,
        deadline,
        submitLoading,
        submit,
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
