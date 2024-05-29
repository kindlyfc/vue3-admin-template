<template>
  <div class="box">
    <!-- 顶部搜索 -->
    <div class="top_search">
      <div class="mr1.5vw">
        <span class="label">名称</span>
        <a-input v-model:value="searchForm.name" placeholder="请输入"></a-input>
      </div>
      <div class="mr1.5vw">
        <span class="label">状态</span>
        <a-select
          v-model:value="searchForm.enable"
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
        <a-button
          type="link"
          @click="
            {
              visibleModel = true;
              isUpdate = false;
            }
          "
          ><svg-icon name="add" size="15" class="mr-5px"></svg-icon>新增</a-button
        >
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
          <template v-if="column.key === 'enable'">
            <span :style="{ color: record.enable ? '#5389d8' : 'red' }">{{
              record.enable ? '启用' : '停用'
            }}</span>
          </template>
          <template v-if="column.key === 'sort'">
            <span>{{ record.sort }}</span>
          </template>
          <template v-if="column.key === 'permPattern'">
            <a-popover v-model="record.visible" trigger="hover">
              <template #content>
                <div class="tree_content w300px!">
                  <a-tree
                    :checkedKeys="record.realCheckedKeys"
                    checkable
                    :auto-expand-parent="true"
                    defaultExpandAll
                    :tree-data="treeData"
                    disabled
                  />
                </div>
              </template>
              <a-button type="link">查看</a-button>
            </a-popover>
          </template>

          <template v-if="column.key === 'operation'">
            <div>
              <a-button type="link" @click="editUs(record, false)">查看</a-button>
              <a-button v-if="record.name != '超级管理员'" type="link" @click="editUs(record, true)"
                >编辑</a-button
              >
              <a-button
                v-if="
                  record.name != '超级管理员' &&
                  record.name != '监管人员' &&
                  record.name != '运维人员'
                "
                type="link"
                danger
                @click="deletUs(record.id)"
                >删除</a-button
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
      :title="isUpdate ? '编辑角色' : '新增角色'"
      :ok-button-props="{ loading: submitLoading }"
      centered
      @cancel="closeHandleModal"
      @ok="onSubmit"
    >
      <div class="pr40px">
        <a-form
          ref="formRef"
          :rules="rulesRef"
          :model="userInfoForm"
          :label-col="{ span: 6 }"
          :wrapper-col="{ span: 18 }"
        >
          <a-form-item label="角色名称" name="name">
            <a-input v-model:value="userInfoForm.name" placeholder="请输入"></a-input>
          </a-form-item>
          <!-- <a-form-item label="角色标识符" name="roleKey">
            <a-input v-model:value="userInfoForm.roleKey" placeholder="请输入"></a-input>
          </a-form-item> -->
          <!-- <a-form-item label="角色顺序" name="sort">
            <a-input-number id="inputNumber" v-model:value="userInfoForm.sort" :min="1" />
          </a-form-item> -->
          <a-form-item label="状态">
            <a-switch v-model:checked="userInfoForm.enable" />
          </a-form-item>
          <a-form-item label="菜单权限" name="permPattern">
            <div class="tree_content">
              <a-tree
                v-if="treeData"
                :checkedKeys="checkedKeys"
                v-model:expandedKeys="expandedKeys"
                checkable
                :auto-expand-parent="true"
                :tree-data="treeData"
                @check="onCheck"
              />
            </div>
          </a-form-item>
          <a-form-item label="备注">
            <a-textarea
              style="height: 90px"
              v-model:value="userInfoForm.remark"
              placeholder="请输入"
            ></a-textarea>
          </a-form-item>
        </a-form>
      </div>
    </a-modal>

    <!-- 详情弹框 -->
    <a-modal
      v-model:visible="visibleModel1"
      :width="500"
      title="角色详情"
      centered
      :footer="null"
      @cancel="
        () => {
          Object.assign(userInfoForm, {
            id: '',
            name: '',
            roleKey: '',
            sort: '',
            enable: true,
            remark: '',
            permPattern: [],
          });
        }
      "
    >
      <div class="pr30px pl30px">
        <a-descriptions :column="1">
          <a-descriptions-item label="角色名称" name="orgId" :span="2">
            {{ userInfoForm.name || '--' }}
          </a-descriptions-item>
          <a-descriptions-item label="角色标识符" :span="2">
            {{ userInfoForm.roleKey || '--' }}
          </a-descriptions-item>
          <!-- <a-descriptions-item label="角色顺序" :span="2">
            {{ userInfoForm.sort }}
          </a-descriptions-item> -->
          <a-descriptions-item label="状态" :span="2">
            <span :style="{ color: userInfoForm.enable ? '#5389d8' : 'red' }">
              {{ userInfoForm.enable ? '启用' : '停用' }}</span
            >
          </a-descriptions-item>
          <a-descriptions-item label="菜单权限" name="name" :span="4">
            <div class="tree_content" style="width: 100%">
              <a-tree
                :checkedKeys="checkedKeys"
                checkable
                disabled
                defaultExpandAll
                :auto-expand-parent="true"
                :tree-data="treeData"
              />
            </div>
          </a-descriptions-item>
          <a-descriptions-item label="备注" name="name" :span="4">
            <span> {{ userInfoForm.remark || '--' }}</span>
          </a-descriptions-item>
        </a-descriptions>
      </div>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
  import { reactive } from 'vue';
  import userManage from './composables/index';
  const rulesRef = reactive({
    name: [
      {
        required: true,
        message: '请填写该项',
      },
    ],

    roleKey: [
      {
        required: true,
        message: '请填写该项',
      },
    ],
    sort: [
      {
        required: true,
        message: '请填写该项',
      },
    ],
    permPattern: [
      {
        required: true,
        message: '请选择数据',
      },
    ],
  });
  const {
    formRef,
    searchForm,
    columns,
    tableLoading,
    dataSource,
    pagination,
    submitLoading,
    visibleModel,
    visibleModel1,
    userInfoForm,
    pageChange,
    isUpdate,
    treeData,
    checkedKeys,
    selectedKeys,
    selectUserData,
    expandedKeys,
    onCheck,
    editUs,
    getList,
    closeHandleModal,
    onSubmit,
    deletUs,
  } = userManage();
  getList();
</script>

<style lang="less" scoped>
  .hoverData {
    color: #1686ee;
    cursor: pointer;
  }

  .tree_content {
    border: 1px solid #eee;
    border-radius: 12px;
    max-height: 400px;
    padding: 30px;
    overflow-y: auto;
  }

  .data_content {
    width: 300px;
    min-height: 100px;
    padding: 30px;
    overflow: auto;
    max-height: 500px;
    white-space: prare-wp;

    span {
      font-weight: 500;
    }
  }
</style>
