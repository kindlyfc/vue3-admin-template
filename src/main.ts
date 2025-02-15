import { createApp } from 'vue'
import App from './App.vue'
import { setupRouter } from './router'
import { setupStore } from '@/store'
import { setupI18n } from '@/locales'
import 'uno.css'
import {
  setupAntd,
  setupAssets,
  setupDirectives,
  setupGlobalMethods,
  setupCustomComponents,
} from '@/plugins'
const app = createApp(App)
import 'vue3-video-play-emiyagm/dist/style.css' // 引入css
import 'font-awesome/css/font-awesome.css'
import 'ant-design-vue/dist/reset.css';
import Antd from 'ant-design-vue';

import ATable from '@/components/basic/a-table/a-table.vue'

function setupPlugins() {
  // 注册全局常用的ant-design-vue组件
  setupAntd(app)
  // 引入静态资源
  setupAssets()
  // 注册全局自定义组件,如：<svg-icon />
  setupCustomComponents(app)
  // 注册全局自定义指令，如：v-permission权限指令
  setupDirectives(app)
  // 注册全局方法，如：app.config.globalProperties.$message = message
  setupGlobalMethods(app)
  // 全局注册二次封装的 a-table 组件
  app.component('a-table', ATable)
}

async function setupApp() {
  // 挂载vuex状态管理
  setupStore(app)
  // Multilingual configuration
  // Asynchronous case: language files may be obtained from the server side
  await setupI18n(app)
  // 挂载路由
  await setupRouter(app)
  app.use(Antd).mount('#app')
}
setupPlugins()
setupApp()
