<template>
  <div class="box">
    <!-- 顶部搜索 -->
    <div class="top_search">
      <div class="mr1.5vw">
        <span class="label">机构名称</span>
        <a-input v-model:value="searchForm.orgName" placeholder="请输入"></a-input>
      </div>
      <div class="mr1.5vw">
        <span class="label">状态</span>
        <a-select
          v-model:value="searchForm.status"
          placeholder="请选择"
          :options="[
            { value: true, label: '启用' },
            { value: false, label: '停用' },
          ]"
        ></a-select>
      </div>
      <div class="flex-1 text-right">
        <a-button type="primary" class="mr-1.25rem" b-rd-0.375rem @click="getList(false)">
          <svg-icon name="search" size="16" class="text-white mr-0.375rem"></svg-icon>
          查询
        </a-button>
        <a-button type="primary" class="text-#3A6DFE" ghost b-rd-0.375rem @click="getList(true)">
          <svg-icon name="reset" size="16" class="mr-0.375rem"></svg-icon>
          刷新
        </a-button>
      </div>
    </div>
    <!-- 表格主体 -->
    <div class="bg-white">
      <!-- 表格上方操作按钮 -->
      <div class="flex justify-end pr.75rem pt.625rem pb.625rem">
        <a-button
          type="link"
          @click="
            {
              visibleModel = true;
              isUpdate = false;
              isHaveParent = false;
            }
          "
          ><svg-icon name="add" size="15" class="mr-0.3125rem"></svg-icon>新增</a-button
        >
      </div>

      <a-table
        :columns="columns"
        :row-key="(record) => record.id"
        :data-source="dataSource"
        :pagination="false"
        :scroll="{ y: '62vh' }"
        :loading="tableLoading"
        :row-class-name="(_record, index) => (index % 2 === 1 ? 'table-striped' : undefined)"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'enable'">
            <a-switch v-model:checked="record.enable" disabled />
          </template>
          <template v-if="column.key === 'operation'">
            <div>
              <a-button type="link" @click="editUs(record, false)">查看</a-button>
              <a-button type="link" @click="editUs(record, true)">编辑</a-button>
              <a-button type="link" danger @click="deletUs(record.id)">删除</a-button>
              <a-button type="link" @click="addChild(record.id, record.name)">新增子级</a-button>
            </div>
          </template>
        </template>
      </a-table>
    </div>

    <!-- 新增编辑弹框 -->
    <a-modal
      v-model:visible="visibleModel"
      :width="600"
      :title="isUpdate ? '编辑机构' : '新增机构'"
      :ok-button-props="{ loading: submitLoading }"
      centered
      @cancel="closeHandleModal"
      @ok="onSubmit"
    >
      <div class="pr2.5rem">
        <a-form
          v-if="visibleModel"
          ref="formRef"
          :rules="rulesRef"
          :model="orgForm"
          :label-col="{ span: 6 }"
          :wrapper-col="{ span: 18 }"
        >
          <a-form-item v-if="isHaveParent" label="上级机构" name="parentId">
            <a-input disabled v-model:value="orgForm.parentName" placeholder="请输入"></a-input>
          </a-form-item>
          <a-form-item label="机构名称" name="orgName">
            <a-input v-model:value="orgForm.name" placeholder="请输入"></a-input>
          </a-form-item>
          <a-form-item label="负责人" name="adminName">
            <a-input v-model:value="orgForm.adminName" placeholder="请输入"></a-input>
          </a-form-item>
          <a-form-item label="负责人电话" name="adminMobile">
            <a-input v-model:value="orgForm.adminMobile" placeholder="请输入"></a-input>
          </a-form-item>
          <a-form-item label="描述" name="description">
            <a-input v-model:value="orgForm.description" placeholder="请输入"></a-input>
          </a-form-item>
          <a-form-item label="状态">
            <a-switch v-model:checked="orgForm.enable" />
          </a-form-item>
        </a-form>
      </div>
    </a-modal>

    <!-- 详情弹框 -->
    <a-modal
      v-model:visible="visibleModel1"
      :width="500"
      title="用户详情"
      centered
      :footer="null"
      @cancel="
        () => {
          Object.assign(orgForm, {
            id: '',
            name: '',
            description: '',
            enable: true,
            parentId: '',
            parentName: '',
            adminName: '',
            adminMobile: '',
          });
        }
      "
    >
      <div class="pr30px pl30px">
        <a-descriptions :column="1">
          <a-descriptions-item v-if="orgForm.parentName" label="上级机构" :span="2">
            {{ orgForm.parentName || '--' }}
          </a-descriptions-item>
          <a-descriptions-item label="机构名称" :span="2">
            {{ orgForm.name || '--' }}
          </a-descriptions-item>
          <a-descriptions-item label="负责人" :span="2">
            {{ orgForm.adminName || '--' }}
          </a-descriptions-item>
          <a-descriptions-item label="负责人电话" :span="2">
            {{ orgForm.adminMobile }}
          </a-descriptions-item>
          <a-descriptions-item label="描述" :span="2">
            <span>{{ orgForm.description }}</span>
          </a-descriptions-item>
          <a-descriptions-item label="状态" :span="2">
            <span :style="{ color: orgForm.enable ? '#5389d8' : 'red' }">
              {{ orgForm.enable ? '启用' : '停用' }}</span
            >
          </a-descriptions-item>
        </a-descriptions>
      </div>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
  import { reactive } from 'vue';
  import userManage from './composables/index';
  import { regCheck } from '@/utils/validate';
  import { phoneAndTel } from '@/utils/reg-exp';
  const rulesRef = reactive({
    adminMobile: [
      {
        validator: regCheck(phoneAndTel),
        message: '电话号码格式不正确',
        trigger: 'change',
        required: true,
      },
    ],
    name: [
      {
        required: true,
        message: '请填写该项',
      },
    ],
    adminName: [
      {
        required: true,
        message: '请填写该项',
      },
    ],
  });
  const {
    formRef,
    searchForm,
    columns,
    tableLoading,
    dataSource,
    submitLoading,
    visibleModel,
    orgForm,
    options,
    isHaveParent,
    isUpdate,
    visibleModel1,
    getOrgName,
    editUs,
    getList,
    closeHandleModal,
    onSubmit,
    addChild,
    deletUs,
  } = userManage();
  getList();
</script>

<style lang="less" scoped></style>
