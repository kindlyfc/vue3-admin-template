import { defineStore } from 'pinia';
import { useWsStore } from './ws';
import type { RouteRecordRaw } from 'vue-router';
import { store } from '@/store';
import { login, loginOut, loginInfo } from '@/api/login';
import { ACCESS_TOKEN_KEY, USER_MENU, USER__INFO } from '@/enums/cacheEnum';
import { Storage } from '@/utils/Storage';
import { getPerms } from '@/api/common';
// import { logout, getInfo, permmenu } from '@/api/account';
import { generatorDynamicRouter } from '@/router/generator-router';
import { resetRouter } from '@/router';

interface UserState {
  token: string;
  name: string;
  avatar: string;
  // like [ 'sys:user:add', 'sys:user:update' ]
  perms: string[];
  Perm: string[];
  childrenPath: any[];
  menus: RouteRecordRaw[];
  userInfo: any;
}

export const useUserStore = defineStore({
  id: 'user',
  state: (): UserState => ({
    token: Storage.get(ACCESS_TOKEN_KEY, null),
    name: 'amdin',
    avatar: '',
    perms: [],
    Perm: [],
    menus: [],
    userInfo: {},
    childrenPath: [],
  }),
  getters: {
    getToken(): string {
      return this.token;
    },
    getAvatar(): string {
      return this.avatar;
    },
    getName(): string {
      return this.name;
    },
    getPerms(): string[] {
      return this.perms;
    },
  },
  actions: {
    /** 清空token及用户信息 */
    resetToken() {
      this.avatar = this.token = this.name = '';
      this.perms = [];
      this.menus = [];
      this.userInfo = {};
      Storage.clear();
    },
    /** 登录成功保存token */
    setToken(token: string) {
      this.token = token ?? '';
      const ex = 7 * 24 * 60 * 60 * 1000;
      Storage.set(ACCESS_TOKEN_KEY, this.token, ex);
    },
    /** 登录成功保存菜单 */
    setperms(Perm: any) {
      this.Perm = Perm ?? '';
      const ex = 7 * 24 * 60 * 60 * 1000;
      Storage.set(USER_MENU, this.Perm, ex);
    },
    /** 登录成功保存用户名 */
    setUsername(info: any) {
      this.userInfo = info ?? '';
      const ex = 7 * 24 * 60 * 60 * 1000;
      Storage.set(USER__INFO, this.userInfo, ex);
    },
    /** 登录 */
    async login(params: API.LoginParams, token: string) {
      try {
        const res = await login(params, token);
        this.setToken(res.data.token);
        await this.getTree();
        await this.loginInf();
        return this.afterLogin();
      } catch (error) {
        return Promise.reject(error);
      }
    },
    /** 登录成功之后, 获取用户信息以及生成权限路由 */
    async afterLogin() {
      try {
        // 生成路由
        const generatorResult = await generatorDynamicRouter();
        this.menus = generatorResult.menus;
        return generatorResult.menus;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    /** 登出 */
    async logout() {
      await loginOut();
      const wsStore = useWsStore();
      wsStore.closeSocket();
      this.resetToken();
      resetRouter();
    },

    /** 登出 */
    async loginInf() {
      const info = await loginInfo();
      this.setUsername(info);
    },

    //设置二级路由
    setSecondPath(path: any) {
      this.childrenPath = path;
    },

    //获取当前用户菜单树
    async getTree() {
      await getPerms().then((res) => {
        this.setperms(res);
      });
    },
  },
});

// 在组件setup函数外使用
export function useUserStoreWithOut() {
  return useUserStore(store);
}
