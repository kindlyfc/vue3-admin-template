import type { RouteRecordRaw } from 'vue-router';
import RouterView from '@/layout/tabs/tabs-view.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/colorManage',
    name: '/colorManage',
    redirect: '/colorManage/mobile',
    component: RouterView,
    meta: {
      title: '颜色配置',
      icon: 'shezhi',
      authority: '/sys',
    },
    children: [
      {
        path: 'mobile',
        name: `mobile`,
        meta: {
          title: '移动端',
          authority: '/sys/user',
        },
        component: () => import('@/views/colorManage/mobile/index.vue'),
      },
      {
        path: 'web',
        name: `web`,
        meta: {
          title: 'web端',
          authority: '/sys/user',
        },
        component: () => import('@/views/colorManage/web/index.vue'),
      }
    ],
  },
  {
    path: '/quickSystemConfig',
    name: '/quickSystemConfig',
    redirect: '/quickSystemConfig/nameManage',
    component: RouterView,
    meta: {
      title: '系统快捷配置',
      icon: 'sz',
      authority: '/sys',
    },
    children: [
      {
        path: 'nameManage',
        name: `nameManage`,
        meta: {
          title: '名称管理',
          authority: '/sys/user',
        },
        component: () => import('@/views/quickSystemConfig/nameManage/index.vue'),
      },
      {
        path: 'buttonManage',
        name: `buttonManage`,
        meta: {
          title: '按钮管理',
          authority: '/sys/user',
        },
        component: () => import('@/views/quickSystemConfig/buttonManage/index.vue'),
      },
      {
        path: 'modulemanage',
        name: `modulemanage`,
        meta: {
          title: '模块管理',
          authority: '/sys/user',
        },
        component: () => import('@/views/quickSystemConfig/modulemanage/index.vue'),
      }
    ],
  },
  {
    path: '/infoPush',
    name: '/infoPush',
    redirect: '/infoPush/infoPushIndex',
    component: RouterView,
    meta: {
      title: '消息推送',
      icon: 'info',
      authority: '/sys',
    },
    children: [
      {
        path: 'infoPushIndex',
        name: `infoPushIndex`,
        meta: {
          title: '消息推送管理',
          authority: '/sys/user',
        },
        component: () => import('@/views/infoPush/index.vue'),
      }
    ],
  },
];

export default routes;
