import type { App } from 'vue';

import { AButton } from '@/components/basic/button/index';

import 'ant-design-vue/dist/reset.css';

import 'dayjs/locale/zh-cn';

export function setupAntd(app: App<Element>) {
  app.component('AButton', AButton);
}
