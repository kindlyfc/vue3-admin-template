<template>
  <div>
    <div class="font-bold mb-20px">主题切换</div>
    <div class="top_search">
      <div class="mr1.5vw">
        <span class="label">选择主题：</span>
        <a-select
          v-model:value="themeAlgorithm"
          @change="changeTheme"
          placeholder="请选择"
          :options="[
            { value: 'defaultAlgorithm', label: '默认' },
            { value: 'darkAlgorithm', label: '暗色' },
            { value: 'compactAlgorithm', label: '紧凑' },
          ]"
        ></a-select>
      </div>
    </div>
    <div class="font-bold mb-20px">颜色自定义</div>
    <a-table
      class="w-100% mb-20px"
      :columns="columns"
      :data-source="dataSource"
      :pagination="false"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'colorShow'">
          <div class="flex">
            <div
              class="w-60px h-20px colorShow"
              :style="{ background: record.color[0].hex8 }"
            ></div>
            <span v-if="record.color[1]">&nbsp;-&nbsp;</span>
            <div
              v-if="record.color[1]"
              class="w-60px h-20px colorShow"
              :style="{ background: record.color[1].hex8 }"
            ></div>
          </div>
        </template>
        <template v-if="column.dataIndex === 'color'">
          <div class="flex">
            <div>{{ record.color[0].hex }}</div>
            <span v-if="record.color[1]">&nbsp;-&nbsp;</span>
            <div v-if="record.color[1]">{{ record.color[1].hex }}</div>
          </div>
        </template>
        <template v-if="column.dataIndex === 'a'">
          <div class="flex">
            <div>{{ parseInt(record.color[0].a * 100) + '%' }}</div>
            <span v-if="record.color[1]">&nbsp;-&nbsp;</span>
            <div v-if="record.color[1]">{{ parseInt(record.color[1].a * 100) + '%' }}</div>
          </div>
        </template>
        <template v-if="column.dataIndex === 'colorShow'">
          <div class="w-80px h-20px" :style="{ background: record.color, color: '#fff' }"></div>
        </template>
        <template v-if="column.dataIndex === 'operation'">
          <div>
            <a-button type="link" @click="showEdit(record)">编辑</a-button>
          </div>
        </template>
      </template>
    </a-table>

    <!-- 颜色编辑弹框 -->
    <a-modal v-model:open="editVisible" title="颜色编辑" width="600px" @ok="submitForm">
      <a-form
        ref="formRef"
        :model="formData"
        :label-col="{ span: 5 }"
        :wrapper-col="{ span: 19 }"
        relative
      >
        <a-form-item label="颜色选择">
          <ColorSelect @form-data-change="getColorData" v-model:formData="formData"></ColorSelect>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive } from 'vue';
  import { useUiStore } from '@/store/modules/uiConfig';
  import type { TableColumnsType } from 'ant-design-vue';
  import ColorSelect from '@/components/basic/color-select/color-select.vue';

  const uiStore = useUiStore();

  const themeAlgorithm = ref<'defaultAlgorithm' | 'darkAlgorithm' | 'compactAlgorithm'>(
    'defaultAlgorithm',
  );
  const changeTheme = (value) => {
    uiStore.changeTheme(value);
  };

  const lrRotbMap = ref([
    { name: '从上到下', value: 'to bottom' },
    { name: '从左到右', value: 'to right' },
  ]);

  const columns: TableColumnsType = [
    { title: '颜色区域', dataIndex: 'name' },
    { title: '颜色色号', dataIndex: 'color' },
    { title: '颜色显示', dataIndex: 'colorShow' },
    {
      title: '是否渐变',
      dataIndex: 'isGradation',
      customRender: ({ text }) => {
        return text === false ? '否' : '是';
      },
    },
    {
      title: '渐变方向',
      dataIndex: 'lrRotb',
      customRender: ({ text }) => {
        return lrRotbMap.value.find((item) => item.value === text)?.name;
      },
    },
    { title: '透明度', dataIndex: 'a' },
    {
      title: '操作',
      dataIndex: 'operation',
      fixed: 'right',
    },
  ];
  const dataSource = ref(uiStore.customConfig.colorManageMobile);

  // S 颜色编辑
  const editVisible = ref<boolean>(false);

  let name: string = '';
  const showEdit = (record) => {
    name = record.name;
    const { color, isGradation, lrRotb } = record;
    Object.assign(formData, { isGradation, lrRotb });
    if (isGradation) {
      formData.colors0 = { hex8: color[0].hex8, hex: color[0].hex, a: color[0].a };
      formData.colors100 = { hex8: color[1].hex8, hex: color[1].hex8, a: color[1].a };
    } else {
      const { hex, hex8, a } = color[0];
      formData.colors = { hex, hex8, a };
    }
    editVisible.value = true;
  };

  const initColor = () => ({
    hex8: '#FFFFFFFF',
    hex: '#FFFFFF',
    a: 1,
  });

  const formData = reactive<any>({
    isGradation: false,
    lrRotb: '',
    /* 颜色选择器 */
    colors: initColor(),
    colorsShow: false,
    /* 颜色选择器0% */
    colors0: initColor(),
    colorsShow0: false,
    /* 颜色选择器100% */
    colors100: initColor(),
    colorsShow100: false,
  });

  const getColorData = (data) => {
    Object.assign(formData, data);
  };

  const submitForm = () => {
    const data: any = {};
    const { isGradation, lrRotb, colors, colors0, colors100 } = formData;
    Object.assign(data, { isGradation, name, lrRotb, color: [] });
    if (formData.isGradation) {
      data.color.push({
        hex8: colors0.hex8,
        hex: colors0.hex,
        a: colors0.a,
      });
      data.color.push({
        hex8: colors100.hex8,
        hex: colors100.hex,
        a: colors100.a,
      });
    } else {
      const { hex8, hex, a } = colors;
      data.color.push({ hex8, hex, a });
    }
    const configData = dataSource.value;
    const index = configData.findIndex((item) => item.name === name);
    configData[index] = data;
    uiStore.colorManageWebChange(configData);
    editVisible.value = false;
  };
  // E 颜色编辑
</script>

<style lang="less" scoped>
  .colorShow {
    border: 1px solid #ccc;
  }
</style>
