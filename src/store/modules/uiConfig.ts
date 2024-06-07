// 用于自定义UI配置信息

import { defineStore } from 'pinia'
import { theme } from 'ant-design-vue'
import { store } from '@/store'

interface UiState {
  themeConfig: any
  customConfig: any
}

export const useUiStore = defineStore({
  id: 'ui',
  state: (): UiState => ({
    // antd官方主题、样式配置信息
    themeConfig: {
      algorithm: theme.defaultAlgorithm,
      token: {
        colorPrimary: '#1677ff',
        colorSuccess: '#52c41a',
        colorWarning: '#faad14',
        colorError: '#ff4d4f',
        colorInfo: '#1677ff',
        colorTextBase: '#333333',
        fontSize: 14,
        lineHeight: 1.25,
        sizeStep: 4,
        sizeUnit: 4,
        borderRadius: 4,
        wireframe: false
      }
    },
    // antd官方主题、样式配置未覆盖到的其他样式
    customConfig: {
      // 颜色配置-web端-颜色自定义
      colorManageWeb: [
        {
          name: '左侧菜单栏', color: [{ hex: '#3768ce', hex8: '#3768ceFF', a: 1 }, { hex: '#74b0e4', hex8: '#74b0e4FF', a: 1 }], isGradation: false, lrRotb: 'to bottom'
        },
        { name: '中间顶部', color: [{ hex: '#FFFFFF', hex8: '#FFFFFFFF', a: 1 }], isGradation: false, lrRotb: '' },
        { name: '中间主题背景', color: [{ hex: '#9bc0f8', hex8: '#9bc0f82a', a: 1 }], isGradation: false, lrRotb: '' },
        { name: '表单表头', color: [{ hex: '#FAFAFA', hex8: '#FAFAFAFF', a: 1 }], isGradation: false, lrRotb: '' },
        { name: '表单颜色（单）', color: [{ hex: '#FFFFFF', hex8: '#FFFFFFFF', a: 1 }], isGradation: false, lrRotb: '' },
        { name: '表单颜色（双）', color: [{ hex: '#FFFFFF', hex8: '#FFFFFFFF', a: 1 }], isGradation: false, lrRotb: '' },
      ],
      colorManageMobile: [
        { name: '移动端登录页背景', color: [{ hex: '#FFFFFF', hex8: '#FFFFFFFF', a: 1 }], isGradation: false, lrRotb: '' },
        { name: '移动端背景', color: [{ hex: '#9bc0f8', hex8: '#9bc0f82a', a: 1 }], isGradation: false, lrRotb: '' },
        { name: '导航栏背景', color: [{ hex: '#FAFAFA', hex8: '#FAFAFAFF', a: 1 }], isGradation: false, lrRotb: '' },
        { name: '菜单栏颜色', color: [{ hex: '#FFFFFF', hex8: '#FFFFFFFF', a: 1 }], isGradation: false, lrRotb: '' },
      ]
    }
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
    // 颜色配置-web端-颜色自定义，编辑
    colorManageWebChange(data) {
      this.customConfig.colorManageWeb = data
    },
    // 主题编辑
    themeEdit(data) {
      this.themeConfig.token = data
    }
  }
})

// 在组件setup函数外使用
export function useUserStoreWithOut() {
  return useUiStore(store)
}