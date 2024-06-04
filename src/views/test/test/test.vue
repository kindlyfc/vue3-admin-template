<template>
  <div class="box">
    <!-- 顶部搜索 -->
    <div class="top_search">
      <div class="mr1.5vw">
        <span class="label">机构名称</span>
        <a-input v-model:value="searchForm.name" placeholder="请输入"></a-input>
      </div>
      <div class="mr1.5vw">
        <span class="label">状态</span>
        <a-select
          v-model:value="searchForm.enabled"
          placeholder="请选择"
          :options="[
            { value: true, label: '启用' },
            { value: false, label: '停用' },
          ]"
        ></a-select>
      </div>
      <div class="flex-1 text-right">
        <a-button type="primary" class="mr-20px" b-rd-6px @click="getList(false, true)">
          <svg-icon name="search" size="16" class="text-white mr-6px"></svg-icon>
          查询
        </a-button>
        <a-button type="primary" class="text-#3A6DFE" ghost b-rd-6px @click="getList(true)">
          <svg-icon name="reset" size="16" class="mr-6px"></svg-icon>
          重置
        </a-button>
      </div>
    </div>
    <!-- 表格主体 -->
    <div class="bg-white">
      <div class="flex justify-end pr12px pt10px pb10px">
        <a-button
          v-if="$auth('/sys/new/org/create')"
          type="link"
          @click="
            () => {
              visibleModel = true;
              modalTitle = '新增机构';
            }
          "
          ><svg-icon name="add" size="15" class="mr-5px"></svg-icon>新增机构</a-button
        >
      </div>

      <a-table
        :columns="columns"
        :row-key="(record) => record.code"
        :pagination="false"
        :data-source="dataSource"
        :scroll="{ y: 'calc(100vh - 300px)' }"
        :loading="tableLoading"
        :row-class-name="(_record, index) => (index % 2 === 1 ? 'table-striped' : undefined)"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'enabled'">
            <a-switch
              v-model:checked="record.enabled"
              disabled
              checked-children="开启"
              un-checked-children="关闭"
            />
          </template>
          <template v-if="column.dataIndex === 'operation'">
            <div>
              <a-button type="link" @click="editUs(record, '查看组织机构')">查看</a-button>
              <a-button
                v-if="$auth('/sys/new/org/modify')"
                type="link"
                @click="editUs(record, '编辑组织机构')"
                >编辑</a-button
              >
              <a-button
                v-if="$auth('/sys/new/org/delete')"
                type="link"
                danger
                @click="deletUs(record.code)"
                >删除</a-button
              >
              <a-button
                v-if="$auth('/sys/new/org/create')"
                type="link"
                @click="addChild(record.code, '新增组织机构子级')"
                >新增子级</a-button
              >
            </div>
          </template>
        </template>
      </a-table>
    </div>

    <!-- 新增编辑弹框 -->
    <a-modal
      v-model:visible="visibleModel"
      :width="600"
      destroyOnClose
      :title="modalTitle"
      :ok-button-props="{ loading: submitLoading }"
      :afterClose="closeHandleModal"
      @ok="onSubmit"
    >
      <input type="color" />
      <div class="pr40px">
        <a-form ref="formRef" :model="orgForm" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
          <a-form-item
            label="机构名称"
            name="name"
            :rules="{ required: true, message: '请输入机构名称' }"
          >
            <a-input
              v-model:value="orgForm.name"
              :disabled="readOlny"
              :maxlength="32"
              placeholder="请输入"
            ></a-input>
          </a-form-item>
          <a-form-item
            label="机构类型"
            name="type"
            :rules="{ required: true, message: '请选择机构类型' }"
          >
            <a-select
              v-model:value="orgForm.type"
              :disabled="readOlny"
              placeholder="请选择"
              :options="typeMap"
            >
            </a-select>
          </a-form-item>
          <a-form-item label="备注" name="remark">
            <a-input
              v-model:value="orgForm.remark"
              :disabled="readOlny"
              :maxlength="32"
              placeholder="请输入"
            ></a-input>
          </a-form-item>

          <a-form-item label="状态">
            <a-switch
              v-model:checked="orgForm.enabled"
              :disabled="readOlny"
              checked-children="开启"
              un-checked-children="关闭"
            />
          </a-form-item>
        </a-form>
      </div>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import userManage from './composables/index';
  const formRef = ref();
  const {
    searchForm,
    columns,
    tableLoading,
    dataSource,
    submitLoading,
    visibleModel,
    orgForm,
    modalTitle,
    readOlny,
    typeMap,
    editUs,
    getList,
    closeHandleModal,
    onSubmit,
    deletUs,
    addChild,
  } = userManage(formRef);
  getList();
</script>

<style lang="less" scoped></style>
