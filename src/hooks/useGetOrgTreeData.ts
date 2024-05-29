
import { getOrg } from '@/api/systemManagement';
import { ref } from 'vue';

export default function useGetOrgTreeData() {
  const treeData = ref<any>([]);
  const expandedKeys = ref<any>([]);
  const keyValueMap = ref<any>({});



  //递归赋值
  const recursionDaTa = (data: Array<any>, parentName) => {
    const tree: any = [];
    const _panrentName = parentName ? parentName + '/' : '';

    data.forEach((v) => {
      let children: any = [];
      if (v.children?.length > 0) {
        children = recursionDaTa(v.children, _panrentName + v.name);
      }

      keyValueMap.value[v.id] = _panrentName + v.name;

      tree.push({
        title: v.name,
        key: v.id,
        // disabled: v.disabled,
        children,
      });
    });

    return tree;
  };


  /**
   * 获取组织树数据
   * @param value
   */
  const getOrgName = async (value?: string) => {
    const params: any = {
      isFromQuery: false,
    };
    const res = await getOrg(params);
    treeData.value = recursionDaTa(res, '');
    expandedKeys.value = [treeData.value[0].key];
  };

  getOrgName();

  return { treeData, expandedKeys, keyValueMap, };

}