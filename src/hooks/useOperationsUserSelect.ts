

import { ref } from 'vue';
import { operationsUserList } from '@/api/rskPersonnel';

export function useOperationsUserSelect() {
  const personTypeOption = ref([]);

  const getList = async () => {
    const res = await operationsUserList({});
    if (res.code === 200) {
      personTypeOption.value = res.data.map((item) => ({
        label: item.name,
        value: item.uid,
      }));
    }
  };

  getList();

  return {
    personTypeOption
  }
}
