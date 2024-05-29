<template>
  <div class="box">
    <!-- 顶部搜索 -->
    <div class="top_search">
      <!-- <HeadMatch class="-mt20px" v-model:value="searchForm.imageUrl" /> -->
      <div class="mr1.5vw item">
        <span class="label">任务名称</span>
        <a-input v-model:value="searchForm.name" placeholder="请输入"></a-input>
      </div>
      <div class="mr1.5vw item">
        <span class="label">状态</span>
        <a-select
          v-model:value="searchForm.enable"
          placeholder="请选择"
          allow-clear
          :options="[
            { value: 'true', label: '启用' },
            { value: 'false', label: '禁用' },
          ]"
        ></a-select>
      </div>
      <div class="mr1.5vw item">
        <span class="label">陌生人告警</span>
        <a-select
          v-model:value="searchForm.alarmStranger"
          placeholder="请选择"
          allow-clear
          :options="[
            { value: 'true', label: '启用' },
            { value: 'false', label: '禁用' },
          ]"
        ></a-select>
      </div>
      <!-- <div class="mr1.5vw item">
        <span class="label">组织机构</span>
        <orgTreeSelect v-model:value="treeSelectedKeys" @change="treeChange" />
      </div> -->
      <!-- <div class="mr1.5vw">
        <span class="label">时间范围</span>
        <a-range-picker format="YYYY-MM-DD" />
      </div> -->
      <div class="flex-1 text-right">
        <a-button type="primary" class="mr-20px" b-rd-6px @click="getList(false, true)">
          <svg-icon name="search" size="16" class="text-white mr-6px"></svg-icon>
          查询
        </a-button>
        <a-button type="primary" class="text-#3A6DFE" ghost b-rd-6px @click="getList(true, true)">
          <svg-icon name="reset" size="16" class="mr-6px"></svg-icon>
          刷新
        </a-button>
      </div>
    </div>
    <!-- 表格主体 -->
    <div class="bg-white">
      <!-- 表格上方操作按钮 -->
      <div class="flex justify-end pr12px pt10px pb10px">
        <a-button type="link" @click="showAddModal('add')">
          <svg-icon name="add" size="15" class="mr-5px"></svg-icon>新增
        </a-button>
      </div>

      <a-table
        :columns="columns"
        :row-key="(record) => record.id"
        :data-source="dataSource"
        :pagination="pagination"
        :scroll="{ y: '62vh' }"
        :loading="tableLoading"
        :row-class-name="(_record, index) => (index % 2 === 1 ? 'table-striped' : undefined)"
        @change="pageChange"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'alarmStranger'">
            <a-switch :checked="record.alarmStranger" disabled />
          </template>
          <template v-if="column.key === 'enable'">
            <a-switch
              v-model:checked="record.enable"
              @change="
                changeStatus($event, record, {
                  start: $auth('/monitor/task/start'),
                  stop: $auth('/monitor/task/stop'),
                })
              "
            />
          </template>
          <template v-if="column.key === 'operation'">
            <div>
              <a-button type="link" @click="showAddModal('edit', record)">编辑</a-button>
              <a-button type="link" danger @click="deletUs(record.taskId)">删除</a-button>
            </div>
          </template>
        </template>
      </a-table>
    </div>

    <!-- 弹窗区域 S -->
    <!-- 新增编辑弹窗 -->
    <AddTaskModal
      v-model:visible="addVisible"
      :record="editRecord"
      :is-update="isUpdate"
      @getList="getList"
    />
    <!-- 弹窗区域 E -->
  </div>
</template>

<script lang="ts" setup>
  import { reactive, ref, watch } from 'vue';
  import userManage from './composables/index';
  import useModal from './composables/modal';
  import AddTaskModal from './components/addTaskModal.vue';
  import orgTreeSelect from '@/components/business/orgTreeSelect/orgTreeSelect.vue';

  const {
    searchForm,
    columns,
    tableLoading,
    dataSource,
    pagination,
    pageChange,
    treeSelectedKeys,
    changeStatus,
    getList,
    deletUs,
    treeChange,
  } = userManage();

  // 获取列表
  getList();

  const {
    addVisible,
    isUpdate,
    editRecord,
    recordVisible,
    levelVisible,
    currentRecord,
    columnsLevel,
    personSbumit,
    submitLoading,
    showRecordModal,
    showAddModal,
    showLevelModal,
    closeRecordModal,
  } = useModal(getList);
</script>

<style lang="less" scoped>
  textarea {
    height: 90px !important;
  }

  .contras_ {
    display: flex;
    flex-direction: column;
  }

  .contras_title {
    height: 40px;
    background: #f1f6fc;
    line-height: 40px;
    text-align: center;
    font-size: 14px;
    font-weight: bold;
    color: #333333;
    border: 1px solid #d7e8f5;
  }

  .contras_cont {
    flex: 1;
    border: 1px solid #d7e8f5;
  }

  .progress_ {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .detail_cont {
    .ant-form-item {
      margin-bottom: 10px !important;
    }
  }

  :deep(.ant-picker) {
    width: 314px !important;
    height: 30px !important;
    background: #fff !important;
    border-radius: 6px !important;
  }

  :deep(.ant-progress-text) {
    color: #fd9a1c !important;
    font-size: 12px !important;
  }
</style>
