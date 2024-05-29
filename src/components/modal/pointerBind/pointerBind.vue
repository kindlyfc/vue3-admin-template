<template>
  <div>
    <a-modal
      v-if="visible"
      :visible="visible"
      :width="900"
      title="点位绑定"
      centered
      :destroyOnClose="true"
      :footer="null"
      @cancel="close"
    >
      <div>
        <!-- 信息录入区域 S -->
        <div class="top">
          <!-- 顶部搜索 -->
          <div class="top_search">
            <!-- <HeadMatch class="-mt20px" v-model:value="searchForm.imageUrl" /> -->
            <div class="mr1.5vw">
              <span class="label">点位名称</span>
              <a-input v-model:value="searchForm.name" placeholder="请输入"></a-input>
            </div>
            <!-- <div class="mr1.5vw">
              <span class="label">设备类型</span>
              <a-select
                v-model:value="searchForm.deviceType"
                placeholder="请选择"
                :options="[
                  { value: 1, label: 'UPS' },
                  { value: 2, label: '摄像头' },
                ]"
              ></a-select>
            </div> -->

            <div class="flex-1! text-right min-w160px!">
              <a-button type="primary" class="mr-20px" b-rd-6px @click="getList(false, true)">
                <svg-icon name="search" size="16" class="text-white mr-6px"></svg-icon>
                查询
              </a-button>
              <a-button
                type="primary"
                class="text-#3A6DFE"
                ghost
                b-rd-6px
                @click="getList(true, true)"
              >
                <svg-icon name="reset" size="16" class="mr-6px"></svg-icon>
                刷新
              </a-button>
            </div>
          </div>
          <a-table
            :columns="columns"
            :row-key="(record) => record.id"
            :row-selection="rowSelection"
            :data-source="dataSource"
            :pagination="pagination"
            :scroll="{ y: '62vh' }"
            :loading="tableLoading"
            :row-class-name="(_record, index) => (index % 2 === 1 ? 'table-striped' : undefined)"
            @change="pageChange"
          >
          </a-table
        ></div>
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
  import { defineComponent, ref, reactive, watch, computed } from 'vue';
  import { message } from 'ant-design-vue';
  import type { TableProps } from 'ant-design-vue';
  import { downPositionList, bindPosition } from '@/api/alarmList';
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
      const tableLoading = ref<boolean>(false);
      const current = ref<number>(1);
      const size = ref<number>(10);
      const total = ref<number>(0);
      const dataSource = ref<any>([]);
      const selectedRowKeys = ref<any>([]);
      const selectedRows = ref<any>([]);
      const searchForm = reactive<any>({
        name: '',
        deviceType: '',
      });

      const columns = ref<any>([
        // {
        //   title: '设备ID',
        //   dataIndex: 'id',
        //   key: 'id',
        //   align: 'center',
        // },
        {
          title: '点位名称',
          dataIndex: 'name',
          key: 'name',
          align: 'center',
        },
      ]);
      watch(
        () => props.record,
        (val: any) => {
          if (val && val.id) getList();
          if (val && val.positions?.length) {
            selectedRowKeys.value = val.positions?.map((v) => {
              return v.id;
            });
            selectedRows.value = val.positions?.map((v) => {
              return {
                name: v.name,
                id: v.id,
              };
            });
          }
        },
        {
          immediate: true,
          deep: true,
        },
      );
      const rowSelection: TableProps['rowSelection'] = {
        onChange: (rowKeys: string[], rows: any[]) => {
          console.log(`selectedRowKeys: ${rowKeys}`, 'selectedRows: ', rows);
          selectedRowKeys.value = rowKeys;
          selectedRows.value = rows.map((v) => {
            return {
              name: v.name,
              id: v.id,
            };
          });
        },
        columnWidth: 70,
        selectedRowKeys: selectedRowKeys as any,
      };
      const pagination: any = computed(() => ({
        sizeOptions: [10, 50, 100, 200],
        showQuickJumper: true,
        showSizeChanger: true,
        total: total.value,
        current: current.value,
        size: size.value,
        showTotal: (total: number) => `共计 ${total} 条数据`,
        position: ['bottomCenter'],
      }));
      // 表格分页功能
      const pageChange: any = (pag: { pageSize: number; current: number }) => {
        current.value = pag.current;
        size.value = pag.pageSize;
        getList();
      };

      //分页
      const getList = async (isReset?: boolean, isPagin?: boolean) => {
        if (isReset) {
          Object.assign(searchForm, {
            name: '',
            deviceType: '',
          });
          current.value = 1;
        }
        if (isPagin) {
          current.value = 1;
        }
        const data: any = {
          pageNum: current.value,
          pageSize: size.value,
          name: searchForm.name,
          // deviceType: searchForm.deviceType,
          gridId: props.record.id,
        };
        tableLoading.value = true;
        try {
          const res = await downPositionList(data);
          dataSource.value = res.records;
          current.value = res.current;
          total.value = res.total;
          size.value = res.size;
        } finally {
          tableLoading.value = false;
        }
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
        selectedRowKeys.value = [];
        selectedRows.value = [];
        total.value = 0;
        current.value = 1;
        Object.assign(searchForm, {
          name: '',
          deviceType: '',
        });
      };
      /**
       * 提交
       */
      async function submit() {
        // if (!selectedRows.value.length) {
        //   message.warning(`请选择需要帮定的设备`);
        //   return;
        // }
        let data: any = {
          id: props.record?.id,
          positions: selectedRows.value || [],
        };
        submitLoading.value = true;
        try {
          await bindPosition(data);
          message.success(`绑定成功`);
          context.emit('getList');
          close();
        } finally {
          submitLoading.value = false;
        }
      }
      const filterOption = (input: string, option: any) => {
        return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
      };

      return {
        formRef,
        submitLoading,
        columns,
        current,
        size,
        total,
        dataSource,
        searchForm,
        tableLoading,
        filterOption,
        pagination,
        pageChange,
        close,
        clearData,
        rowSelection,
        submit,
        getList,
      };
    },
  });
</script>

<style lang="less" scoped></style>
