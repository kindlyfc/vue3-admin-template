// 用于自定义UI配置信息

import { defineStore } from 'pinia';
import { theme } from 'ant-design-vue';
import { store } from '@/store';

interface UiState {
  themeConfig: any;
  customConfig: Object;
}

export const useUiStore = defineStore({
  id: 'ui',
  state: (): UiState => ({
    // antd官方主题、样式配置信息
    themeConfig: {
      algorithm: theme.defaultAlgorithm
    },
    // antd官方主题、样式配置未覆盖到的其他样式
    customConfig: {}
  }),
  getters: {
    getTheme(): Object {
      return this.themeConfig
    },
  },
  actions: {
    // 更换主题
    changeTheme(data) {
      this.themeConfig.algorithm = theme[data]
    },
  }
})

// 在组件setup函数外使用
export function useUserStoreWithOut() {
  return useUiStore(store);
}