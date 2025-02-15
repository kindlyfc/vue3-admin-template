<template>
  <div>
    <a-button type="primary" @click="open = true">前往配置</a-button>

    <a-drawer
      v-model:open="open"
      width="calc(100vw - 200px)"
      title="主题编辑与预览"
      placement="right"
    >
      <div class="flex">
        <div class="w-500px">
          <div class="font-bold mb-20px">主题编辑</div>
          <a-divider orientation="left">颜色</a-divider>

          <div class="relative pr-30px">
            <div class="config-item">
              <span>
                <a-tooltip
                  title="内容主色调，包括基本按钮颜色，按钮悬停颜色，按钮边框色，表单组件激活时边框颜色等"
                >
                  主题色：<QuestionCircleOutlined />
                </a-tooltip>
              </span>
              <div class="color">
                <span class="">{{ form.colorPrimary }}</span>
                <div
                  class="color_box ml-20px"
                  :style="{ background: form.colorPrimary }"
                  @click="showColorPicker('colorPrimary')"
                ></div>
              </div>
            </div>
            <div class="config-item">
              <a-tooltip title="用于表示操作成功，如表单提交成功、上传进度，成功状态标签等组件">
                <span>成功色：</span>
                <QuestionCircleOutlined />
              </a-tooltip>
              <div class="color">
                <span class="">{{ form.colorSuccess }}</span>
                <div
                  class="color_box ml-20px"
                  :style="{ background: form.colorSuccess }"
                  @click="showColorPicker('colorSuccess')"
                ></div>
              </div>
            </div>
            <div class="config-item">
              <a-tooltip title="用于表示警戒状态提示，警戒状态标签等组件">
                <span>警戒色：</span>
                <QuestionCircleOutlined />
              </a-tooltip>
              <div class="color">
                <span class="">{{ form.colorWarning }}</span>
                <div
                  class="color_box ml-20px"
                  :style="{ background: form.colorWarning }"
                  @click="showColorPicker('colorWarning')"
                ></div>
              </div>
            </div>
            <div class="config-item">
              <a-tooltip title="用于表示错误状态提示，错误状态标签、删除按钮等组件">
                <span>错误色：</span>
                <QuestionCircleOutlined />
              </a-tooltip>
              <div class="color">
                <span class="">{{ form.colorError }}</span>
                <div
                  class="color_box ml-20px"
                  :style="{ background: form.colorError }"
                  @click="showColorPicker('colorError')"
                ></div>
              </div>
            </div>
            <div class="config-item">
              <a-tooltip title="用于链接类按钮颜色（如表格中查看、编辑等操作按钮），删除按钮除外">
                <span>信息色：</span>
                <QuestionCircleOutlined />
              </a-tooltip>
              <div class="color">
                <span class="">{{ form.colorInfo }}</span>
                <div
                  class="color_box ml-20px"
                  :style="{ background: form.colorInfo }"
                  @click="showColorPicker('colorInfo')"
                ></div>
              </div>
            </div>
            <div class="config-item">
              <a-tooltip title="用于全局基础文本色">
                <span>文本色：</span>
                <QuestionCircleOutlined />
              </a-tooltip>
              <div class="color">
                <span class="">{{ form.colorTextBase }}</span>
                <div
                  class="color_box ml-20px"
                  :style="{ background: form.colorTextBase }"
                  @click="showColorPicker('colorTextBase')"
                ></div>
              </div>
            </div>

            <Sketch v-show="panelVisible" class="sketch" @changButton="changSketchButton" />
          </div>

          <a-divider orientation="left">尺寸</a-divider>

          <div class="pr-30px">
            <div class="config-item">
              <a-tooltip title="用于全局基础文本字号，单位px取值12-32">
                <span>默认字号：</span>
                <QuestionCircleOutlined />
              </a-tooltip>
              <div class="color">
                <a-input-number v-model:value="form.fontSize" :min="12" :max="32" />
              </div>
            </div>
            <div class="config-item">
              <a-tooltip title="用于全局基础文本字号，取值0.1-3">
                <span>行高：</span>
                <QuestionCircleOutlined />
              </a-tooltip>
              <div class="color">
                <a-input-number v-model:value="form.lineHeight" :step="0.1" :min="0.5" :max="3" />
              </div>
            </div>
            <div class="config-item">
              <a-tooltip
                title="用于控制组件尺寸的基础步长，尺寸步长结合尺寸变化单位，就可以派生各种尺寸梯度。通过调整步长即可得到不同的布局模式，取值4-16"
              >
                <span>尺寸步长：</span>
                <QuestionCircleOutlined />
              </a-tooltip>
              <div class="color">
                <a-input-number v-model:value="form.sizeStep" :min="4" :max="16" />
              </div>
            </div>
            <div class="config-item">
              <a-tooltip title="用于控制组件尺寸的变化单位 ，便于更加细致地控制尺寸梯度，取值1-16">
                <span>尺寸变化单位：</span>
                <QuestionCircleOutlined />
              </a-tooltip>
              <div class="color">
                <a-input-number v-model:value="form.sizeUnit" :min="1" :max="16" />
              </div>
            </div>
          </div>

          <a-divider orientation="left">风格</a-divider>
          <div class="pr-30px">
            <div class="config-item">
              <a-tooltip title="基础组件的圆角大小，例如按钮、输入框、卡片等，取值0-16">
                <span>基础圆角：</span>
                <QuestionCircleOutlined />
              </a-tooltip>
              <div class="color">
                <a-input-number v-model:value="form.borderRadius" :min="0" :max="16" />
              </div>
            </div>
            <div class="config-item">
              <a-tooltip title="用于将组件的视觉效果变为线框化">
                <span>线框风格：</span>
                <QuestionCircleOutlined />
              </a-tooltip>
              <div class="color">
                <a-switch v-model:checked="form.wireframe" />
              </div>
            </div>
            <div class="flex justify-center">
              <a-button class="w-500px" type="primary" :loading="loading" @click="submitForm"
                >确定</a-button
              >
            </div>
          </div>
        </div>
        <a-divider type="vertical h-auto mr-20px" />

        <!-- 预览效果区域 -->

        <div class="preview">
          <div class="font-bold mb-20px">效果预览</div>
          <div class="top_search">
            <div class="mr1.5vw">
              <span>姓名：</span>
              <a-input placeholder="请输入姓名"></a-input>
            </div>
            <div class="mr1.5vw">
              <span>部门：</span>
              <a-input placeholder="请选择部门"></a-input>
            </div>
            <div class="mr1.5vw">
              <span>日期：</span>
              <a-date-picker></a-date-picker>
            </div>
            <div class="flex ml-auto">
              <a-button class="mr-20px">查询</a-button>
              <a-button>重置</a-button>
            </div>
          </div>
          <div>
            <div class="flex-end mb-20px">
              <div class="flex">
                <a-button type="primary" class="mr-20px">新增人员</a-button>
                <a-button type="primary" class="mr-20px">导出</a-button>
                <a-button class="exportRecords" type="primary">
                  <svg-icon name="bigdataExport" size="18" class="mr-4px text-white"></svg-icon
                  >导出记录</a-button
                >
              </div>
            </div>

            <a-table
              :columns="columns"
              :data-source="data"
              :scroll="{ x: 1000, y: 'calc(100vh - 730px)' }"
              class="mb-10px"
            >
              <template #bodyCell="{ column }">
                <template v-if="column.key === 'operation'">
                  <div>
                    <a-button type="link">查看</a-button>
                    <a-button type="link">编辑</a-button>
                    <a-button type="link" danger>删除</a-button>
                  </div>
                </template>
              </template>
            </a-table>
            <div>
              <a-radio :checked="true">单选框</a-radio>
              <a-checkbox :checked="false">多选框</a-checkbox>
              <a-checkbox :checked="true">多选框选中</a-checkbox>
              <a-switch :checked="true" class="mr-40px"></a-switch>
              <a-radio-group value="a" button-style="solid" class="mr-30px">
                <a-radio-button value="a">标签页1</a-radio-button>
                <a-radio-button value="b">标签页2</a-radio-button>
                <a-radio-button value="c">标签页3</a-radio-button>
              </a-radio-group>
              <a-tag color="success">成功状态</a-tag>
              <a-tag color="warning">警戒状态</a-tag>
              <a-tag color="error">错误状态</a-tag>
              <a-spin class="ml-40px" />
            </div>
            <div class="flex mt-10px">
              <a-calendar class="w-585px" :fullscreen="false" />
              <a-timeline class="relative left-20px top-20px">
                <a-timeline-item>Create a services site 2015-09-01</a-timeline-item>
                <a-timeline-item>Solve initial network problems 2015-09-01</a-timeline-item>
                <a-timeline-item>Technical testing 2015-09-01</a-timeline-item>
                <a-timeline-item>Network problems being solved 2015-09-01</a-timeline-item>
                <a-timeline-item>Create a services site 2015-09-01</a-timeline-item>
                <a-timeline-item>Solve initial network problems 2015-09-01</a-timeline-item>
                <a-timeline-item>Technical testing 2015-09-01</a-timeline-item>
                <a-timeline-item>Network problems being solved 2015-09-01</a-timeline-item>
              </a-timeline>
            </div>
          </div>
        </div>
      </div>
    </a-drawer>
  </div>
</template>

<script lang="ts" setup>
  import { ref, computed, watch } from 'vue';
  import type { TableColumnsType } from 'ant-design-vue';
  import { Sketch } from '@ans1998/vue3-color';
  import { useUiStore } from '@/store/modules/uiConfig';
  import { message } from 'ant-design-vue';
  import { QuestionCircleOutlined } from '@ant-design/icons-vue';
  import { itemModify } from '@/api/uiConfig';
  import { cloneDeep } from 'lodash-es';

  const uiStore = useUiStore();

  const open = ref(false);

  // S 主题编辑
  const form = ref<any>();
  watch(
    () => uiStore.themeConfig.token,
    (newVal) => {
      form.value = cloneDeep(newVal);
    },
  );

  const changeConfig = async () => {
    delete form.value.deleteFlag;
    await itemModify(form.value);
    message.success('操作成功');
  };

  const panelVisible = ref(false);

  let colorName = '';

  const showColorPicker = (name: string) => {
    colorName = name;
    panelVisible.value = true;
  };

  const changSketchButton = (item) => {
    panelVisible.value = false;
    if (item.isOk) {
      form.value[colorName] = '#' + item.hex;
    }
  };

  const loading = ref(false);
  const submitForm = async () => {
    loading.value = true;
    try {
      await itemModify(form.value);
      message.success('操作成功');
      uiStore.getItemList();
    } finally {
      loading.value = false;
    }
  };

  // E 主题编辑

  // S 效果预览
  const columns: TableColumnsType = [
    { title: '姓名', dataIndex: 'name', key: 'name' },
    { title: '年龄', dataIndex: 'age', key: 'age' },
    { title: '单元格1', dataIndex: 'address', key: '1' },
    { title: '单元格2', dataIndex: 'address', key: '2' },
    { title: '单元格3', dataIndex: 'address', key: '3' },
    {
      title: '操作',
      key: 'operation',
      width: 260,
    },
  ];

  interface DataItem {
    key: number;
    name: string;
    age: number;
    address: string;
  }

  const data: DataItem[] = [];
  for (let i = 0; i < 100; i++) {
    data.push({
      key: i,
      name: `Edrward ${i}`,
      age: 32,
      address: `London Park no. ${i}`,
    });
  }
  // E 效果预览
</script>
<style scoped lang="less">
  .preview {
    width: calc(100% - 600px);
  }

  :deep(.ant-form-item-control-input-content) {
    > * {
      float: right !important;
    }
  }

  .config-item {
    display: flex;
    align-items: center;
    margin-bottom: 25px;

    .color {
      display: flex;
      align-items: center;
      margin-left: auto;
    }
  }

  .sketch {
    position: absolute;
    top: 0;
    left: 95px;
  }
</style>
