<template>
  <a-select
    placeholder="请选择"
    show-search
    allowClear
    :filter-option="false"
    :maxTagCount="2"
    :options="roleOptData"
    @search="getRoleOpt"
    @focus="getRoleOpt('')"
    v-bind="{ ...$attrs, ...$props }"
  ></a-select>
</template>

<script setup lang="ts">
  import { useRoleOpt } from '@/hooks/useRoleOpt';

  const { roleOptData, getRoleOpt } = useRoleOpt();
</script>

<style scoped></style>
