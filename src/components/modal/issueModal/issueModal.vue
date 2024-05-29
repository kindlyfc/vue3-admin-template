<template>
  <div>
    <a-modal
      v-if="visible"
      :visible="visible"
      :width="500"
      title="下发"
      centered
      :destroyOnClose="true"
      :footer="null"
      @cancel="close"
    >
      <div>
        <!-- 信息录入区域 S -->
        <div class="top">
          <a-form ref="formRef" :model="form" :rules="rules" :labelCol="{ span: 5 }">
            <a-form-item name="peopleUuid" label="下发人">
              <a-select
                v-model:value="form.peopleUuid"
                placeholder="请选择"
                show-search
                mode="multiple"
                :max-tag-count="2"
                :options="personList"
                :filter-option="false"
                @change="findName($event, personList)"
                @search="getUserList"
              ></a-select>
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
          <a-button class="w88px! br6px!" @click="close">取消</a-button>
        </div>
        <!-- 底部按钮区域 E -->
      </div>
    </a-modal>
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref, reactive, watch } from 'vue';
  import { message } from 'ant-design-vue';
  import { downSend, operationsUserList } from '@/api/rskPersonnel';
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
    },
    components: {},
    setup(props, context) {
      const formRef = ref();
      const submitLoading = ref<boolean>(false);
      const personList = ref<any>([]);
      const form = reactive<any>({
        workOrderPeopleList: [],
        peopleUuid: [],
      });
      watch(
        () => props.record,
        (val: any) => {
          if (val.id) getUserList();
        },
        {
          immediate: true,
          deep: true,
        },
      );
      const rules = reactive({
        peopleUuid: [{ required: true, message: '必填项' }],
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
          workOrderPeopleList: {},
          peopleUuid: [],
        });
      };
      /**
       * 提交
       */
      function submit() {
        formRef.value.validate().then(async () => {
          const { workOrderPeopleList } = form;

          let data: any = {
            id: props.record.id,
            workOrderPeopleList,
          };
          submitLoading.value = true;
          try {
            await downSend(data);
            message.success(`下发成功`);
            close();
            context.emit('getList');
            clearData();
          } finally {
            submitLoading.value = false;
          }
        });
      }
      const filterOption = (input: string, option: any) => {
        return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
      };
      //下发人员
      const getUserList = (name?) => {
        const data = {
          pageSize: 200,
          pageNum: 1,
          name: name,
          gridId: props.record.gridId,
        };
        operationsUserList(data).then((res) => {
          personList.value = res?.records.map((v) => {
            return {
              value: v.uid,
              label: v.name,
            };
          });
        });
      };
      const findName = ($event, personList) => {
        form.workOrderPeopleList = [];
        personList?.forEach((v) => {
          if ($event.includes(v.value)) {
            form.workOrderPeopleList.push({
              peopleName: v.label,
              peopleUuid: v.value,
            });
          }
        });
      };
      return {
        form,
        rules,
        formRef,
        submitLoading,
        personList,
        filterOption,
        getUserList,
        close,
        clearData,
        findName,
        submit,
      };
    },
  });
</script>

<style lang="less" scoped></style>
