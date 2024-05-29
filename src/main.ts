import { createApp } from 'vue';
import App from './App.vue';
import { setupRouter } from './router';
import { setupStore } from '@/store';
import { setupI18n } from '@/locales';
import 'uno.css';
import {
  setupAntd,
  setupAssets,
  setupDirectives,
  setupGlobalMethods,
  setupCustomComponents,
} from '@/plugins';
import exportBtn from '@/components/basic/exportBtn/index.vue';
import jessibucaPlayer from '@/components/basic/jessibucaPlayer.vue';
import VideoPlayer from '@/components/basic/VideoPlayer.vue';
import chooseTree from '@/components/basic/chooseTree.vue';
const app = createApp(App);
import vue3videoPlay from 'vue3-video-play-emiyagm'; // 引入组件
import 'vue3-video-play-emiyagm/dist/style.css'; // 引入css
import 'font-awesome/css/font-awesome.css'
function setupPlugins() {
  // 注册全局常用的ant-design-vue组件
  setupAntd(app);
  // 引入静态资源
  setupAssets();
  // 注册全局自定义组件,如：<svg-icon />
  setupCustomComponents(app);
  // 注册全局自定义指令，如：v-permission权限指令
  setupDirectives(app);
  // 注册全局方法，如：app.config.globalProperties.$message = message
  setupGlobalMethods(app);
}

async function setupApp() {
  // 挂载vuex状态管理
  setupStore(app);
  // Multilingual configuration
  // Asynchronous case: language files may be obtained from the server side
  await setupI18n(app);
  // 挂载路由
  await setupRouter(app);
  app.use(vue3videoPlay);
  app.component('exportBtn', exportBtn); //注册全局导出组件
  // app.component('jessibucaPlayer', jessibucaPlayer); //注册全局播放组件
  app.component('VideoPlayer', VideoPlayer); //注册全局播放组件
  app.component('chooseTree', chooseTree); //注册全局设备选择组件
  app.mount('#app');
}

setupPlugins();

setupApp();
