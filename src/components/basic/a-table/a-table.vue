<!-- 重写a-table组件，支持颜色更换，配置可拖拽列等列属性 -->
<template>
  <Table
    v-bind="tableProps"
    v-on="tableListeners"
    :customHeaderRow="customHeaderRow"
    :customRow="customRow"
    @resizeColumn="handleResizeColumn"
  >
    <template v-for="(slot, name) in $slots" :slot="name" :key="name" v-slot:[name]="slotProps">
      <slot :name="name" v-bind="slotProps"></slot>
    </template>
  </Table>
</template>

<script setup>
  import { useUiStore } from '@/store/modules/uiConfig';
  import { defineProps, useAttrs, computed } from 'vue';
  import { Table } from 'ant-design-vue';

  // S 继承并扩展 a-table 的属性
  const props = defineProps({
    ...Table.props,
  });

  const uiStore = useUiStore();

  const attrs = useAttrs();

  const tableListeners = { ...attrs };

  // 在 columns 中应用统一属性
  const columnsWithCustomProp = props.columns.map((column) => ({
    ...column,
    // 可拖拽
    // resizable: true,
    // 超出单元格省略
    ellipsis: true,
  }));

  const tableProps = computed(() => ({ ...props, columns: columnsWithCustomProp }));
  // E 继承并扩展 a-table 的属性

  // S 表头、表格背景色修改
  const getBGcolor = (name) => {
    return computed(() => {
      const colorInfo = uiStore.customConfig.colorManageWeb.find((item) => item.name === name);
      if (colorInfo?.gradation) {
        return `linear-gradient(${colorInfo?.irRotb}, ${colorInfo?.color[0].hex8}, ${colorInfo?.color[1].hex8})`;
      } else {
        return colorInfo?.color[0].hex8;
      }
    });
  };

  const headerBg = getBGcolor('表单表头');
  const bodyBgOdd = getBGcolor('表单颜色（双）');
  const bodyBgEven = getBGcolor('表单颜色（单）');

  const customHeaderRow = (record, index) => {
    return {
      style: {
        background: headerBg.value,
      },
    };
  };

  const customRow = (record, index) => {
    return {
      style: {
        background: index % 2 === 0 ? bodyBgEven.value : bodyBgOdd.value,
      },
    };
  };
  // S 表头、表格背景色修改

  const handleResizeColumn = (w, col) => {
    console.log(w, col);
    col.width = w;
  };
</script>

<style scoped>
  :deep(.ant-table-cell) {
    background: none !important;
  }
  /* 添加任何自定义样式 */
  .even-row {
    background-color: #ffffff; /* 偶数行背景颜色 */
  }
</style>
