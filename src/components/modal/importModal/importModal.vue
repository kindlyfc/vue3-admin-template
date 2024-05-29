<template>
  <div>
    <a-modal
      v-if="visible"
      :visible="visible"
      :width="600"
      title="导入"
      centered
      :destroyOnClose="true"
      :footer="null"
      @cancel="close"
    >
      <div>
        <!-- 信息录入区域 S -->
        <div class="top top-line">
          <a-form ref="formRef" :model="form" :rules="rules" :labelCol="{ span: 8 }">
            <a-row>
              <a-col :span="10">
                <a-form-item
                  class="img-item"
                  name="base64file"
                  label="上传人员人脸照片"
                  :labelCol="{ span: 0 }"
                  labelAlign="left"
                >
                  <imageUpload
                    class="w220px h220px"
                    v-model:value="form.base64file"
                    @change="handleChange"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="14">
                <a-form-item name="levelId" label="风险等级">
                  <a-select
                    v-model:value="form.levelId"
                    placeholder="请选择风险等级"
                    :options="riskLevelOptions"
                  ></a-select>
                </a-form-item>
              </a-col>
            </a-row>
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
          <a-button class="w88px!" @click="close">取消</a-button>
        </div>
        <!-- 底部按钮区域 E -->
      </div>
    </a-modal>
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref, reactive, watch } from 'vue';
  import imageUpload from '@/components/basic/image-upload/index.vue';
  import { message } from 'ant-design-vue';
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
      record: {
        type: Object,
        default: () => {},
      },
      riskLevelOptions: {
        type: Array,
        default: () => [],
      },
      afterClose: {
        type: Function,
      },
      addFunction: {
        //新增事件
        type: Function,
        default: () => {},
      },
    },
    components: {
      imageUpload,
    },
    setup(props, context) {
      const formRef = ref();
      const submitLoading = ref<boolean>(false);
      const form = reactive({
        base64file: [],
        levelId: '',
        filename: '',
      });

      const rules = reactive({
        base64file: [
          {
            required: true,
            message: '请上传照片',
            validator: (rule: any, value: any) => {
              if (form.base64file.length === 0) {
                return Promise.reject(rule.message);
              }

              return Promise.resolve();
            },
          },
        ],
        levelId: [{ required: true, message: '请填写等级' }],
        filename: [{ required: true, message: '请填写姓名' }],
      });

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
        Object.assign(form, {
          base64file: [],
          levelId: '',
          filename: '',
        });
      };
      /**
       * 提交
       */
      function submit() {
        formRef.value.validate().then(async () => {
          const { base64file, levelId, filename } = form;
          let data: any = {
            base64file,
            levelId,
            filename,
          };
          if (base64file && Array.isArray(base64file)) {
            data.base64file = data.base64file[0].includes('data:image/')
              ? data.base64file[0].split(',')[1]
              : data.base64file[0];
          }
          submitLoading.value = true;
          try {
            await props.addFunction(data);
            message.success(`导入成功`);
            close();
            context.emit('getList');
            clearData();
          } finally {
            submitLoading.value = false;
          }
        });
      }

      /**
       * 图片变化
       * @param value
       */
      function handleChange(value: any, fileList: any) {
        form.filename = value?.file?.name || fileList[0]?.name || '';
        formRef.value.validateFields('imgUrl');
      }

      return {
        form,
        rules,
        formRef,
        submitLoading,
        handleChange,
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
    height: 330px;

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
