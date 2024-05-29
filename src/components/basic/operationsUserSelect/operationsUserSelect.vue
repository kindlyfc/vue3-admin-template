<template>
  <a-cascader
    v-bind="{ ...$props, ...$attrs }"
    v-model:value="personType"
    :options="personTypeOption"
    :show-search="{ filter }"
    placeholder="请选择"
  ></a-cascader>
</template>

<script setup>
  import { ref } from 'vue';
  import { useVModel } from '@vueuse/core';
  import { operaUserList } from '@/api/rskPersonnel';
  const personTypeOption = ref([]);

  const props = defineProps({
    value: {
      type: [String, Number, Array],
      default: '',
    },
  });

  const emit = defineEmits(['update:value']);

  const personType = useVModel(props, 'value', emit);
  const filter = (inputValue, path) => {
    return path.some((option) => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1);
  };
  const getList = async (name) => {
    // const data = {
    //   pageSize: 200,
    //   pageNum: 1,
    //   name: name,
    // };
    try {
      const res = await operaUserList();
      personTypeOption.value = pushUserData(res);
    } catch (error) {
      console.log('获取运维人员列表失败：', error);
    }
  };

  getList('');

  /* 递归赋值人员树 */
  const pushUserData = (data) => {
    let arr = [];
    data.forEach((v) => {
      let children = [];
      if ((v.roles && v.roles?.length > 0) || (v.users && v.users?.length > 0)) {
        children = pushUserData(v.roles || v.users);
      }
      if (v.gridId || v.gridName || v.roleName || v.uid || v.name) {
        arr.push({
          label: v.gridName || v.roleName || v.name,
          value: v.gridId || v.roleName || v.uid,
          children,
          isUser: !!v.roleName,
        });
      }
    });
    return arr;
  };
</script>

<style lang="less" scoped></style>
