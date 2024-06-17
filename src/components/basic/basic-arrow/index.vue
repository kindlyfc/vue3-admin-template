<!-- src/components/CustomTable.vue -->
<template>
  <a-table v-bind="tableProps" v-on="tableListeners" @row-click="handleRowClick">
    <!-- Forward slots to the inner a-table component -->
    <template v-for="(slot, name) in $slots" :slot="name" :key="name" v-slot:[name]="slotProps">
      <slot :name="name" v-bind="slotProps"></slot>
    </template>
  </a-table>
</template>

<script setup lang="ts">
  import { defineProps, defineEmits, useAttrs } from 'vue';
  import { Table } from 'ant-design-vue';

  const props = defineProps({
    ...Table.props, // 继承所有 a-table 的属性
  });

  const emits = defineEmits(['row-click']);

  const attrs = useAttrs();

  const tableProps = { ...props };

  const tableListeners = { ...attrs };

  function handleRowClick(record, index, event) {
    emits('row-click', record, index, event);
  }
</script>

<style scoped>
  /* 添加任何自定义样式 */
</style>
