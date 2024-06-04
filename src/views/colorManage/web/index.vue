<template>
  <div class="flex">
    <div class="w-600px!">
      <div class="font-bold mb-20px">主题切换</div>
      <div class="top_search">
        <div class="mr1.5vw">
          <span class="label">选择主题：</span>
          <a-select
            v-model:value="themeAlgorithm"
            @change="changeTheme"
            placeholder="请选择"
            :options="[
              { value: 'defaultAlgorithm', label: '默认' },
              { value: 'darkAlgorithm', label: '暗色' },
              { value: 'compactAlgorithm', label: '紧凑' },
            ]"
          ></a-select>
        </div>
      </div>
      <div class="font-bold mb-20px">主题编辑</div>
    </div>

    <a-divider type="vertical" class="h-auto mr-20px" />

    <div>
      <div class="font-bold mb-20px">效果预览</div>
      <div>
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
            <!-- 表格上方操作按钮 -->
            <div class="flex">
              <a-button type="primary" class="mr-20px">新增人员</a-button>
              <a-button type="primary" class="mr-20px">导出</a-button>
              <a-button class="exportRecords" type="primary"> 导出记录</a-button>
            </div>
          </div>

          <a-table :columns="columns" :data-source="data">
            <template #bodyCell="{ column, index }">
              <template v-if="column.key === 'operation'">
                <div>
                  <a-button type="link">编辑</a-button>
                  <a-button type="link" danger>删除</a-button>
                </div>
              </template>
              <template v-if="column.key === '4'">
                <a-tag :color="index === 0 ? 'success' : index === 1 ? 'warning' : 'error'"
                  >状态</a-tag
                >
              </template>
            </template>
          </a-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import { useUiStore } from '@/store/modules/uiConfig';

  const uiStore = useUiStore();

  const themeAlgorithm = ref<'defaultAlgorithm' | 'darkAlgorithm' | 'compactAlgorithm'>(
    'defaultAlgorithm',
  );
  const changeTheme = (value) => {
    uiStore.changeTheme(value);
  };

  import type { TableColumnsType } from 'ant-design-vue';
  const columns: TableColumnsType = [
    { title: 'Full Name', width: 100, dataIndex: 'name', key: 'name', fixed: 'left' },
    { title: 'Age', width: 100, dataIndex: 'age', key: 'age', fixed: 'left' },
    { title: 'Column 1', dataIndex: 'address', key: '1', width: 180 },
    { title: 'Column 2', dataIndex: 'address', key: '2', width: 180 },
    { title: 'Column 3', dataIndex: 'address', key: '3', width: 180 },
    { title: '状态', dataIndex: 'address', key: '4', width: 180 },
    {
      title: '操作',
      key: 'operation',
      fixed: 'right',
      width: 180,
    },
  ];

  interface DataItem {
    key: number;
    name: string;
    age: number;
    address: string;
  }

  const data: DataItem[] = [];
  for (let i = 0; i < 3; i++) {
    data.push({
      key: i,
      name: `Edrward ${i}`,
      age: 32,
      address: `London Park no. ${i}`,
    });
  }
</script>

<style lang="less" scoped></style>
