<template>
  <div>
    <a-modal
      v-if="visible"
      :visible="visible"
      :width="950"
      :title="madalType == 1 ? '告警规则新增' : madalType == 2 ? '告警规则编辑' : '告警规则查看'"
      centered
      :destroyOnClose="true"
      :footer="null"
      @cancel="close"
    >
      <div>
        <!-- 信息录入区域 S -->
        <a-form ref="formRef" :model="formData" :rules="rules" :labelCol="{ span: 6 }">
          <div class="top">
            <a-row>
              <a-col :span="12">
                <div class="title_sty"><span class="text-red">*</span>基础信息</div>
                <a-form-item name="name" label="告警名称">
                  <a-input
                    :disabled="madalType == 3"
                    style="width: 300px"
                    v-model:value="formData.name"
                    placeholder="请输入"
                  ></a-input>
                </a-form-item>
                <a-form-item name="level" label="告警等级">
                  <a-select
                    style="width: 300px"
                    :disabled="madalType == 3"
                    v-model:value="formData.level"
                    placeholder="请选择"
                    :options="levelOptons"
                  ></a-select>
                </a-form-item>
                <a-form-item name="deviceIds" label="设备选择">
                  <a-tree-select
                    v-model:value="formData.deviceIds"
                    show-search
                    :disabled="madalType == 3"
                    style="width: 300px"
                    :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                    placeholder="请选择"
                    allow-clear
                    multiple
                    :maxTagCount="2"
                    tree-default-expand-all
                    :tree-data="treeData"
                    tree-node-filter-prop="label"
                    @change="chooseTree"
                  >
                  </a-tree-select>
                </a-form-item>
                <a-form-item name="description" label="通知内容">
                  <a-input
                    style="width: 300px"
                    :disabled="madalType == 3"
                    v-model:value="formData.description"
                    placeholder="请输入"
                  ></a-input>
                </a-form-item>
                <a-form-item label="规则状态">
                  <a-switch :disabled="madalType == 3" v-model:checked="formData.enabled" />
                </a-form-item>
              </a-col>
            </a-row>
          </div>
          <div class="title_sty"><span class="text-red">*</span>参数条件</div>
          <a-form-item :labelCol="{ span: 3 }" name="configId" label="指 令">
            <a-select
              style="width: 200px"
              :disabled="madalType == 3"
              v-model:value="formData.configId"
              placeholder="请先选择指令筛选参数"
              :options="rulesOptions"
              @change="getConfigParams($event)"
            ></a-select>
          </a-form-item>
        </a-form>

        <div flex-c pl40px mb15px class="paramsCont">
          <div flex class="btn_cont">
            <a-button
              v-if="madalType != 3"
              type="primary"
              class="mr-15px w70px! max-w70px"
              b-rd-6px
              @click="addOrder(paramsList, tableItem())"
            >
              添加
            </a-button>
            <a-button
              v-if="madalType != 3"
              type="danger"
              b-rd-6px
              class="w70px! max-w70px"
              @click="
                () => {
                  deleteOrder(paramsList, paramsIndex);
                  paramsIndex = 100000000;
                }
              "
            >
              删除
            </a-button>
          </div>
          <div v-for="(item, index) in paramsList" :key="index" flex-c mb10px>
            <a-select
              v-if="index != 0"
              :disabled="madalType == 3"
              style="width: 70px"
              v-model:value="item.Condition"
              :options="joinConditionList"
            ></a-select>

            <div
              class="params_box"
              :class="{ disabled: paramsIndex !== index }"
              @click="paramsIndex = index"
              >{{ item.name + (index + 1) }}</div
            >
          </div>
        </div>
        <div pl40px mb15px class="paramsCont pr78px!">
          <div v-for="(item, index) in paramsList[paramsIndex]?.rules" :key="index" flex-bc>
            <div flex-c mb10px>
              <div w30px><span v-if="index != 0">and</span></div>
              <a-select
                :disabled="!formData.configId || madalType == 3"
                style="width: 150px; margin-right: 10px"
                v-model:value="item.paramId"
                :options="argumentargument"
                @select="getParamConditions($event, index)"
              ></a-select>
              <a-select
                :disabled="madalType == 3"
                v-if="item.paramType == 1 || item.paramType == 2 || item.paramType == 3"
                style="width: 100px; margin-right: 10px"
                v-model:value="item.ruleCondition"
                :options="ruleConditionList"
              ></a-select>
              <a-input-number
                :disabled="madalType == 3"
                v-if="item.paramType == 1 || item.paramType == 2"
                :min="0"
                id="inputNumber"
                style="width: 150px"
                v-model:value="item.alarmValue"
                placeholder="请输入"
              ></a-input-number>
              <a-input
                v-if="item.paramType == 3"
                :disabled="madalType == 3"
                style="width: 150px"
                v-model:value="item.alarmValue"
              />
              <span v-if="item.paramType == 4">时</span>
              <span v-else ml4px>{{ item.paramUnit || '' }}</span>
            </div>
            <div flex-c w110px>
              <a-button
                v-if="index !== 0 && madalType != 3"
                type="link"
                class="w50px!"
                @click="delItem(paramsList, paramsIndex, index)"
              >
                <svg-icon name="del" size="22" class="mr-6px"></svg-icon
              ></a-button>
              <a-button
                v-if="index == paramsList[paramsIndex]?.rules.length - 1 && madalType != 3"
                type="link"
                class="w50px!"
                @click="
                  addItem(paramsList, paramsIndex, {
                    paramName: '',
                    paramId: undefined,
                    ruleCondition: '',
                    alarmValue: '',
                    paramKey: '',
                    paramUnit: '',
                    configId: '',
                    groupNo: '',
                    paramType: '',
                  })
                "
              >
                <svg-icon name="add" size="16" class="mr-6px"></svg-icon
              ></a-button>
            </div>
          </div>
        </div>
        <div class="title_sty"><span class="text-#fff">*</span>时间条件</div>
        <div flex-c pl40px mb15px class="paramsCont">
          <div flex class="btn_cont">
            <a-button
              v-if="madalType != 3"
              type="primary"
              class="mr-15px w70px! max-w70px"
              b-rd-6px
              @click="addOrder(timeList, timeItem())"
            >
              添加
            </a-button>
            <a-button
              v-if="madalType != 3"
              type="danger"
              b-rd-6px
              class="w70px! max-w70px"
              @click="
                () => {
                  deleteOrder(timeList, timeIndex);
                  timeIndex = 100000000;
                }
              "
            >
              删除
            </a-button>
          </div>
          <div v-for="(item, index) in timeList" :key="index" flex-c mb10px>
            <a-select
              v-if="index != 0 && madalType != 3"
              :disabled="madalType == 3"
              style="width: 70px"
              v-model:value="item.Condition"
              :options="joinConditionList"
            ></a-select>
            <div
              class="params_box"
              :class="{ disabled: timeIndex !== index }"
              @click="timeIndex = index"
              >{{ item.name + (index + 1) }}</div
            >
          </div>
        </div>
        <div pl40px mb15px class="paramsCont pr78px!">
          <div v-for="(item, index) in timeList[timeIndex]?.rules" :key="index" flex-bc>
            <div flex-c mb10px>
              <div w30px><span v-if="index != 0">and</span></div>
              <a-select
                style="width: 150px; margin-right: 10px"
                :disabled="madalType == 3"
                v-model:value="item.paramId"
                @change="setTIime($event, index)"
                :options="[
                  {
                    label: '冬季时间',
                    value: '1',
                  },
                  {
                    label: '夏季时间',
                    value: '2',
                  },
                  {
                    label: '手动',
                    value: '3',
                  },
                ]"
              ></a-select>
              <a-date-picker
                :disabled="madalType == 3"
                v-model:value="item.startDate"
                value-format="MM-DD"
                format="MM-DD"
              />
              <span> ~ </span>
              <a-date-picker
                :disabled="madalType == 3"
                v-model:value="item.endDate"
                value-format="MM-DD"
                format="MM-DD"
              />
            </div>
            <div flex-c w110px>
              <a-button
                v-if="index !== 0 && madalType != 3"
                type="link"
                class="w50px!"
                @click="delItem(timeList, timeIndex, index)"
              >
                <svg-icon name="del" size="22" class="mr-6px"></svg-icon
              ></a-button>
              <a-button
                v-if="index == timeList[timeIndex]?.rules.length - 1 && madalType != 3"
                type="link"
                class="w50px!"
                @click="
                  addItem(timeList, timeIndex, {
                    timeId: undefined,
                    startDate: '',
                    endDate: '',
                    groupNo: '',
                  })
                "
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
          <a-button
            v-if="madalType != 3"
            class="mr-20px"
            :loading="submitLoading"
            type="primary"
            @click="submit"
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
  import {
    setRules,
    conditions,
    dataConfigPage,
    configParams,
    joinConds,
    availableDevices,
    ruleDetail,
  } from '@/api/alarmList';

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
      madalType: {
        type: Number,
        default: 1,
      },
      recordData: {
        type: Array,
        default: () => [],
      },
      levelOptons: {
        type: Array,
        default: () => [],
      },
      ruleRecord: {
        type: Number || null,
        default: null,
      },
    },
    components: {},
    setup(props, context) {
      const formRef = ref();
      const tableItem = () => {
        return {
          name: '条件',
          Condition: 1,
          rules: [
            {
              paramName: '',
              paramId: undefined,
              ruleCondition: '',
              alarmValue: '',
              paramKey: '',
              paramUnit: '',
              configId: '',
              groupNo: '',
              paramType: '',
            },
          ],
        };
      };
      const timeItem = () => {
        return {
          name: '条件',
          Condition: 1,
          rules: [
            {
              timeId: undefined,
              startDate: '',
              endDate: '',
              groupNo: '',
            },
          ],
        };
      };
      const paramsList = ref<any>([tableItem()]);
      const timeList = ref<any>([timeItem()]);
      const paramsIndex = ref<any>(0);
      const timeIndex = ref<any>(0);
      const configId = ref<any>();
      const reuleList = ref<any>([]);
      const submitLoading = ref<boolean>(false);
      const ruleConditionList = ref<any>([]);
      const rulesOptions = ref<any>([]);
      const joinConditionList = ref<any>([]);
      const treeData = ref<any>([]);
      const argumentargument = ref<any>([]);
      const formData = ref<any>({
        id: '',
        name: '',
        level: '',
        description: '',
        enabled: true,
        deviceIds: [],
        configId: null,
      });

      const rules = reactive({
        level: [{ required: true, message: '必填项' }],
        name: [{ required: true, message: '必填项' }],
        description: [{ required: true, message: '必填项' }],
        deviceIds: [{ required: true, message: '必填项' }],
        configId: [{ required: true, message: '必选项' }],
      });
      watch(
        () => props.ruleRecord,
        (val: any) => {
          if (val?.id) {
            paramsList.value = [];
            timeList.value = [];
            setTimeout(() => {
              ruleDetail({ ruleId: val.id }).then((res) => {
                const {
                  id,
                  name,
                  level,
                  description,
                  enabled,
                  devices,
                  paramConditions,
                  timeConditions,
                  groups,
                } = res;
                getConfigParams(paramConditions[0]?.configId);
                setTimeout(() => {
                  formData.value = {
                    id,
                    name: name || val.name,
                    level: level || val.level,
                    description: description || val.description,
                    enabled,
                    deviceIds: devices.map((v) => v.deviceId),
                    configId: paramConditions[0]?.configId,
                  };
                  const arr1 = Array.from(new Set(paramConditions.map((v) => v.groupNo)));
                  const arr2 = Array.from(new Set(timeConditions.map((v) => v.groupNo)));
                  arr1.forEach((x) => {
                    const rules: any = [];
                    paramConditions.forEach((v, index) => {
                      if (v.groupNo == x) {
                        rules.push({ ...v });
                      }
                    });
                    console.log(getCondition(groups, x, 1), 'groups, x, 1)');
                    paramsList.value.push({
                      name: '条件',
                      Condition: getCondition(groups, x, 1),
                      rules,
                    });
                  });
                  arr2.forEach((x) => {
                    const rules: any = [];
                    timeConditions.forEach((v, index) => {
                      if (v.groupNo == x) {
                        rules.push({ ...v });
                      }
                    });

                    timeList.value.push({
                      name: '条件',
                      Condition: getCondition(groups, x, 2),
                      rules,
                    });
                  });
                });
              });
            });
          }
        },
        {
          immediate: true,
          deep: true,
        },
      );

      /* 寻找对应关系条件 */
      const getCondition = (groups, No, type) => {
        const joinCond =
          groups.find((v) => {
            return No == v.groupNo && type == v.type;
          })?.joinCond || null;
        console.log(joinCond, groups, No, '8988', type);
        return !joinCond ? null : joinCond == 'OR' || joinCond == 'or' || joinCond == 2 ? 2 : 1;
      };

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
      /* 获取连接条件列表 */
      const getJoinConds = () => {
        joinConds().then((res) => {
          joinConditionList.value = res.map((v) => {
            return {
              label: v.name,
              value: v.value,
            };
          });
        });
      };
      getJoinConds();
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

      /* 获取可配置规则的设备列表 */
      const getaAailableDevices = () => {
        availableDevices().then((res) => {
          treeData.value = [];
          res.forEach((v) => {
            let children = [];
            if (v.upsList?.length > 0) {
              children = v.upsList.map((x) => {
                return {
                  label: x.name,
                  value: x.id,
                  deviceSerial: x.deviceSerial,
                  disabled: x.ruleInUse,
                };
              });
            }
            treeData.value.push({
              label: v.gridName,
              value: v.gridId,
              selectable: false,
              children,
            });
          });
        });
      };
      getaAailableDevices();

      /* 获取UPS数据配置参数列表 */
      const getConfigParams = ($event) => {
        configParams({ configId: $event }).then((res) => {
          argumentargument.value = res.map((v) => {
            return {
              label: v.paramName,
              value: v.id,
              paramKey: v.paramKey,
              paramType: v.paramType,
              paramUnit: v.paramUnit,
              configId: v.configId,
            };
          });
        });
      };

      /* 获取对应参数值 */
      const getParamConditions = ($event, index) => {
        const item = argumentargument.value.find((v) => v.value == $event);
        let rule = paramsList.value[paramsIndex.value].rules[index];
        if (item.paramType == 4) {
          rule.alarmValue = true;
          rule.ruleCondition = 5;
        }
        rule = {
          ...rule,
          paramKey: item.paramKey,
          paramType: item.paramType,
          paramUnit: item.paramUnit,
          configId: item.configId,
          paramId: item.value,
          paramName: item.label,
        };
        paramsList.value[paramsIndex.value].rules[index] = JSON.parse(JSON.stringify(rule));
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
        formRef.value.resetFields();
        formData.value = {
          id: '',
          ids: '',
          name: '',
          level: '',
          description: '',
          enabled: true,
          deviceIds: [],
          configId: null,
        };
        paramsList.value = [tableItem()];
        timeList.value = [timeItem()];
      };
      const delItem = (List, index, index1) => {
        const item = List[index]?.rules.splice(index1, 1);
      };
      const addItem = (List, index, item) => {
        List[index]?.rules.push(item);
      };

      /* 树选择寻求id集合 */
      const chooseTree = (value, label, extra) => {
        console.log(value, label, extra, 999999);
      };
      /**
       * 提交
       */
      async function submit() {
        formRef.value.validate().then(async () => {
          const { id, name, level, description, enabled, deviceIds } = formData.value;
          let paramConditions: any = [];
          let timeConditions: any = [];
          let groups: any = [];

          paramsList.value.forEach((v, index) => {
            v.rules.forEach((x) => {
              paramConditions.push({
                ...x,
                alarmValue: x.alarmValue.toString(),
                groupNo: index + 1,
              });
            });
            groups.push({
              name: v.name + (index + 1),
              groupNo: index + 1,
              joinCond: v.Condition,
              type: 1,
            });
          });
          timeList.value.forEach((v, index) => {
            v.rules.forEach((x) => {
              timeConditions.push({
                startDate: x.startDate,
                endDate: x.endDate,
                groupNo: index + 1,
              });
            });
            groups.push({
              name: v.name + (index + 1),
              groupNo: index + 1,
              joinCond: v.Condition,
              type: 2,
            });
          });

          if (!paramConditions.length) {
            message.warning('请添加参数条件');
            return;
          }
          for (let i = 0; i < paramConditions.length; i++) {
            const v = paramConditions[i];
            if (
              !v.paramId ||
              (!v.alarmValue && v.alarmValue !== 0) ||
              (v.paramType != 4 && !v.ruleCondition && v.ruleCondition !== 0)
            ) {
              message.warning('请将参数条件每一项填写完整');
              return;
            }
          }
          if (!timeConditions.length) {
            message.warning('请添加时间条件');
            return;
          }
          for (let i = 0; i < timeConditions.length; i++) {
            const v = timeConditions[i];
            if (!v.startDate || !v.endDate) {
              message.warning('请将时间条件每一项填写完整');
              return;
            }
          }
          for (let i = 0; i < groups.length; i++) {
            const v = groups[i];
            if (!v.joinCond) {
              message.warning('请将条件间关系填写完整');
              return;
            }
          }
          const data = {
            id,
            name,
            level,
            description,
            enabled,
            deviceIds,
            paramConditions,
            timeConditions,
            groups,
          };
          if (props.madalType == 1) delete data.id;
          // const promise = props.madalType == 1 ? setRules(data) : upDateRules(data);
          submitLoading.value = true;
          try {
            await setRules(data);

            message.success(`保存成功`);
            close();
            context.emit('getList');
            clearData();
          } finally {
            submitLoading.value = false;
          }
        });
      }

      /* 参数选择 */
      function setUnit($event, index, index1) {}
      /* 列表展开 */
      const expand = (expanded, record) => {};

      /*新增*/
      function addOrder(List, Item) {
        List.push(Item);
      }
      /* 删除*/
      function deleteOrder(List, index) {
        List.splice(index, 1);
      }

      function setTIime($event, index) {
        const data = timeList.value[timeIndex.value].rules[index];
        switch ($event) {
          case '1':
            data.startDate = '10-01';
            data.endDate = '03-31';
            break;
          case '2':
            data.startDate = '04-01';
            data.endDate = '09-30';
            break;
          default:
            data.startDate = '';
            data.endDate = '';
            break;
        }
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
        setTIime,
        close,
        clearData,
        getConfigParams,
        addItem,
        delItem,
        expand,
        submit,
        addOrder,
        tableItem,
        timeItem,
        getConditions,
        deleteOrder,
        chooseTree,
        getParamConditions,
        joinConditionList,
        timeList,
        treeData,
        formData,
        paramsList,
        paramsIndex,
        timeIndex,
      };
    },
  });
</script>

<style lang="less" scoped>
  .title_sty {
    font-size: 18px;
    margin-bottom: 16px;
    padding-left: 30px;
  }

  .ant-form-item {
    margin-bottom: 16px !important;
  }

  .paramsCont {
    position: relative;
    padding-right: 130px;
    flex-wrap: wrap;

    .params_box {
      width: 110px;
      height: 32px;
      border: 1px solid #dbd6d6;
      border-radius: 6px;
      text-align: center;
      line-height: 32px;
      cursor: pointer;
    }

    .btn_cont {
      right: 10px;
      top: 0;
      position: absolute;
    }
  }

  .disabled {
    background-color: #dddcdc !important;
  }

  .ant-picker {
    border-radius: 6px !important;
  }
</style>
