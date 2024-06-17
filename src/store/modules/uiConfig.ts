// 用于自定义UI配置信息

import { defineStore } from 'pinia'
import { theme } from 'ant-design-vue'
import { store } from '@/store'
import { getModule, nameList, imgList } from '@/api/uiConfig';

interface UiState {
  themeConfig: any
  customConfig: any
  systemNameConfig: any
  systemLogoConfig: any
  systemModule1: any
  systemModule2: any
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
          name: '左侧菜单栏', color: [{ hex: '#915E5E', hex8: '#915E5EFF', a: 1 }, { hex: '#3B2996', hex8: '#3B2996FF', a: 1 }], isGradation: true, lrRotb: 'to bottom'
        },
        { name: '中间顶部', color: [{ hex: '#FFFFFF', hex8: '#FFFFFFFF', a: 1 }], isGradation: false, lrRotb: '' },
        { name: '中间主题背景', color: [{ hex: '#9bc0f8', hex8: '#9bc0f82a', a: 1 }], isGradation: false, lrRotb: '' },
        { name: '表单表头', color: [{ hex: '#FAFAFA', hex8: '#FAFAFAFF', a: 1 }], isGradation: false, lrRotb: '' },
        { name: '表单颜色（单）', color: [{ hex: '#FFFFFF', hex8: '#FFFFFFFF', a: 1 }], isGradation: false, lrRotb: '' },
        { name: '表单颜色（双）', color: [{ hex: '#FFFFFF', hex8: '#FFFFFFFF', a: 1 }], isGradation: false, lrRotb: '' },
      ]
    },
    //系统名称配置
    systemNameConfig: {
      webLogin: null,
      webTop: null,
    },
    //系统LOGO配置
    systemLogoConfig: {
      webLogin: null,
      webTop: null,
      webSysTem: null
    },
    //系统module配置一级菜单
    systemModule1: null,
    //系统module配置二级菜单
    systemModule2: null,
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
    //获取系统模块
    async getModule() {
      const res: any = await getModule()
      res.forEach(v => {
        v.moduleName == '一级模块' ? this.systemModule1 = v : this.systemModule2 = v
      });
      return res
    },
    //获取系统名称
    async getSysName() {
      const res: any = await nameList()
      res.forEach(v => {
        this.systemNameConfig.webLogin = res.find(v => v.namePositionCode == 'web_login_page')
        this.systemNameConfig.webTop = res.find(v => v.namePositionCode == 'web_top')
      });
      return res
    },
    //获取系统LOGO
    async getSysLogo() {
      const res: any = await imgList()
      res.forEach(v => {
        this.systemLogoConfig.webLogin = res.find(v => v.namePositionCode == 'web_login_sys_name_logo')
        this.systemLogoConfig.webTop = res.find(v => v.namePositionCode == 'web_platform_sys_name_logo')
        this.systemLogoConfig.webSysTem = res.find(v => v.namePositionCode == 'web_login_backend')
      });
      return res
    }
  }
})

// 在组件setup函数外使用
export function useUserStoreWithOut() {
  return useUiStore(store)
}