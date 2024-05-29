<template>
  <a-tree-select
    :tree-data="treeData"
    allow-clear
    placeholder="请选择"
    tree-node-filter-prop="title"
    :fieldNames="{
      label: 'title',
      value: 'key',
    }"
    @change="treeChange"
    v-bind="{
      ...props,
    }"
    v-model:value="treeSelectedKeys"
  />
</template>

<script setup lang="ts">
  import { ref, watch } from 'vue';
  import useGetOrgTreeData from '@/hooks/useGetOrgTreeData';

  const props = defineProps({
    value: {
      type: Array,
    },
    maxTagCount: {
      type: Number,
      default: 1,
    },
    multiple: {
      type: Boolean,
      default: true,
    },
  });

  const emits = defineEmits(['update:value', 'change']);

  const treeSelectedKeys = ref<any>([]);
  const { treeData } = useGetOrgTreeData();

  watch(
    () => props.value,
    (val) => {
      treeSelectedKeys.value = val;
    },
    {
      immediate: true,
    },
  );

  watch(
    () => treeSelectedKeys.value,
    (val) => {
      // console.log('更新数据', val);
      emits('update:value', val);
    },
  );

  /**
   * 通过字母将字符串分割成数组
   * @param str
   */
  const splitByLetter = (str: string) => {
    return str.split(/(?=[A-Z])/);
  };

  /**
   * 组织机构树选择数据变化
   * @param value
   * @param label
   * @param extra
   */
  const treeChange = (value: any, label, extra) => {
    // console.log('组织数据变化：', value, label, extra);
    const firstCode = splitByLetter(extra.triggerValue)[0];
    treeSelectedKeys.value = value.filter((v: any) => {
      return v.startsWith(firstCode);
    });

    const selectLabel = treeSelectedKeys.value.map((v: any) => {
      return label[value.findIndex((item: any) => item === v)];
    });

    // console.log('数据处理完成', treeSelectedKeys.value, selectLabel);

    emits('change', treeSelectedKeys.value, selectLabel);
    emits('update:value', treeSelectedKeys.value);
  };
</script>

<style lang="less" scoped></style>
