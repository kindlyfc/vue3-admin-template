import type { RouteRecordRaw } from 'vue-router';
import RouterView from '@/layout/tabs/tabs-view.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/iotDevice',
    name: 'iotDevice',
    redirect: '/iotDevice/equipmentEntry',
    component: RouterView,
    meta: {
      title: '物联设备',
      icon: 'shijianpeizhi',
      authority: '/device',
    },
    children: [
      {
        path: 'equipmentEntry',
        name: `equipmentEntry`,
        meta: {
          title: '设备录入',
          authority: '/device/list',
        },
        component: () => import('@/views/iotDevice/equipmentEntry/equipmentEntry.vue'),
      }
    ],
  },
];

export default routes;
