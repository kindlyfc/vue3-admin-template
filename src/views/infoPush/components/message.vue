<template>
  <div>
    <div>
      <div class="flex-end mb-20px">
        <!-- 表格上方操作按钮 -->
        <div class="flex">
          <a-button type="primary" @click="open = true">新增模板</a-button>
        </div>
      </div>

      <a-table
        :columns="columns"
        :data-source="data"
        :scroll="{ x: 1500, y: 'calc(100vh - 350px)' }"
      >
        <template #bodyCell="{ column, index }">
          <template v-if="column.dataIndex === 'operation'">
            <div>
              <a-button type="link" @click="open = true">编辑</a-button>
              <a-button type="link" @click="open = true">复制</a-button>
              <a-button type="link" danger>删除</a-button>
            </div>
          </template>
          <template v-if="column.dataIndex === 'status'">
            <a-tag color="success">已推送</a-tag>
          </template>
          <template v-if="column.dataIndex === 'index'">
            {{ index + 1 }}
          </template>
        </template>
      </a-table>
    </div>

    <!-- 新增、编辑公告 -->
    <a-modal v-model:open="open" :title="modalTitle" width="600px">
      <a-form
        ref="formRef"
        :model="formState"
        :rules="rules"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 16 }"
      >
        <a-form-item label="模板名称" name="name">
          <a-input v-model:value="formState.name" placeholder="请输入公告名称" />
        </a-form-item>
        <a-form-item label="模板ID" name="person">
          <a-input v-model:value="formState.person" placeholder="请输入推送人" />
        </a-form-item>

        <a-form-item label="推送内容" name="content">
          <a-textarea
            v-model:value="formState.content"
            placeholder="请输入推送内容"
            :auto-size="{ minRows: 6, maxRows: 10 }"
          />
        </a-form-item>

        <a-form-item label="推送方式" name="methods">
          <a-checkbox-group v-model:value="formState.methods" style="width: 100%">
            <a-row>
              <a-col :span="8" v-for="item in methods" :key="item.value" class="mt-8px">
                <a-checkbox :value="item.value">{{ item.label }}</a-checkbox>
              </a-col>
            </a-row>
          </a-checkbox-group>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
  import { reactive, ref } from 'vue';
  const columns = [
    { title: '序号', dataIndex: 'index', width: 80 },
    { title: '模板名称', dataIndex: 'name', width: 180 },
    { title: '模板ID', dataIndex: 'id', width: 180 },
    { title: '模板内容', dataIndex: 'content' },
    { title: '推送方式', dataIndex: 'methods' },
    {
      title: '操作',
      dataIndex: 'operation',
      fixed: 'right',
      width: 300,
    },
  ];

  const data: any[] = [];
  for (let i = 0; i < 1; i++) {
    data.push({
      key: i,
      name: `隐患结果提醒`,
      id: 'B000987',
      content: '您的企业存在隐患内容，请点击查看详情，整改后请提交整改材料',
      methods: `消息通知模块、小程序通知`,
    });
  }

  const open = ref(false);
  const modalTitle = ref('新增模板');
  const methods = ref([
    { label: 'web消息弹窗', value: 0 },
    { label: 'web个人中心', value: 1 },
    { label: 'web警示弹窗', value: 3 },
    { label: '小程序消息通知', value: 4 },
    { label: 'h5消息通知', value: 5 },
    { label: '服务号通知', value: 6 },
    { label: '公众号通知', value: 7 },
    { label: '短信通知', value: 8 },
  ]);
  const rules = {
    name: [{ required: true, message: '请输入公告名称' }],
    person: [{ required: true, message: '请输入推送人' }],
    methods: [{ required: true, message: '请选择推送方式' }],
    content: [{ required: true, message: '请输入公告内容' }],
  };
  const initFormState = () => ({
    name: undefined,
    person: undefined,
    methods: undefined,
    time: '',
    content: undefined,
  });
  const formState = reactive(initFormState());
</script>
<style scoped lang="less"></style>
