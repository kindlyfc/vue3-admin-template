<template>
  <a-modal
    v-model:visible="visible"
    title="导出记录"
    :footer="null"
    :ok-button-props="({ show: false } as any)"
    width="790px"
    destroy-on-close
    @cancel="closeModal"
  >
    <div class="search-line">
      <span>操作时间</span>
      <a-range-picker
        v-model:value="rangeTime"
        allow-clear
        value-format="YYYY-MM-DD HH:mm:ss"
        show-time
      />
      <a-button type="primary" @click="getList">查询</a-button>
      <a-button type="primary" @click="getList">刷新</a-button>
    </div>
    <a-table
      :loading="loading"
      :columns="columns"
      :data-source="data"
      :pagination="{
        position: ['bottomCenter'],
        current: current,
        pageSize: pageSize,
        total: total,
      }"
      :row-class-name="(_record, index) => (index % 2 === 1 ? 'table-striped' : undefined)"
      @change="pageChange"
    >
      <template #bodyCell="{ column, record, index }">
        <template v-if="column.key === 'index'">
          {{ index + 1 }}
        </template>
        <template v-if="column.key === 'status'">
          <div
            :style="{
              color: record.status === 0 ? '#3A6DFE' : record.status === 2 ? '#D10000' : '',
            }"
            >{{
              record.status === 0 ? '执行中' : record.status === 1 ? '导出成功' : '导出失败'
            }}</div
          >
        </template>
        <template v-if="column.key === 'operate'">
          <a v-if="record.status !== 1" disabled>下载</a>
          <a v-else :href="record.exportUrl">下载</a>
        </template>
      </template>
    </a-table>
    <!-- <div class="dialog-bottom-button">
      <a-button key="back" class="button" size="large" ghost type="primary" @click="closeModal"
        >关闭</a-button
      >
    </div> -->
  </a-modal>
</template>

<script lang="ts" setup>
  import { ref, watch } from 'vue';
  import type { Dayjs } from 'dayjs';
  import type { TableProps } from 'ant-design-vue';

  // 显示隐藏功能
  const visible = ref<boolean>(false);
  const emits = defineEmits(['update:modalVisible']);
  watch(
    () => props.modalVisible,
    async (newVal: boolean) => {
      visible.value = newVal;
      if (newVal === true) {
        getList();
      }
    },
    {
      immediate: true,
    },
  );
  const closeModal = () => {
    rangeTime.value = undefined;
    emits('update:modalVisible', false);
  };

  // 表格功能
  type RangeValue = [Dayjs, Dayjs];
  const props = defineProps({
    modalVisible: [Boolean],
    params: {
      default: () => ({}),
      type: Object,
    },
    listApi: {
      type: Function,
      default: () => {},
    },
  });

  const loading = ref<boolean>(false);
  const rangeTime = ref<RangeValue>();
  const current = ref<number>(1);
  const total = ref<number>(0);
  const pageSize = ref<string>('5');
  const data = ref<any[]>([]);

  const columns = [
    {
      title: '序号',
      key: 'index',
      dataIndex: 'index',
      align: 'center' as const,
    },
    {
      title: '操作时间',
      dataIndex: 'createTime',
      key: 'createTime',
      align: 'center' as const,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      align: 'center' as const,
    },
    {
      title: '操作',
      key: 'operate',
      dataIndex: 'operate',
      align: 'center' as const,
    },
  ];

  const pageChange: TableProps['onChange'] = (pag: { pageSize: string; current: number }) => {
    current.value = pag.current;
    pagesize.value = '' + pag.pageSize;
    getList();
  };

  const getList = () => {
    loading.value = true;
    const params: any = {
      pageNum: current.value,
      pageSize: pageSize.value,
      // userId: 123456,
      ...props.params,
    };

    try {
      // 获取列表数据
      if (rangeTime.value) {
        params.startTime = rangeTime.value[0];
        params.endTime = rangeTime.value[1];
      }
      props
        .listApi(params)
        .then((res: any) => {
          data.value = res.records;
          current.value = res.current;
          pagesize.value = '' + res.size;
          total.value = res.total;
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          loading.value = false;
        });
    } catch (error) {
      loading.value = false;
    }
  };
</script>

<style lang="less" scoped>
  .search-line {
    display: flex;
    align-items: center;

    & > * {
      margin: 20px 10px;
    }

    > span {
      color: #343434;
    }
  }

  .dialog-bottom-button {
    display: flex;
    justify-content: center;
    margin: 20px 0;

    .button {
      width: 150px;
      border-radius: 5px;
    }
  }
</style>
