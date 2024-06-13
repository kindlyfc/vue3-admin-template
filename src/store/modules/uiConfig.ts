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
        // 主题色 string
        colorPrimary: '#1677ff',
        // 成功题色 string
        colorSuccess: '#52c41a',
        // 警戒色 string
        colorWarning: '#faad14',
        // 错误戒色 string
        colorError: '#ff4d4f',
        // 信息色 string
        colorInfo: '#1677ff',
        // 文字色 string
        colorTextBase: '#333333',
        // 字号 number 12-32
        fontSize: 14,
        // 行高 float 0.5-3
        lineHeight: 1.25,
        // 尺寸步长 number 4-16
        sizeStep: 4,
        // 尺寸变化单位 number 1-16
        sizeUnit: 4,
        // 圆角 number 0-16
        borderRadius: 4,
        // 是否线框风格 boolean
        wireframe: false
      }
    },
    // antd官方主题、样式配置未覆盖到的其他样式
    customConfig: {
      // 颜色配置-web端-颜色自定义
      colorManageWeb: [
        {
          // name: 配置项名称string | color：颜色（hex:16进制颜色，hex8：16进制颜色+透明度，a：透明度0-1）| isGradation：是否渐变 boolean | lrRotb：渐变方向 string
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
        { name: '移动端背景', color: [{ hex: '#9bc0f8', hex8: '#9bc0f82a', a: 1 }], isGradation: false, lrRotb: '' }
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
    },
  }
})

// 在组件setup函数外使用
export function useUserStoreWithOut() {
  return useUiStore(store)
}