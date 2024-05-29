<template>
  <div>
    <a-modal
      v-if="visible"
      :visible="visible"
      :width="500"
      :title="!isUpdate ? '新增工单' : '编辑工单'"
      centered
      :destroyOnClose="true"
      :footer="null"
      @cancel="close"
    >
      <div>
        <!-- 信息录入区域 S -->
        <div class="top">
          <a-form ref="formRef" :model="form" :rules="rules" :labelCol="{ span: 5 }">
            <div v-if="form.warnType || form.warnId || !isUpdate" class="type_title mt0!"
              >告警信息</div
            >
            <a-form-item label="告警类型" v-if="form.warnType || form.warnId || !isUpdate">
              <a-select
                v-model:value="form.warnType"
                placeholder="请选择"
                :disabled="needAdd || isUpdate"
                allowClear
                :options="[
                  { value: 1, label: 'USP设备运行异常' },
                  { value: 2, label: '摄像机异常' },
                ]"
                @select="getAlarmList(form.warnType, '')"
              ></a-select>
            </a-form-item>
            <a-form-item label="选择告警" v-if="!isUpdate">
              <a-select
                v-model:value="form.warnId"
                allowClear
                show-search
                :filter-option="false"
                placeholder="请选择"
                :disabled="!AlarmList.length || needAdd || isUpdate"
                :options="AlarmList"
                @select="findNum"
                @change="
                  () => {
                    if (!form.warnId) form.warnNum = '';
                  }
                "
                @search="handleSearch"
              ></a-select>
            </a-form-item>
            <a-form-item
              label="告警编号"
              v-if="(form.warnType && isUpdate) || (form.warnId && isUpdate)"
            >
              <a-input disabled v-model:value="record.warnNum"></a-input>
            </a-form-item>
            <div class="type_title" :style="{ marginTop: form.warnType || form.warnId ? '' : 0 }"
              >工单信息</div
            >
            <a-form-item name="description" label="工单描述">
              <a-textarea
                :autoSize="{
                  minRows: 3,
                }"
                :maxlength="300"
                v-model:value="form.description"
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
          <a-button class="w88px!" @click="close">取消</a-button>
        </div>
        <!-- 底部按钮区域 E -->
      </div>
    </a-modal>
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref, reactive, watch } from 'vue';
  import { message } from 'ant-design-vue';
  import { warnList } from '@/api/rskPersonnel';
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
      isUpdate: {
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
    components: {},
    setup(props, context) {
      const formRef = ref();
      const submitLoading = ref<boolean>(false);
      const needAdd = ref<boolean>(false);
      const AlarmList = ref<any>([]);
      const form = reactive({
        id: '',
        warnType: '',
        warnId: '',
        warnNum: '',
        description: '',
      });

      const rules = reactive({
        description: [{ required: true, message: '请填写工单描述' }],
      });

      //告警列表
      const getAlarmList = (type, code?) => {
        form.warnId = '';
        form.warnNum = '';
        const data = {
          warnType: type,
          pageSize: 100,
          pageNum: 1,
          warnNum: code || '',
        };
        warnList(data).then((res) => {
          AlarmList.value = res.records.map((v) => {
            return {
              value: v.id,
              label: v.alarmNo,
              warnType: v.deviceType,
              warnId: v.id,
              warnNum: v.alarmNo,
            };
          });
        });
      };
      const handleSearch = (val) => {
        getAlarmList(form.warnType, val);
      };
      watch(
        () => props.record,
        (val: any) => {
          if (val && val.needAdd) {
            needAdd.value = true;
          }
          if ((val && val.needAdd) || (val && props.isUpdate)) {
            getAlarmList(val.warnType);
          }
          if (val && (val.id || val.warnType)) {
            setTimeout(() => {
              const { id, warnType, warnId, warnNum, description } = val;
              Object.assign(form, {
                id,
                warnType,
                warnId,
                warnNum,
                description,
              });
              console.log(form, 6666);
            }, 0);
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
        Object.assign(form, {
          id: '',
          warnType: '',
          warnId: '',
          warnNum: '',
          description: '',
        });
      };
      /**
       * 提交
       */
      function submit() {
        formRef.value.validate().then(async () => {
          const { id, warnType, warnId, warnNum, description } = form;
          let data: any = {
            id,
            warnType,
            warnId,
            warnNum,
            description,
          };
          if (!props.isUpdate) delete data.id;
          const promise = props.isUpdate ? props.updateFunction : props.addFunction;
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
        });
      }

      function findNum($event) {
        form.warnNum = AlarmList.value.find((v) => {
          return v.value == $event;
        }).warnNum;
      }

      return {
        form,
        rules,
        formRef,
        submitLoading,
        AlarmList,
        needAdd,
        close,
        getAlarmList,
        clearData,
        submit,
        findNum,
        handleSearch,
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
</style>
