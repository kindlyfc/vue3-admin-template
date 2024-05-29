import { computed } from 'vue';
import {
  getRoles,
} from '@/api/systemManagement';
import { debounce } from 'lodash-es'

import { useAsyncState } from '@vueuse/core'


export function useRoleOpt() {

  const params: any = {
    current: 1,
    size: 1000,
    enable: undefined,
  };

  const { state, error, execute } = useAsyncState((args) => {
    return getRoles({ ...params, name: args?.name }).then((res: any) => res?.records || []);
  }, {}, { immediate: true, })


  const roleOptData = computed(() => {
    try {
      return (state.value || []).map((item) => ({
        label: item.name,
        value: item.id,
      }));
    } catch (error) {
      return [];
    }
  });

  const getRoleOpt = debounce((args) => {
    execute(0, { name: args })
  }, 1000);

  return {
    roleOptData,
    getRoleOpt,
  }
}