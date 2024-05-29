import { computed, ref, watch } from 'vue';
import { uniq } from 'lodash-es';

export function useTreeSelect(treeData, selectedKeys) {
  const flatTreeData = {}; // 扁平化树节点key数据


  /**
   * 剔除半选中的key
   * @param keys
   * @returns
   */
  const getRealCheckedKeys = (keys) => {
    return keys.filter((v) => {

      const children = flatTreeData[v] || [];
      if (keys.length < children.length) return false;

      return children.every((child) => keys.includes(child));
    });
  }

  /**
   * 剔除半选中的key后的选中key
   */
  const checkedKeys = computed(() => {
    // 遍历选中的key
    // 如果当前key的所有子节点都被选中，那么当前key也被选中，否则不选中
    return getRealCheckedKeys(selectedKeys.value);

  });

  /**
   * 将树形节点的key转变为map关系
   * @param data
   * @param parentKey
   * @returns
   */
  const flatTree = (data: Array<any>, parentKey = '') => {
    const tree: any = [];
    const parentKeyArr = flatTreeData[parentKey] || [];

    data.forEach((v) => {
      let children: any = [];
      if (v.children?.length > 0) {
        children = flatTree(v.children, v.key);
      }
      tree.push({
        ...v,
        children,
      });
    });

    if (parentKey) {
      flatTreeData[parentKey] = [...parentKeyArr, ...tree.map((v) => v.key), ...tree.map((v) => v.children).flat().map((v) => v.key)];
    }


    return tree;
  };

  watch(treeData,
    () => {

      Object.keys(flatTreeData).forEach((key) => {
        delete flatTreeData[key];
      });

      flatTree(treeData?.value || treeData || []);
    }, { deep: true });


  /**
   * 递归获取node所有parentKey
   * @param node
   * @returns
   */
  const recursionParentKey = (node) => {
    const parentKey: any = [node.key];
    const getParentKey = (node) => {
      if (node.parent) {
        parentKey.push(node?.parent?.key);
        getParentKey(node.parent);
      }
    };
    getParentKey(node);
    return parentKey;
  }

  /**
   * 树节点选择
   * @param checked
   * @param e
   */
  const onCheck = (checked, e) => {
    // console.log('checkedKeys', checked, e, e.halfCheckedKeys);

    if (e.checked) {
      selectedKeys.value = uniq([...selectedKeys.value, ...checked, ...e.halfCheckedKeys]);
    } else {
      selectedKeys.value = selectedKeys.value.filter((v) => ![...recursionParentKey(e.node), ...flatTreeData[e.node.key]].includes(v));
    }
  };
  return {
    checkedKeys,
    getRealCheckedKeys,
    onCheck,
    flatTree,
  }

}
