<template>
  <div class="box">
    <!-- 顶部搜索 -->
    <div class="top_search">
      <div class="mr1.5vw">
        <span class="label">菜单名称</span>
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
        <!-- <a-button
          type="link"
          @click="
            {
              visibleModel = true;
              isUpdate = false;
              isHaveParent = false;
            }
          "
          ><svg-icon name="add" size="15" class="mr-0.3125rem"></svg-icon>新增</a-button
        > -->
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
          <template v-if="column.key === 'iconClass'">
            <i :class="record.iconClass"></i>
          </template>
          <template v-if="column.key === 'enable'">
            <a-switch v-model:checked="record.enable" disabled />
          </template>
          <template v-if="column.key === 'operation'">
            <div>
              <a-button type="link" @click="editUs(record, false)">查看</a-button>
              <!-- <a-button type="link" @click="editUs(record, true)"> 编辑 </a-button> -->
              <!-- <a-button
                type="link"
                danger
                @click="deletUs(record.id)"
              >
                删除
              </a-button> -->
            </div>
          </template>
        </template>
      </a-table>
    </div>

    <!-- 新增编辑弹框 -->
    <a-modal
      v-model:visible="visibleModel"
      :width="600"
      :title="isUpdate ? '编辑菜单' : '新增菜单'"
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
          <a-form-item label="上级菜单" :name="orgForm.type != 2 ? 'parentId' : ''">
            <a-tree-select
              v-model:value="orgForm.parentId"
              style="width: 100%"
              :tree-data="treeData"
              allow-clear
              placeholder="请选择"
              tree-node-filter-prop="label"
            />
          </a-form-item>
          <a-form-item label="菜单类型">
            <a-radio-group v-model:value="orgForm.type">
              <a-radio :value="0">目录</a-radio>
              <a-radio :value="1">菜单</a-radio>
              <a-radio :value="2">按钮</a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item
            v-if="orgForm.type != 2"
            label="菜单图标"
            :name="orgForm.type == 0 ? 'iconClass' : ''"
          >
            <a-select
              v-model:value="orgForm.iconClass"
              placeholder="请选择"
              show-search
              allowClear
              :filter-option="false"
              class="icon_select"
            >
              <a-select-option
                v-for="(item, index) in iconListSelect"
                :key="index"
                :value="item.icon"
              >
                <i :class="item.icon"></i><span style="margin-left: 15px">{{ item.name }}</span>
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="菜单名称" name="name">
            <a-input v-model:value="orgForm.name" placeholder="请输入"></a-input>
          </a-form-item>
          <a-form-item label="显示排序" name="sort">
            <a-input-number id="inputNumber" v-model:value="orgForm.sort" :min="1" />
          </a-form-item>
          <a-form-item v-if="orgForm.type != 2" label="路由地址" name="routing">
            <!-- <div class="w90%! inline-block">
              <ApiSelect
                v-model:value="orgForm.routing"
                :api="getMenuDict"
                result-field="data"
                label-field="remark"
                value-field="routing"
              />
            </div> -->
            <a-input class="w90%!" v-model:value="orgForm.routing" placeholder="请输入"></a-input>
            <a-tooltip placement="top">
              <template #title>
                <span>访问的路由地址，如：`user`</span>
              </template>
              <svg-icon name="wenhao" size="15" class="ml16px"></svg-icon>
            </a-tooltip>
          </a-form-item>
          <a-form-item label="权限字符" name="permKey">
            <a-input class="w90%!" v-model:value="orgForm.permKey" placeholder="请输入"></a-input>
            <a-tooltip placement="top">
              <template #title>
                <span>当前菜单的权限key,如：`/index`</span>
              </template>
              <svg-icon name="wenhao" size="15" class="ml16px"></svg-icon>
            </a-tooltip>
          </a-form-item>
          <a-form-item v-if="orgForm.type == 1" label="路由参数" name="routingParam">
            <a-input
              class="w90%!"
              v-model:value="orgForm.routingParam"
              placeholder="请输入"
            ></a-input>
            <a-tooltip placement="top">
              <template #title>
                <span>访问路由的默认传递参数，如：`{"id": 1, "name": "ry"}`</span>
              </template>
              <svg-icon name="wenhao" size="15" class="ml16px"></svg-icon>
            </a-tooltip>
          </a-form-item>
          <a-form-item v-if="orgForm.type == 1" label="是否缓存" name="isCache">
            <a-radio-group v-model:value="orgForm.isCache">
              <a-radio :value="true">显示</a-radio>
              <a-radio :value="false">隐藏</a-radio>
            </a-radio-group>
            <a-tooltip placement="top">
              <template #title>
                <span>选择是则会被`keep-alive`缓存，需要匹配组件的`name`和地址保持一致</span>
              </template>
              <svg-icon name="wenhao" size="15" class="ml16px"></svg-icon>
            </a-tooltip>
          </a-form-item>
          <a-form-item v-if="orgForm.type != 2" label="显示状态" name="display">
            <a-radio-group v-model:value="orgForm.display">
              <a-radio :value="true">显示</a-radio>
              <a-radio :value="false">隐藏</a-radio>
            </a-radio-group>
            <a-tooltip placement="top">
              <template #title>
                <span>选择隐藏则路由将不会出现在侧边栏，但仍然可以访问</span>
              </template>
              <svg-icon name="wenhao" size="15" class="ml16px"></svg-icon>
            </a-tooltip>
          </a-form-item>
          <a-form-item v-if="orgForm.type != 2" label="菜单状态">
            <a-switch v-model:checked="orgForm.enable" />
            <a-tooltip placement="top">
              <template #title>
                <span>选择停用则路由将不会出现在侧边栏，也不能被访问</span>
              </template>
              <svg-icon name="wenhao" size="15" class="ml16px"></svg-icon>
            </a-tooltip>
          </a-form-item>
        </a-form>
      </div>
    </a-modal>

    <!-- 详情弹框 -->
    <a-modal
      v-model:visible="visibleModel1"
      :width="500"
      title="菜单详情"
      centered
      :footer="null"
      @cancel="
        () => {
          Object.assign(orgForm, {
            id: '',
            name: '',
            permKey: '',
            iconClass: '',
            sort: '',
            routing: '',
            parentId: 0,
            type: 0,
            isCache: true,
            display: true,
            routingParam: '',
            enable: true,
          });
        }
      "
    >
      <div class="pr30px pl30px">
        <a-descriptions :column="1">
          <a-descriptions-item label="名称" :span="2">
            {{ orgForm.name || '--' }}
          </a-descriptions-item>
          <a-descriptions-item label="类型" :span="2">
            {{ orgForm.type == 0 ? '目录' : orgForm.type == 1 ? '菜单' : '按钮' }}
          </a-descriptions-item>
          <a-descriptions-item label="显示排序" :span="2">
            {{ orgForm.sort }}
          </a-descriptions-item>
          <a-descriptions-item label="菜单图标" :span="2">
            <i :class="orgForm.iconClass" class="mt4px"></i>
          </a-descriptions-item>
          <a-descriptions-item label="路由地址" :span="2">
            {{ orgForm.routing }}
          </a-descriptions-item>
          <a-descriptions-item label="权限字符" :span="2">
            <span>{{ orgForm.permKey }}</span>
          </a-descriptions-item>
          <a-descriptions-item label="是否缓存" :span="2">
            <span
              :style="{
                color:
                  orgForm.isCache === true ? '#5389d8' : orgForm.isCache === false ? 'red' : '#000',
              }"
            >
              {{ orgForm.isCache === true ? '是' : orgForm.isCache === false ? '否' : '--' }}</span
            >
          </a-descriptions-item>
          <a-descriptions-item label="显示状态" :span="2">
            <span :style="{ color: orgForm.display ? '#5389d8' : 'red' }">
              {{ orgForm.display ? '显示' : '隐藏' }}</span
            >
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
  import { reactive, ref } from 'vue';
  import userManage from './composables/index';
  import { iconList } from './composables/icon';
  // import { ApiSelect } from '@/components/core/schema-form';
  // import { getMenuDict } from '@/api/systemManagement';
  const iconListSelect = ref<any>(iconList);
  const rulesRef = reactive({
    name: [
      {
        required: true,
        message: '请填写该项',
      },
    ],
    parentId: [
      {
        required: true,
        message: '请填写该项',
      },
    ],
    iconClass: [
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
    routing: [
      {
        required: false,
        message: '请填写该项',
      },
    ],
    permKey: [
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
    // isHaveParent,
    isUpdate,
    visibleModel1,
    treeData,
    editUs,
    getList,
    closeHandleModal,
    onSubmit,
    deletUs,
  } = userManage();
  getList();
</script>

<style lang="less" scoped></style>
