// 用于自定义UI配置信息

import { defineStore } from 'pinia'
import { theme } from 'ant-design-vue'
import { store } from '@/store'
import { getModule, nameList, imgList, itemList, colorConfigList } from '@/api/uiConfig'

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
        // id: undefined,
        // // 主题色 string
        // colorPrimary: '#1677ff',
        // // 成功题色 string
        // colorSuccess: '#52c41a',
        // // 警戒色 string
        // colorWarning: '#faad14',
        // // 错误戒色 string
        // colorError: '#ff4d4f',
        // // 信息色 string
        // colorInfo: '#1677ff',
        // // 文字色 string
        // colorTextBase: '#333333',
        // // 字号 number 12-32
        // fontSize: 14,
        // // 行高 float 0.5-3
        // lineHeight: 1.25,
        // // 尺寸步长 number 4-16
        // sizeStep: 4,
        // // 尺寸变化单位 number 1-16
        // sizeUnit: 4,
        // // 圆角 number 0-16
        // borderRadius: 4,
        // // 是否线框风格 boolean
        // wireframe: false
      }
    },
    // antd官方主题、样式配置未覆盖到的其他样式
    customConfig: {
      // 颜色配置-web端-颜色自定义
      colorManageWeb: [
        //   {
        //     // name: 配置项名称string | color：颜色（hex:16进制颜色，hex8：16进制颜色+透明度，a：透明度0-1）| gradation：是否渐变 boolean | irRotb：渐变方向 string
        //     name: '左侧菜单栏', color: [{ hex: '#3768ce', hex8: '#3768ceFF', a: 1 }, { hex: '#74b0e4', hex8: '#74b0e4FF', a: 1 }], gradation: false, irRotb: 'to bottom'
        //   },
        //   { name: '中间顶部', color: [{ hex: '#FFFFFF', hex8: '#FFFFFFFF', a: 1 }], gradation: false, irRotb: '' },
        //   { name: '中间主题背景', color: [{ hex: '#9bc0f8', hex8: '#9bc0f82a', a: 1 }], gradation: false, irRotb: '' },
        //   { name: '表格表头', color: [{ hex: '#FAFAFA', hex8: '#FAFAFAFF', a: 1 }], gradation: false, irRotb: '' },
        //   { name: '表格颜色（单）', color: [{ hex: '#FFFFFF', hex8: '#FFFFFFFF', a: 1 }], gradation: false, irRotb: '' },
        //   { name: '表格颜色（双）', color: [{ hex: '#FFFFFF', hex8: '#FFFFFFFF', a: 1 }], gradation: false, irRotb: '' },
        // ],
        // colorManageMobile: [
        //   { name: '移动端登录页背景', color: [{ hex: '#FFFFFF', hex8: '#FFFFFFFF', a: 1 }], gradation: false, irRotb: '' },
        //   { name: '移动端背景', color: [{ hex: '#9bc0f8', hex8: '#9bc0f82a', a: 1 }], gradation: false, irRotb: '' }
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
      })
      return res
    },
    //获取系统名称
    async getSysName() {
      const res: any = await nameList()
      res.forEach(v => {
        this.systemNameConfig.webLogin = res.find(v => v.namePositionCode == 'web_login_page')
        this.systemNameConfig.webTop = res.find(v => v.namePositionCode == 'web_top')
      })
      return res
    },
    //获取系统LOGO
    async getSysLogo() {
      const res: any = await imgList()
      res.forEach(v => {
        this.systemLogoConfig.webLogin = res.find(v => v.namePositionCode == 'web_login_sys_name_logo')
        this.systemLogoConfig.webTop = res.find(v => v.namePositionCode == 'web_platform_sys_name_logo')
        this.systemLogoConfig.webSysTem = res.find(v => v.namePositionCode == 'web_login_backend')
      })
      return res
    },
    // 获取主题配置
    async getItemList() {
      const res: any = await itemList()
      this.themeConfig.token = res[0]
    },
    // 获取颜色自定义配置
    async getColorConfigList() {
      const res: any = await colorConfigList()
      this.customConfig.colorManageWeb = res.colorManageWeb
      this.customConfig.colorManageMobile = res.colorManageMobile
    },
  }

})

// 在组件setup函数外使用
export function useUserStoreWithOut() {
  return useUiStore(store)
}