<template>
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
          <a-button class="exportRecords" type="primary">
            <svg-icon name="bigdataExport" size="18" class="mr-4px text-white"></svg-icon
            >导出记录</a-button
          >
        </div>
      </div>

      <a-table
        :columns="columns"
        :data-source="data"
        :scroll="{ x: 1500, y: 'calc(100vh - 325px)' }"
      >
        <template #bodyCell="{ column }">
          <template v-if="column.key === 'operation'">
            <a>编辑</a>
          </template>
        </template>
      </a-table>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import type { TableColumnsType } from 'ant-design-vue';
  const columns: TableColumnsType = [
    { title: 'Full Name', width: 100, dataIndex: 'name', key: 'name', fixed: 'left' },
    { title: 'Age', width: 100, dataIndex: 'age', key: 'age', fixed: 'left' },
    { title: 'Column 1', dataIndex: 'address', key: '1', width: 180 },
    { title: 'Column 2', dataIndex: 'address', key: '2', width: 180 },
    { title: 'Column 3', dataIndex: 'address', key: '3', width: 180 },
    { title: 'Column 4', dataIndex: 'address', key: '4', width: 180 },
    { title: 'Column 5', dataIndex: 'address', key: '5', width: 180 },
    { title: 'Column 6', dataIndex: 'address', key: '6', width: 180 },
    { title: 'Column 7', dataIndex: 'address', key: '7', width: 180 },
    { title: 'Column 8', dataIndex: 'address', key: '8' },
    {
      title: 'Action',
      key: 'operation',
      fixed: 'right',
      width: 100,
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
</script>
<style scoped lang="less"></style>
