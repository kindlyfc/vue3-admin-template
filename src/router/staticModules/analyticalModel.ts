import type { RouteRecordRaw } from 'vue-router';
import RouterView from '@/layout/tabs/tabs-view.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/analyticalModel',
    name: '/analyticalModel',
    redirect: '/analyticalModel/statisticAnalysis',
    component: RouterView,
    meta: {
      title: '统计分析',
      icon: 'fenxi',
      authority: 'analyticalModel',
    },
    children: [
      {
        path: 'statisticAnalysis',
        name: `statisticAnalysis`,
        meta: {
          title: '统计分析',
          authority: 'analyticalModel',
        },
        // component: () => import('@/views/analyticalModel/analyticalModel.vue'),
        component: () => import('@/views/analyticalModel/analyticalModelPlus.vue'),
      },
    ],
  },
];

export default routes;
