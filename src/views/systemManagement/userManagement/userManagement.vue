<template>
  <div class="box">
    <!-- 顶部搜索 -->
    <div class="top_search">
      <div class="mr1.5vw">
        <span class="label">姓名</span>
        <a-input v-model:value="searchForm.name" placeholder="请输入"></a-input>
      </div>
      <div class="mr1.5vw">
        <span class="label">手机号</span>
        <a-input v-model:value="searchForm.mobile" placeholder="请输入"></a-input>
      </div>
      <div class="mr1.5vw">
        <span class="label">角色</span>
        <roleSelect v-model:value="searchForm.roleId" />
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
      <div class="flex justify-end pr12px pt10px pb10px relative">
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
        <a-button type="link" @click="downTemple"
          ><svg-icon name="xiazai" size="18" class="mr-5px"></svg-icon>下载模板</a-button
        >
        <a-button type="link" :loading="downloading"
          ><svg-icon name="important" size="15" class="mr-5px"></svg-icon>导入用户</a-button
        >
        <input input type="file" id="file" ref="fileRef" class="file_input" @change="fileInfo" />
      </div>

      <a-table
        :columns="columns"
        :row-key="(record) => record.uuid"
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
          <template v-if="column.key === 'orgCount'">
            <a-popover v-model="record.visible" trigger="click">
              <template #content>
                <div class="data_content">
                  <div v-for="(item, index) in selectUserData" :key="index">{{ item.name }}</div>
                </div>
              </template>
              <a-button type="link" @click="getOrgCount(record.uid)">查看</a-button>
            </a-popover>
          </template>
          <template v-if="column.key === 'roleName'">
            <a-popover v-model="record.visible" trigger="click">
              <template #content>
                <div class="data_content">
                  <div v-for="(item, index) in roles" :key="index">{{ item.name }}</div>
                </div>
              </template>
              <a-button type="link" @click="getOrgRoles(record.uid)">查看</a-button>
            </a-popover>
          </template>
          <template v-if="column.key === 'operation'">
            <div>
              <a-button type="link" @click="editUs(record, false)">查看</a-button>
              <a-button type="link" @click="editUs(record, true)">编辑</a-button>
              <a-button type="link" danger @click="deletUs(record.uid)">删除</a-button>
              <a-button type="link" @click="resetPassword(record.uid)">修改密码</a-button>
            </div>
          </template>
        </template>
      </a-table>
    </div>

    <!-- 新增编辑弹框 -->
    <a-modal
      v-model:visible="visibleModel"
      :width="600"
      :title="isUpdate ? '编辑用户' : '新增用户'"
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
          <a-form-item label="姓名" name="name">
            <a-input v-model:value="userInfoForm.name" placeholder="请输入"></a-input>
          </a-form-item>
          <a-form-item label="性别">
            <a-radio-group v-model:value="userInfoForm.gender">
              <a-radio value="男">男</a-radio>
              <a-radio value="女">女</a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item label="手机号" name="mobile">
            <a-input v-model:value="userInfoForm.mobile" placeholder="请输入"></a-input>
          </a-form-item>
          <!-- <a-form-item label="岗位" name="position">
            <a-input v-model:value="userInfoForm.position" placeholder="请输入"></a-input>
          </a-form-item> -->
          <a-form-item v-if="!isUpdate" label="初始密码" name="password">
            <a-input-password
              v-model:value="userInfoForm.password"
              :maxlength="8"
              placeholder="请输入"
            ></a-input-password>
          </a-form-item>
          <a-form-item v-if="!isUpdate" label="二次确认密码" name="confirmPassword">
            <a-input-password
              v-model:value="userInfoForm.confirmPassword"
              :maxlength="8"
              placeholder="请输入"
            ></a-input-password>
          </a-form-item>
          <a-form-item label="角色" name="roleIds">
            <roleSelect v-model:value="userInfoForm.roleIds" mode="multiple" />
          </a-form-item>
          <a-form-item v-if="hasJG" label="管理区域">
            <a-select
              v-model:value="userInfoForm.gridIds"
              placeholder="请选择"
              show-search
              mode="multiple"
              :maxTagCount="3"
              :filter-option="filterOption"
              :options="gridList"
            ></a-select>
          </a-form-item>
          <a-form-item label="状态">
            <a-switch v-model:checked="userInfoForm.enable" />
          </a-form-item>
          <a-form-item label="所属机构" name="orgIds">
            <div class="tree_content">
              <a-tree
                v-if="treeData"
                v-model:checkedKeys="userInfoForm.orgIds"
                v-model:expandedKeys="expandedKeys"
                checkable
                :auto-expand-parent="true"
                :tree-data="treeData"
                @check="onCheck"
              />
            </div>
          </a-form-item>
        </a-form>
      </div>
    </a-modal>
    <!-- 修改密码 -->
    <a-modal
      v-model:visible="visibleModelPassword"
      :width="600"
      title="修改密码"
      :ok-button-props="{ loading: submitLoading }"
      centered
      @cancel="closeHandleModal"
      @ok="onSubmitPassword"
    >
      <div class="pr40px">
        <a-form
          ref="formRef"
          :rules="rulesRef"
          :model="passWordForm"
          :label-col="{ span: 6 }"
          :wrapper-col="{ span: 18 }"
        >
          <a-form-item label="原密码" name="originalPassword">
            <a-input-password
              v-model:value="passWordForm.originalPassword"
              :maxlength="8"
              placeholder="请输入"
            ></a-input-password>
          </a-form-item>
          <a-form-item label="新密码" name="password">
            <a-input-password
              v-model:value="passWordForm.password"
              :maxlength="8"
              placeholder="请输入"
            ></a-input-password>
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
          Object.assign(userInfoForm, {
            uid: '',
            name: '',
            gender: '男',
            password: '',
            mobile: '',
            enable: true,
            orgIds: [],
            roleIds: [],
          });
        }
      "
    >
      <div class="pr30px pl30px">
        <a-descriptions :column="1">
          <a-descriptions-item label="姓名" name="orgId" :span="2">
            {{ userInfoForm.name || '--' }}
          </a-descriptions-item>
          <a-descriptions-item label="手机号" :span="2">
            {{ userInfoForm.mobile || '--' }}
          </a-descriptions-item>

          <a-descriptions-item label="性别" :span="2">
            {{ userInfoForm.gender }}
          </a-descriptions-item>
          <a-descriptions-item label="角色" :span="2">
            <span v-for="(item, index) in roles" :key="index">{{
              item.name + (index == roles.length - 1 ? '' : '、')
            }}</span>
          </a-descriptions-item>
          <!-- <a-descriptions-item label="管理区域" :span="2">
            <span v-for="(item, index) in grids" :key="index">{{
              item.name + (index == grids.length - 1 ? '' : '、')
            }}</span>
          </a-descriptions-item> -->
          <a-descriptions-item label="状态" :span="2">
            <span :style="{ color: userInfoForm.enable ? '#5389d8' : 'red' }">
              {{ userInfoForm.enable ? '启用' : '停用' }}</span
            >
          </a-descriptions-item>
          <a-descriptions-item label="所属机构" name="name" :span="4">
            <div class="tree_content" style="width: 100%">
              <a-tree
                v-model:checkedKeys="userInfoForm.orgIds"
                checkable
                disabled
                defaultExpandAll
                :auto-expand-parent="true"
                :tree-data="treeData"
              />
            </div>
          </a-descriptions-item>
        </a-descriptions>
      </div>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
  import { reactive, computed, ref } from 'vue';
  import userManage from './composables/index';
  import { regCheck } from '@/utils/validate';
  import { mobile } from '@/utils/reg-exp';
  import roleSelect from './components/roleSelect.vue';
  import { useRoleOpt } from '@/hooks/useRoleOpt';
  const { roleOptData } = useRoleOpt();
  const rulesRef = reactive<any>({
    name: [
      {
        required: true,
        message: '请填写该项',
      },
    ],
    mobile: [
      {
        required: true,
        message: '请填写该项',
      },
      {
        validator: regCheck(mobile),
        message: '手机号码格式不正确',
        trigger: 'change',
      },
    ],
    password: [
      {
        required: true,
        message: '请填写该项',
      },
    ],
    confirmPassword: [
      {
        required: true,
        message: '请填写该项',
      },
    ],
    orgIds: [
      {
        required: true,
        message: '请填写该项',
      },
    ],
    roleIds: [
      {
        required: true,
        message: '请选择数据',
      },
    ],
    originalPassword: [
      {
        required: true,
        message: '请填写该项',
      },
    ],
  });
  const filterOption = (input: string, option: any) => {
    return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
  };

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
    downloading,
    roles,
    gridList,
    hasJG,
    grids,
    visibleModelPassword,
    onSubmitPassword,
    passWordForm,
    fileInfo,
    downTemple,
    onCheck,
    getOrgName,
    editUs,
    getList,
    getOrgRoles,
    closeHandleModal,
    onSubmit,
    deletUs,
    resetPassword,
    getOrgCount,
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
    min-width: 300px;
    min-height: 100px;
    max-height: 320px;
    padding: 30px;
    overflow-y: scroll;

    div {
      font-weight: 500;
    }
  }

  .file_input {
    position: absolute;
    right: 26px;
    width: 70px;
    opacity: 0;
  }
</style>
