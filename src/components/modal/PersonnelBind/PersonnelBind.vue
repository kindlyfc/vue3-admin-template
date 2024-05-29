<template>
  <div>
    <a-modal
      v-if="visible"
      :visible="visible"
      :width="500"
      title="人员绑定"
      centered
      :destroyOnClose="true"
      :footer="null"
      @cancel="close"
    >
      <div>
        <!-- 信息录入区域 S -->
        <div class="top">
          <a-form ref="formRef" :model="form" :rules="rules" :labelCol="{ span: 5 }">
            <a-form-item name="personUid" label="人员">
              <a-select
                v-model:value="form.gridUsers"
                placeholder="请选择"
                show-search
                mode="multiple"
                :maxTagCount="1"
                :filter-option="filterOption"
                :options="personList"
                @change="findName($event, personList)"
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
  import type { map } from 'lodash-es';
  import { message } from 'ant-design-vue';
  import { bindUser } from '@/api/rskPersonnel';
  import { log } from 'util';
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
      personList: {
        type: Array,
        default: () => [],
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
      const gridUsers = ref<any>([]);
      const form = reactive({
        gridUsers: [],
      });

      const rules = reactive({
        gridUsers: [{ required: true, message: '必填项' }],
      });

      watch(
        () => props.record,
        (val: any) => {
          if (val && val.gridUsers?.length) {
            form.gridUsers = val.gridUsers?.map((v) => {
              return v.userUuid;
            });
            gridUsers.value = val.gridUsers?.map((v) => {
              return { userName: v.userName, userUuid: v.userUuid };
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
        formRef.value.resetFields();
        Object.assign(form, {
          gridUsers: [],
        });
      };
      /**
       * 提交
       */
      function submit() {
        formRef.value.validate().then(async () => {
          let data: any = {
            id: props.record?.id,
            gridUsers: gridUsers.value,
          };
          submitLoading.value = true;
          try {
            await bindUser(data);
            message.success(`绑定成功`);
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

      const findName = ($event, personList) => {
        gridUsers.value = props.personList
          .filter((v: any) => {
            return $event.indexOf(v.value) !== -1;
          })
          .map((x: any) => {
            return { userName: x.label, userUuid: x.value };
          });
      };
      return {
        form,
        rules,
        formRef,
        submitLoading,
        filterOption,
        close,
        clearData,
        findName,
        submit,
      };
    },
  });
</script>

<style lang="less" scoped></style>
