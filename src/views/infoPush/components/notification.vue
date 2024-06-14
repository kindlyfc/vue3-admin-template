<template>
  <div>
    <div class="top_search">
      <div class="mr1.5vw">
        <span>公告名称：</span>
        <a-input placeholder="请输入公告名称"></a-input>
      </div>
      <div class="flex ml-auto">
        <a-button class="mr-20px">查询</a-button>
        <a-button>重置</a-button>
      </div>
    </div>

    <div>
      <div class="flex-end mb-20px">
        <!-- 表格上方操作按钮 -->
        <div class="flex">
          <a-button type="primary" @click="open = true">新增公告</a-button>
        </div>
      </div>

      <a-table
        :columns="columns"
        :data-source="data"
        :scroll="{ x: 1500, y: 'calc(100vh - 450px)' }"
      >
        <template #bodyCell="{ column, index }">
          <template v-if="column.dataIndex === 'operation'">
            <div>
              <a-button type="link" @click="open = true">编辑</a-button>
              <a-button type="link" @click="open = true">复制</a-button>
              <a-button type="link" @click="open = true">推送</a-button>
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
    <a-modal v-model:open="open" :title="modalTitle" width="900px">
      <a-form
        ref="formRef"
        :model="formState"
        :rules="rules"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 16 }"
      >
        <a-row>
          <a-col :span="12">
            <a-form-item label="公告名称" name="name">
              <a-input v-model:value="formState.name" placeholder="请输入公告名称" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="推送人" name="person">
              <a-input v-model:value="formState.person" placeholder="请输入推送人" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-item label="推送方式" name="methods">
              <a-select
                v-model:value="formState.methods"
                :options="methods"
                placeholder="请选择推送方式"
              >
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              label="推送时间"
              v-if="formState.methods === 1"
              :rules="[{ required: true, message: '请选择推送时间' }]"
              name="time"
            >
              <a-date-picker
                v-model:value="formState.time"
                class="w-100%!"
                value-format="YYYY-MM-DD"
              >
              </a-date-picker>
            </a-form-item>
          </a-col>
        </a-row>
        <a-form-item
          label="公告内容"
          name="content"
          :label-col="{ span: 3 }"
          :wrapper-col="{ span: 20 }"
        >
          <MdEditor v-model="formState.content" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
  import { reactive, ref } from 'vue';
  import { MdEditor } from 'md-editor-v3';
  import 'md-editor-v3/lib/style.css';

  const columns = [
    { title: '序号', dataIndex: 'index', width: 80 },
    { title: '公告名称', dataIndex: 'name', width: 180 },
    { title: '公告内容', dataIndex: 'content' },
    { title: '推送方式', dataIndex: 'methods', width: 220 },
    { title: '推送人员', dataIndex: 'person', width: 180 },
    { title: '推送时间', dataIndex: 'time', width: 180 },
    { title: '信息状态', dataIndex: 'status', width: 100 },
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
      content: '您的企业存在隐患内容，请点击查看详情，整改后请提交整改材料',
      methods: `消息通知模块、小程序通知`,
      person: '全部人员',
      time: '2024-05-24 08:00',
      status: 1,
    });
  }

  const open = ref(false);
  const modalTitle = ref('新增公告');
  const methods = ref([
    { label: '立即推送', value: 0 },
    { label: '定时推送', value: 1 },
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
