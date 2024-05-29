<template>
  <div>
    <div class="search_cont">
      <a-input-search
        v-model:value="arename"
        placeholder="请输入区域"
        @search="chooseName"
      ></a-input-search>
    </div>
    <div class="tree_cont">
      <a-tree
        v-model:expandedKeys="parentKeys"
        v-model:selectedKeys="selectedKeys"
        :checkable="false"
        :defaultExpandAll="true"
        defaultExpandParent
        :auto-expand-parent="true"
        :tree-data="treeData"
        showIcon
        @select="selectItems"
      >
        <!-- 自定义子级的图标 -->
        <template #icon="{ children, data }">
          <svg-icon
            v-if="!children"
            name="camera"
            size="14"
            class="mr-4px"
            :style="{ color: iconColorMap[data.status] }"
          ></svg-icon>
        </template>
      </a-tree>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, watchEffect, onMounted, reactive } from 'vue';
  import { getUserOrgs, getDivceUrl } from '@/api/common';
  const props = defineProps({});
  const arename = ref<any>('');
  const treeData = ref<any>([]);
  const parentKeys = ref<any>([]);
  const selectedKeys = ref<any>([]);
  const iconColorMap = reactive({
    control: '#FE991DFF', // 布控摄像头
    offline: '#CCCCCCFF', // 离线摄像头
  });

  onMounted(() => {
    getDeviceList();
  });
  const emit = defineEmits(['update:value', 'select']);
  const chooseName = () => {
    getDeviceList(arename.value);
  };

  const getDeviceList = async (name = '') => {
    const res = await getUserOrgs(name);
    treeData.value = recursionDaTa(res);
    parentKeys.value = [treeData.value[0]?.key];
  };
  //递归赋值
  const recursionDaTa = (data: Array<any>) => {
    const tree: any = [];
    data.forEach((v) => {
      let children: any = [];
      if (v.children?.length > 0) {
        children = recursionDaTa(v.children);
      }
      if (v.cameras?.length > 0) {
        children = recursionDaTa(v.cameras);
      }
      tree.push({
        title: v.name,
        key: v.id,
        rtsp: v.rtsp,
        isPlay: false,
        children,
      });
    });

    return tree;
  };
  /**
   * 选择摄像头
   *
   * @param {any} val - 要选择的值。
   * @param {Event} evt - 触发选择的事件。
   */
  const selectItems = (val, evt) => {
    if (evt.selectedNodes[0].rtsp) {
      getDivceUrl(val[0]).then((res) => {
        // 判断调用父级方法将当前选择的摄像头数据传递出去
        emit('select', res);
      });
    }
  };

  watchEffect(() => {});
</script>

<style lang="less" scoped>
  .search_cont {
    display: flex;
    height: 35px;
    background: #ffffff;
    border-radius: 6px;
    border: 1.5px solid #eee;

    :deep(.ant-input-search-button) {
      border: none !important;
    }

    :deep(.ant-input) {
      flex: 4 !important;
      border: none !important;
      height: 32px !important;
    }
  }

  .tree_cont {
    margin-top: 30px;
  }
</style>
