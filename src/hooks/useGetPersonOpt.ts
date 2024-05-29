
import { ref } from 'vue';
import { getPersonList } from '@/api/systemManagement';

export default function useGetPersonOpt() {

  const personOptions = ref<any>([]);
  const personMap = ref<any>({});

  /**
   * 获取人员库列表
   */
  const getPersonOptions = async () => {
    const res = await getPersonList();
    personMap.value = {}
    personOptions.value = res.map((v) => {
      personMap.value[v.libId] = v.libName;
      return {
        label: v.libName,
        value: v.libId,
      };
    });
  };

  getPersonOptions();

  return { getPersonOptions, personOptions, personMap };

}