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
            // { value: 'darkAlgorithm', label: '暗色' },
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
            <span v-if="record.gradation">&nbsp;-&nbsp;</span>
            <div
              v-if="record.gradation"
              class="w-60px h-20px colorShow"
              :style="{ background: record.color[1].hex8 }"
            ></div>
          </div>
        </template>
        <template v-if="column.dataIndex === 'color'">
          <div class="flex">
            <div>{{ record.color[0].hex }}</div>
            <span v-if="record.gradation">&nbsp;-&nbsp;</span>
            <div v-if="record.gradation">{{ record.color[1].hex }}</div>
          </div>
        </template>
        <template v-if="column.dataIndex === 'a'">
          <div class="flex">
            <div>{{ record.color[0].a ? parseInt(record.color[0].a * 100) + '%' : '--' }}</div>
            <span v-if="record.gradation">&nbsp;-&nbsp;</span>
            <div v-if="record.gradation">{{ parseInt(record.color[1].a * 100) + '%' }}</div>
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

    <div class="font-bold mb-20px">主题编辑</div>
    <officialThemeConfig></officialThemeConfig>

    <!-- 颜色编辑弹框 -->
    <a-modal
      v-model:open="editVisible"
      title="颜色编辑"
      width="600px"
      @ok="submitForm"
      :ok-button-props="{ loading: submitLoading }"
    >
      <a-form
        ref="formRef"
        :model="formData"
        :label-col="{ span: 5 }"
        :wrapper-col="{ span: 19 }"
        relative
      >
        <a-form-item label="颜色选择">
          <ColorSelect v-model:formData="colorData"></ColorSelect>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, computed, watch } from 'vue';
  import { useUiStore } from '@/store/modules/uiConfig';
  import type { TableColumnsType } from 'ant-design-vue';
  import ColorSelect from '@/components/basic/color-select/color-select.vue';
  import officialThemeConfig from './components/officialThemeConfig.vue';
  import { colorConfigModify, colorConfigList } from '@/api/uiConfig';

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
      dataIndex: 'gradation',
      customRender: ({ text }) => {
        return text === false ? '否' : '是';
      },
    },
    {
      title: '渐变方向',
      dataIndex: 'irRotb',
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
  const dataSource = computed<any>(() => uiStore.customConfig.colorManageWeb);

  // S 颜色编辑
  const editVisible = ref<boolean>(false);
  const submitLoading = ref<boolean>(false);

  let name: string = '';
  const showEdit = (record) => {
    name = record.name;
    const { color, gradation, irRotb, nameCode } = record;
    Object.assign(formData, { gradation, irRotb, nameCode });
    Object.assign(colorData, { gradation, irRotb, nameCode });
    if (gradation) {
      formData.colors0 = {
        // hex8: color[0].hex8,
        // hex: color[0].hex,
        // a: color[0].a,
        id: color[0].id,
        nameCode: color[0].nameCode,
      };
      colorData.colors0 = {
        hex8: color[0].hex8,
        hex: color[0].hex,
        a: color[0].a,
      };
      formData.colors100 = {
        // hex8: color[1].hex8,
        // hex: color[1].hex8,
        // a: color[1].a,
        id: color[1].id,
        nameCode: color[1].nameCode,
      };
      colorData.colors100 = {
        hex8: color[1].hex8,
        hex: color[1].hex,
        a: color[1].a,
      };
    } else {
      const { hex, hex8, a, id, nameCode } = color[0];
      formData.colors = { id, nameCode };
      colorData.colors = { hex, hex8, a };
    }
    console.log(formData);
    editVisible.value = true;
  };

  const initColor = () => ({
    hex8: '#FFFFFFFF',
    hex: '#FFFFFF',
    a: 1,
  });

  const formData = reactive<any>({
    gradation: false,
    irRotb: '',
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
  const colorData = reactive<any>({
    gradation: false,
    irRotb: '',
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

  const submitForm = async () => {
    const data: any = { color: [] };
    const { gradation, irRotb, colors, colors0, colors100 } = colorData;
    if (formData.gradation) {
      data.color.push({
        hex8: colors0.hex8,
        hex: colors0.hex,
        a: colors0.a,
        id: formData.colors0.id,
        nameCode: formData.colors0.nameCode,
      });
      data.color.push({
        hex8: colors100.hex8,
        hex: colors100.hex,
        a: colors100.a,
        id: formData.colors100.id,
        nameCode: formData.colors100.nameCode,
      });
    } else {
      const { hex8, hex, a } = colors;
      data.color.push({
        hex8,
        hex,
        a,
        id: formData.colors.id,
        nameCode: formData.colors.nameCode,
      });
      data.color.push({
        hex8,
        hex,
        a,
        id: formData.colors.id,
        nameCode: formData.colors.nameCode,
      });
    }
    Object.assign(data, { gradation, name, irRotb: irRotb || '', nameCode: formData.nameCode });
    submitLoading.value = true;
    try {
      await colorConfigModify(data);
      uiStore.getColorConfigList();
      editVisible.value = false;
    } finally {
      submitLoading.value = false;
    }
    // uiStore.colorManageWebChange(configData);
  };
  // E 颜色编辑
</script>

<style lang="less" scoped>
  .colorShow {
    border: 1px solid #ccc;
  }
</style>
