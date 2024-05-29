import { defineStore } from 'pinia';
import { store } from '@/store';

export const useCommonStore = defineStore({
  id: 'common',
  /**
   * 返回公共状态数据
   */
  state: () => ({
  })
})


// 在组件setup函数外使用
export function useCommonStoreWithOut() {
  return useCommonStore(store);
}