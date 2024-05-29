<template>
  <div>
    <a-modal
      v-if="visible"
      :visible="visible"
      :width="1100"
      title="配置数据"
      centered
      :destroyOnClose="true"
      :footer="null"
      @cancel="close"
    >
      <div>
        <!-- 信息录入区域 S -->
        <div class="top">
          <a-row>
            <a-col :span="18">
              <a-form ref="formRef" :model="formData" :rules="rules" :labelCol="{ span: 6 }">
                <a-form-item name="cmd" label="指令">
                  <a-input
                    style="width: 320px"
                    v-model:value="formData.cmd"
                    placeholder="请输入"
                  ></a-input>
                </a-form-item>
                <a-form-item label="是否自动发送指令">
                  <a-switch v-model:checked="formData.autoSend" />
                </a-form-item>
                <a-form-item name="sendInterval" label="指令发送间隔">
                  <a-input-number :min="1" v-model:value="formData.sendInterval" />
                  S
                </a-form-item>
                <a-form-item label="是否启用">
                  <a-switch v-model:checked="formData.enabled" />
                </a-form-item>
              </a-form>
            </a-col>
          </a-row>

          <div mt6px pl140px>
            <div flex-c v-for="(item, index) in formData.params" :key="index" mb10px>
              <div flex-c>
                <div>
                  <span> <span style="color: red">*</span> 参数名</span>
                  <a-input
                    :disabled="item.id"
                    style="width: 100px; margin: 0px 8px"
                    v-model:value="item.paramName"
                  ></a-input>
                </div>
                <div>
                  <span><span style="color: red">*</span> 参数key</span>
                  <a-input
                    :disabled="item.id"
                    style="width: 100px; margin: 0px 8px"
                    v-model:value="item.paramKey"
                  ></a-input>
                </div>
                <div>
                  <span><span style="color: red">*</span> 参数类型</span>
                  <a-select
                    :disabled="item.id"
                    style="width: 90px; margin: 0px 8px"
                    v-model:value="item.paramType"
                    placeholder="请选择"
                    :options="argumentargument"
                  ></a-select>
                </div>
                <div>
                  <span> 额定值</span>
                  <a-input-number
                    v-if="item.paramType == 1 || item.paramType == 2"
                    style="width: 80px; margin: 0px 8px"
                    :disabled="item.id"
                    :min="0"
                    id="inputNumber"
                    v-model:value="item.ratedValue"
                  />
                  <a-input
                    v-if="item.paramType == 3"
                    :disabled="item.id"
                    style="width: 80px; margin: 0px 8px"
                    v-model:value="item.ratedValue"
                  />
                  <a-switch
                    v-if="item.paramType == 4"
                    :disabled="item.id"
                    style="margin: 0px 8px"
                    v-model:checked="item.ratedValue"
                  />
                </div>
                <div>
                  <span> 单位</span>
                  <a-select
                    style="width: 80px; margin: 0px 8px"
                    :disabled="item.id"
                    v-model:value="item.paramUnit"
                    placeholder="请选择"
                    :options="ruleConditionList"
                  ></a-select>
                </div>
              </div>

              <a-button type="link" class="w50px!" @click="delItem(index)">
                <svg-icon name="del" size="22" class="mr-6px"></svg-icon
              ></a-button>
              <a-button
                v-if="index == formData.params.length - 1"
                type="link"
                class="w50px!"
                @click="addItem()"
              >
                <svg-icon name="add" size="16" class="mr-6px"></svg-icon
              ></a-button>
            </div>
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
  import { defineComponent, ref, reactive, watch } from 'vue';
  import { USER__INFO } from '@/enums/cacheEnum';
  import { message } from 'ant-design-vue';
  import { Storage } from '@/utils/Storage';
  import { regCheck } from '@/utils/validate';
  import { befitPwd, idCard, passport } from '@/utils/reg-exp.js';
  import {
    configParams,
    ConfigTypes,
    deleteconfigUPS,
    upDateconfigUPS,
    configUPS,
    addParams,
  } from '@/api/alarmList';
  import { hasOwn } from '@vueuse/core';
  import { stringify } from 'querystring';

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
      isUpdate: {
        type: Boolean,
        default: false,
      },
      recordData: {
        type: Object,
        default: () => {},
      },
    },
    components: {},
    setup(props, context) {
      const formRef = ref();
      const tableItem = () => {
        return {
          cmd: '',
          autoSend: false,
          sendInterval: '',
          enabled: false,
          params: [
            {
              paramName: '',
              paramKey: '',
              paramType: 1,
              paramUnit: '',
              ratedValue: null,
            },
          ],
        };
      };
      const formData = ref<any>(tableItem());
      const submitLoading = ref<boolean>(false);
      const ruleConditionList = ref<any>([
        {
          lable: 'V',
          value: 'V',
        },
        {
          lable: '℃',
          value: '℃',
        },
        {
          lable: 'Hz',
          value: 'Hz',
        },
        {
          lable: '%',
          value: '%',
        },
      ]);
      const rulesOptions = ref<any>([]);
      const argumentargument = ref<any>([]);
      const deleteIds = ref<any>([]);

      const rules = reactive({
        cmd: [{ required: true, message: '请填写等级' }],
        sendInterval: [{ required: true, message: '请填写证件类型' }],
      });
      watch(
        () => props.recordData,
        (val: any) => {
          if (Object.getOwnPropertyNames(val).length) {
            formData.value = JSON.parse(JSON.stringify(val));
            if (!val.params.length) {
              formData.value.params = [
                {
                  paramName: '',
                  paramKey: '',
                  paramType: 1,
                  paramUnit: '',
                  ratedValue: null,
                },
              ];
            }
          } else {
            formData.value = tableItem();
          }
        },
        {
          immediate: true,
          deep: true,
        },
      );

      /* 获取参数分页列表 */
      const getConfigPage = () => {
        ConfigTypes().then((res) => {
          argumentargument.value = res.map((v) => {
            return {
              label: v.name,
              value: v.value,
            };
          });
        });
      };
      getConfigPage();

      /* 获取UPS数据配置参数列表 */
      const getConfigParams = ($event, index) => {
        for (let i = 0; i < formData.value.length; i++) {
          const v = formData.value[i];
          if (i != index && v.configId == $event) {
            message.warning('指令选择重复');
            formData.value[index].configId = '';
            return;
          }
        }

        configParams({ configId: $event }).then((res) => {
          formData.value[index].argumentargument = res.map((v) => {
            return {
              label: v.paramName,
              value: v.id,
              ratedValue: v.ratedValue,
              paramUnit: v.paramUnit,
            };
          });
        });
      };
      /**
       * 弹窗关闭
       */
      const close = () => {
        context.emit('close', false);
        clearData();
      };

      /*  清除数据 */
      const clearData = () => {
        formData.value = [];
        deleteIds.value = [];
      };
      const delItem = (index) => {
        if (props.isUpdate && formData.value.params[index]?.id) {
          deleteIds.value.push(formData.value.params[index]?.id);
        }
        formData.value.params.splice(index, 1);
      };
      const addItem = (index) => {
        formData.value.params.push({
          paramName: '',
          paramKey: '',
          paramType: 1,
          paramUnit: '',
          ratedValue: null,
        });
      };
      /**
       * 提交
       */
      async function submit() {
        formRef.value.validate().then(async () => {
          for (let i = 0; i < formData.value.params.length; i++) {
            const v = formData.value.params[i];
            if (!v.paramName || !v.paramKey) {
              message.warning('请将每一项填写完整');
              return;
            }
          }
          if (!props.isUpdate) {
            const data = {
              cmd: formData.value.cmd,
              autoSend: formData.value.autoSend,
              sendInterval: formData.value.sendInterval,
              enabled: formData.value.enabled,
              // params: formData.value.params,
            };
            submitLoading.value = true;
            try {
              const res = await configUPS(data);
              if (addParamsC(res)) addParams(addParamsC(res));
              message.success(`新增成功`);
              close();
              context.emit('getList');
              clearData();
            } finally {
              submitLoading.value = false;
            }
          } else {
            const data = {
              id: formData.value.id,
              cmd: formData.value.cmd,
              autoSend: formData.value.autoSend,
              sendInterval: formData.value.sendInterval,
              enabled: formData.value.enabled,
            };
            submitLoading.value = true;
            try {
              if (addParamsC(formData.value.id)) addParams(addParamsC(formData.value.id));
              if (deleteIds.value.length) await deleteconfigUPS({ ids: deleteIds.value });
              await upDateconfigUPS(data);
              message.success(`编辑成功`);
              close();
              context.emit('getList');
              clearData();
            } finally {
              submitLoading.value = false;
            }
          }
        });
      }

      /* 新增参数 */
      function addParamsC(id) {
        const params: any = [];
        for (let i = 0; i < formData.value.params.length; i++) {
          const v = formData.value.params[i];
          if (!v.id) params.push(v);
        }
        const data = {
          configId: id,
          params,
        };
        return params.length > 0 ? data : null;
      }
      return {
        rules,
        formRef,
        submitLoading,
        argumentargument,
        ruleConditionList,
        rulesOptions,
        formData,
        close,
        clearData,
        getConfigParams,
        addItem,
        delItem,
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
