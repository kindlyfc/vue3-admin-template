<template>
  <div>
    <a-modal
      v-model:visible="visibleModel"
      :width="600"
      :title="(isUpdate ? '编辑' : '新增') + '任务'"
      centered
      :destroyOnClose="true"
      :footer="null"
      :afterClose="close"
    >
      <div>
        <!-- 信息录入区域 S -->
        <div class="top top-line">
          <a-form ref="formRef" :model="form" :rules="rules" :labelCol="{ span: 5 }">
            <a-form-item name="name" label="任务名称">
              <a-input v-model:value="form.name" placeholder="请输入姓名" />
            </a-form-item>

            <a-form-item name="cameraIds" label="摄像头">
              <a-select
                v-model:value="form.cameraIds"
                placeholder="请选择"
                mode="multiple"
                :options="cameraOptions"
              ></a-select>
            </a-form-item>

            <a-form-item name="libIds" label="人员库">
              <a-select
                v-model:value="form.libIds"
                placeholder="请选择"
                mode="multiple"
                :options="personOptions"
              ></a-select>
            </a-form-item>

            <a-form-item name="alarmStranger" label="陌生人警告">
              <a-switch v-model:checked="form.alarmStranger" />
            </a-form-item>

            <a-form-item name="recognizeInterval" label="识别间隔(毫秒)">
              <a-input v-model:value="form.recognizeInterval" type="number" placeholder="请输入" />
            </a-form-item>

            <a-form-item name="remark" label="备注">
              <a-textarea
                :autosize="{
                  minRows: 3,
                }"
                v-model:value="form.remark"
                placeholder="请输入备注"
              />
            </a-form-item>
          </a-form>
        </div>
        <!-- 信息录入区域 E -->

        <!-- 底部按钮区域 S -->
        <div class="flex items-center justify-center">
          <!-- 确认按钮 -->
          <a-button class="mr-20px" :loading="submitLoading" type="primary" @click="submit"
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
  import { defineComponent, ref, reactive, watch } from 'vue';
  import { message } from 'ant-design-vue';
  import { addTask, editTask, getCameraList, getPersonList } from '@/api/systemManagement';
  import useGetOrgTreeData from '@/hooks/useGetOrgTreeData';
  import useGetPersonOpt from '@/hooks/useGetPersonOpt';
  import useGetCameraOpt from '@/hooks/useGetCameraOpt';
  /**
   * 新增认为弹窗
   */
  export default defineComponent({
    name: 'AddTaskModal',
    props: {
      visible: {
        type: Boolean,
        default: false,
      },
      record: {
        type: Object,
        default: () => {},
      },
      isUpdate: {
        type: Boolean,
        default: false,
      },
      afterClose: {
        type: Function,
      },
    },
    components: {},
    setup(props, context) {
      const formRef = ref();
      const visibleModel = ref(false);
      const submitLoading = ref<boolean>(false);

      const form = reactive({
        taskId: '',
        name: '',
        cameraIds: [],
        libIds: [],
        alarmStranger: false,
        recognizeInterval: undefined,
        remark: '',
      });
      const { treeData } = useGetOrgTreeData();
      const { getPersonOptions, personOptions } = useGetPersonOpt();
      const { getCameraOptions, cameraOptions } = useGetCameraOpt();

      const rules = reactive({
        name: [{ required: true, message: '请填写任务名称' }],
        cameraIds: [{ required: true, message: '请选择摄像头' }],
        libIds: [{ required: true, message: '请选择人员' }],
      });

      watch(
        () => props.record,
        (val: any) => {
          if (val && val.taskId) {
            const { taskId, name, cameraIds, libIds, alarmStranger, recognizeInterval, remark } =
              val;
            Object.assign(form, {
              taskId,
              name,
              cameraIds,
              libIds,
              alarmStranger,
              recognizeInterval,
              remark,
            });
          }
        },
        {
          immediate: true,
          deep: true,
        },
      );

      watch(
        () => props.visible,
        (val) => {
          visibleModel.value = val;
          if (val) {
            getCameraOptions();
            getPersonOptions();
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
        visibleModel.value = false;
        clearData();
      };

      /*  清除数据 */
      const clearData = () => {
        formRef?.value?.resetFields();
        Object.assign(form, {
          taskId: '',
          name: '',
          cameraIds: [],
          libIds: [],
          alarmStranger: false,
          recognizeInterval: undefined,
          remark: '',
        });
      };

      /**
       * 提交
       */
      function submit() {
        formRef.value.validate().then(async () => {
          const { taskId, name, cameraIds, libIds, alarmStranger, recognizeInterval, remark } =
            form;
          let data: any = {
            taskId,
            name,
            cameraIds,
            libIds,
            alarmStranger,
            recognizeInterval,
            remark,
          };

          if (!props.isUpdate) delete data.taskId;
          const promise = props.isUpdate ? editTask : addTask;
          submitLoading.value = true;
          try {
            await promise(data);
            message.success(`${props.isUpdate ? '编辑' : '新增'}成功`);
            close();
            context.emit('getList', true);
            clearData();
          } finally {
            submitLoading.value = false;
          }
        });
      }

      return {
        visibleModel,
        form,
        rules,
        formRef,
        submitLoading,
        personOptions,
        cameraOptions,
        treeData,
        close,
        clearData,
        submit,
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

  // :deep(.ant-upload-select-picture-card) {
  //   width: 220px !important;
  //   height: 220px !important;
  // }
</style>
