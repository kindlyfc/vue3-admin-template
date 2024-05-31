<template>
  <div>
    <div class="top_search">
      <div class="mr1.5vw">
        <span class="label">分类名称</span>
        <a-input v-model:value="searchForm.name" placeholder="请输入分类名称"></a-input>
      </div>

      <div class="flex-1 text-right">
        <a-button type="primary" class="mr-20px" b-rd-6px @click="getList1()">
          <svg-icon name="search" size="16" class="text-white mr-6px"></svg-icon>
          查询
        </a-button>
        <a-button type="primary" class="text-#3A6DFE" ghost b-rd-6px @click="getList1()">
          <svg-icon name="reset" size="16" class="mr-6px"></svg-icon>
          重置
        </a-button>
      </div>
    </div>

    <div class="ca_region">
      <div class="titleSty">标准样式配置</div>
      <a-table
        :columns="columns1"
        :row-key="(record) => record.id"
        :data-source="dataSource1"
        :scroll="{ y: '62vh' }"
        :loading="tableLoading1"
        :row-class-name="(_record, index) => (index % 2 === 1 ? 'table-striped' : undefined)"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'operation'">
            <div>
              <a-button type="link" @click="editUs1()">编辑</a-button>
            </div>
          </template>
        </template>
      </a-table>
    </div>

    <div class="ca_region">
      <div class="titleSty">标准样式配置</div>
      <a-table
        :columns="columns2"
        :row-key="(record) => record.id"
        :data-source="dataSource2"
        :scroll="{ y: '22vh' }"
        :loading="tableLoading2"
        :row-class-name="(_record, index) => (index % 2 === 1 ? 'table-striped' : undefined)"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'operation'">
            <div>
              <a-button type="link" @click="editUs2()">编辑</a-button>
            </div>
          </template>
        </template>
      </a-table>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { reactive, ref } from 'vue';
  const searchForm = reactive<any>({
    name: '',
  });
  const tableLoading1 = ref<boolean>(false);
  const tableLoading2 = ref<boolean>(false);
  const dataSource1 = ref<any>([]);
  const dataSource2 = ref<any>([]);
  const columns1 = ref<any>([
    {
      title: '分类名称',
      dataIndex: 'deviceName',
      key: 'deviceName',
      align: 'center',
    },
    {
      title: 'icon位置',
      dataIndex: 'departmentName',
      key: 'departmentName',
      align: 'center',
    },
    {
      title: '按钮背景色',
      dataIndex: 'routeAddr',
      key: 'routeAddr',
      align: 'center',
    },
    {
      title: '线段背景色',
      dataIndex: 'macAddr',
      key: 'macAddr',
      align: 'center',
    },
    {
      title: '字体颜色',
      dataIndex: 'macAddr',
      key: 'macAddr',
      align: 'center',
    },
    {
      title: '焦点字体颜色',
      dataIndex: 'macAddr',
      key: 'macAddr',
      align: 'center',
    },
    {
      title: '备注',
      dataIndex: 'macAddr',
      key: 'macAddr',
      align: 'center',
    },
    {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      align: 'center',
      width: 140,
    },
  ]);

  const columns2 = ref<any>([
    {
      title: '按钮类型',
      dataIndex: 'deviceName',
      key: 'deviceName',
      align: 'center',
    },
    {
      title: '长',
      dataIndex: 'departmentName',
      key: 'departmentName',
      align: 'center',
    },
    {
      title: '宽',
      dataIndex: 'routeAddr',
      key: 'routeAddr',
      align: 'center',
    },
    {
      title: '圆角(半径)',
      dataIndex: 'macAddr',
      key: 'macAddr',
      align: 'center',
    },
    {
      title: '线宽',
      dataIndex: 'macAddr',
      key: 'macAddr',
      align: 'center',
    },
    {
      title: '字体大小',
      dataIndex: 'macAddr',
      key: 'macAddr',
      align: 'center',
    },
    {
      title: '字间距',
      dataIndex: 'macAddr',
      key: 'macAddr',
      align: 'center',
    },
    {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      align: 'center',
      width: 140,
    },
  ]);
  const getList1 = () => {};
  const getList2 = () => {};
  const editUs1 = () => {};
  const editUs2 = () => {};
</script>

<style lang="less" scoped>
  .ca_region {
    border-radius: 6px;
    margin-top: 18px;
    background-color: #fff;
    padding: 0 20px 20px;

    .titleSty {
      font-weight: 600;
      font-size: 14px;
      color: #1f2122c5;
      padding: 16px;
      padding-left: 0;
      border-bottom: 1px solid #e6e3e3;
    }
  }
</style>
