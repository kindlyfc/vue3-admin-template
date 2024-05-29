<template>
  <div>
    <a-modal
      v-if="visible"
      :visible="visible"
      :width="750"
      title="规则编辑"
      centered
      :destroyOnClose="true"
      :footer="null"
      @cancel="close"
    >
      <div>
        <!-- 信息录入区域 S -->
        <!-- <div class="top">
          <a-form ref="formRef" :rules="rules" :labelCol="{ span: 5 }">
            <a-row>
              <a-col :span="12">
                <a-form-item name="source" label="指令">
                  <a-select
                    v-model:value="configId"
                    placeholder="请先选择告警规则"
                    :options="rulesOptions"
                    @change="getConfigParams($event)"
                  ></a-select>
                </a-form-item>
              </a-col>
            </a-row>

            <div mt6px>
              <div flex-c v-for="(item, index) in reuleList" :key="item.name">
                <div flex-c w550px>
                  <a-select
                    style="width: 140px; margin: 0 8px"
                    v-model:value="item.paramId"
                    placeholder="请选择"
                    :options="argumentargument"
                    @change="setUnit($event, index)"
                  ></a-select>

                  <div v-if="item.ratedValue">
                    <span>额定值</span>
                    <a-input
                      style="width: 100px; margin: 0 8px"
                      v-model:value="item.ratedValue"
                      disabled
                      placeholder="请输入"
                    ></a-input>
                    <span w18px inline-block>{{ item.paramUnit }}</span>
                  </div>
                  <div>
                    <a-select
                      style="width: 80px; margin: 4px 8px"
                      v-model:value="item.ruleCondition"
                      placeholder="请选择"
                      :options="ruleConditionList"
                    ></a-select>
                    <a-input-number id="inputNumber" v-model:value="item.alarmValue" />
                    <span w12px inline-block ml4px> {{ item.paramUnit }} </span>
                  </div>
                </div>

                <a-button type="link" class="w50px!" @click="delItem(index)">
                  <svg-icon name="del" size="22" class="mr-6px"></svg-icon
                ></a-button>
                <a-button
                  v-if="index == reuleList.length - 1"
                  type="link"
                  class="w50px!"
                  @click="addItem()"
                >
                  <svg-icon name="add" size="16" class="mr-6px"></svg-icon
                ></a-button>
              </div>
            </div>
          </a-form>
        </div> -->
        <div v-if="!isDisable" flex justify-end mb5px>
          <a-button type="link" @click="addOrder()">
            <svg-icon name="add" size="16" class="mr-6px"></svg-icon>新增指令</a-button
          >
        </div>
        <a-table
          :columns="columns"
          :row-key="(record) => record.configId"
          :scroll="{ y: '50vh' }"
          :data-source="dataSource"
          class="components-table-demo-nested"
          @expand="expand"
        >
          <template #bodyCell="{ column, record, index }">
            <template v-if="column.key === 'name'">
              <a-select
                v-if="!record.isDisBable"
                style="width: 200px"
                :disabled="isDisable"
                v-model:value="record.configId"
                placeholder="请选择指令"
                :options="rulesOptions"
                @change="getConfigParams($event, index)"
              ></a-select>
              <span v-else>{{ record.name }}</span>
            </template>
            <template v-if="column.key === 'operation'">
              <a-button :disabled="isDisable" type="link" danger @click="deleteOrder(index)">
                删除
              </a-button>
            </template>
          </template>
          <template #expandedRowRender="{ record, index }">
            <div flex-c v-for="(item, index1) in record.rules" :key="item.index1">
              <div flex-c w550px>
                <a-select
                  :disabled="isDisable"
                  style="width: 140px; margin: 0 8px"
                  v-model:value="item.paramId"
                  placeholder="请选择"
                  :options="record.argumentargument"
                  @change="setUnit($event, index, index1)"
                ></a-select>

                <div v-if="item.ratedValue">
                  <span>额定值</span>
                  <a-input
                    style="width: 100px; margin: 0 8px"
                    v-model:value="item.ratedValue"
                    disabled
                    placeholder="请输入"
                  ></a-input>
                  <span w18px inline-block>{{ item.paramUnit }}</span>
                </div>
                <div>
                  <a-select
                    :disabled="isDisable"
                    style="width: 80px; margin: 4px 8px"
                    v-model:value="item.ruleCondition"
                    placeholder="请选择"
                    :options="ruleConditionList"
                  ></a-select>
                  <a-input-number :min="0" id="inputNumber" v-model:value="item.alarmValue" />
                  <span w12px inline-block ml4px> {{ item.paramUnit }} </span>
                </div>
              </div>

              <a-button
                v-if="!isDisable"
                type="link"
                class="w50px!"
                @click="delItem(index, index1)"
              >
                <svg-icon name="del" size="22" class="mr-6px"></svg-icon
              ></a-button>
              <a-button
                v-if="index1 == record.rules.length - 1 && !isDisable"
                type="link"
                class="w50px!"
                @click="addItem(index)"
              >
                <svg-icon name="add" size="16" class="mr-6px"></svg-icon
              ></a-button> </div
          ></template>
        </a-table>
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
  import { setRules, conditions, dataConfigPage, configParams } from '@/api/alarmList';
  import { cloneDeep } from 'lodash-es';

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
      isDisable: {
        type: Boolean,
        default: false,
      },
      recordData: {
        type: Object,
        default: () => [],
      },
      deviceId: {
        type: Number || null,
        default: null,
      },
    },
    components: {},
    setup(props, context) {
      const formRef = ref();
      const tableItem = () => {
        return {
          name: '',
          configId: '',
          argumentargument: [],
          rules: [
            {
              paramName: '',
              paramId: undefined,
              alarmValue: '',
              ruleCondition: '',
              paramUnit: '',
              ratedValue: '',
            },
          ],
        };
      };
      const dataSource = ref<any>([]);
      const columns = ref<any>([
        {
          title: '指令',
          dataIndex: 'name',
          key: 'name',
          // align: 'center',
        },
        {
          title: '操作',
          dataIndex: 'operation',
          key: 'operation',
          align: 'center',
          width: 200,
        },
      ]);
      const configId = ref<any>();
      const reuleList = ref<any>([]);
      const submitLoading = ref<boolean>(false);
      const ruleConditionList = ref<any>([]);
      const rulesOptions = ref<any>([]);
      const argumentargument = ref<any>([]);

      const rules = reactive({
        levelId: [{ required: true, message: '请填写等级' }],
        name: [{ required: true, message: '请填写姓名' }],
        idType: [{ required: true, message: '请填写证件类型' }],
      });
      watch(
        () => props.recordData,
        (val: any) => {
          dataSource.value = [];
          if (Object.getOwnPropertyNames(val).length) {
            for (let i in val) {
              dataSource.value.push(
                cloneDeep({
                  name: i,
                  isDisBable: true,
                  configId: val[i][0]?.configId,
                  argumentargument: [],
                  rules: [...val[i]],
                }),
              );
            }
          } else {
            dataSource.value = [tableItem()];
          }
        },
        {
          immediate: true,
          deep: true,
        },
      );

      /* 获取告警规则列表 */
      const getConditions = () => {
        conditions().then((res) => {
          ruleConditionList.value = res.map((v) => {
            return {
              label: v.name,
              value: v.value,
            };
          });
        });
      };
      getConditions();

      /* 获取数据配置分页列表 */
      const getConfigPage = () => {
        dataConfigPage({ pageNum: 1, pageSize: 100 }).then((res) => {
          rulesOptions.value = res.records.map((v) => {
            return {
              label: v.cmd,
              value: v.id,
            };
          });
        });
      };
      getConfigPage();

      /* 获取UPS数据配置参数列表 */
      const getConfigParams = ($event, index) => {
        for (let i = 0; i < dataSource.value.length; i++) {
          const v = dataSource.value[i];
          if (i != index && v.configId == $event) {
            message.warning('指令选择重复');
            dataSource.value[index].configId = '';
            return;
          }
        }

        configParams({ configId: $event }).then((res) => {
          dataSource.value[index].argumentargument = res.map((v) => {
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
        dataSource.value = [];
      };
      const delItem = (index, index1) => {
        dataSource.value[index].rules.splice(index1, 1);
      };
      const addItem = (index) => {
        dataSource.value[index].rules.push({
          paramName: '',
          paramId: undefined,
          alarmValue: '',
          ruleCondition: '',
          paramUnit: '',
          ratedValue: '',
        });
      };
      /**
       * 提交
       */
      async function submit() {
        let ruleArr: any = [];
        dataSource.value.forEach((x) => {
          x.rules.forEach((v) => {
            ruleArr.push({
              paramId: v.paramId,
              alarmValue: v.alarmValue,
              ruleCondition: v.ruleCondition,
            });
          });
        });
        for (let i = 0; i < ruleArr.length; i++) {
          const v = ruleArr[i];
          if (
            !v.paramId ||
            (!v.alarmValue && v.alarmValue !== 0) ||
            (!v.ruleCondition && v.ruleCondition !== 0)
          ) {
            message.warning('请将每一项填写完整');
            return;
          }
        }
        const data = {
          deviceId: props.deviceId,
          rules: ruleArr || [],
        };
        submitLoading.value = true;
        try {
          await setRules(data);
          message.success(`编辑成功`);
          close();
          context.emit('getList');
          clearData();
        } finally {
          submitLoading.value = false;
        }
      }

      /* 参数选择 */
      function setUnit($event, index, index1) {
        for (let i = 0; i < dataSource.value.length; i++) {
          const v = dataSource.value[i];
          for (let j = 0; j < v.rules.length; j++) {
            const x = v.rules[j];
            if ($event == x.paramId && j != index1) {
              message.warning('参数选择重复');
              dataSource.value[index].rules[index1].paramId = '';
              return;
            }
          }
        }

        const item = dataSource.value[index].argumentargument.find((v) => v.value == $event);
        dataSource.value[index].rules[index1].paramUnit = item.paramUnit;
        dataSource.value[index].rules[index1].paramName = item.label;
        dataSource.value[index].rules[index1].ratedValue = item.ratedValue;
      }
      /* 列表展开 */
      const expand = (expanded, record) => {
        nextTick(() => {
          let inx: any = null;
          dataSource.value.forEach((v, index) => {
            if (v.configId === record.configId) inx = index;
          });
          configParams({ configId: record.configId }).then((res) => {
            dataSource.value[inx].argumentargument = res.map((v) => {
              return {
                label: v.paramName,
                value: v.id,
                ratedValue: v.ratedValue,
                paramUnit: v.paramUnit,
              };
            });
          });
        });
      };

      /* 指令新增*/
      function addOrder() {
        dataSource.value.push(tableItem());
      }
      /* 指令删除*/
      function deleteOrder(index) {
        dataSource.value.splice(index, 1);
      }

      return {
        rules,
        formRef,
        submitLoading,
        reuleList,
        argumentargument,
        ruleConditionList,
        setUnit,
        configId,
        rulesOptions,
        columns,
        dataSource,
        close,
        clearData,
        getConfigParams,
        addItem,
        delItem,
        expand,
        submit,
        addOrder,
        getConditions,
        deleteOrder,
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
