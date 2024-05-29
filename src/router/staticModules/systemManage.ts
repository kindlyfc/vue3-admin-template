import type { RouteRecordRaw } from 'vue-router';
import RouterView from '@/layout/tabs/tabs-view.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/systemManagement',
    name: '/systemManagement',
    redirect: '/systemManagement/userManagement',
    component: RouterView,
    meta: {
      title: '系统管理',
      icon: 'shezhi',
      authority: '/sys',
    },
    children: [
      {
        path: 'userManagement',
        name: `userManagement`,
        meta: {
          title: '用户管理',
          authority: '/sys/user',
        },
        component: () => import('@/views/systemManagement/userManagement/userManagement.vue'),
      },
      {
        path: 'organization',
        name: `organization`,
        meta: {
          title: '组织机构',
          authority: '/sys/org',
        },
        component: () => import('@/views/systemManagement/organization/organization.vue'),
      },
      {
        path: 'roleManagement',
        name: `roleManagement`,
        meta: {
          title: '角色管理',
          authority: '/sys/role',
        },
        component: () => import('@/views/systemManagement/roleManagement/roleManagement.vue'),
      },
      // {
      //   path: 'menuManagement',
      //   name: `menuManagement`,
      //   meta: {
      //     title: '菜单管理',
      //     authority: '/sys/perm',
      //   },
      //   component: () => import('@/views/systemManagement/menuManagement/menuManagement.vue'),
      // },
      {
        path: 'equipmentManage',
        name: `equipmentManage`,
        meta: {
          title: '设备管理',
          authority: '/sys/camera',
        },
        component: () => import('@/views/systemManagement/equipmentManage/equipmentManage.vue'),
      },
      {
        path: 'taskManage',
        name: `taskManage`,
        meta: {
          title: '任务管理',
          authority: '/sys/task',
        },
        component: () => import('@/views/systemManagement/taskMnage/taskManage.vue'),
      },
    ],
  },
];

export default routes;
