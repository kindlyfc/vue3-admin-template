// import { Result } from 'ant-design-vue';
import { notFound, errorRoute } from './staticModules/error';
import { REDIRECT_ROUTE } from './staticModules/besidesLayout';
// import outsideLayout from './outsideLayout';
// import type { PermissionType } from '@/core/permission/modules/types';
import type { RouteRecordRaw } from 'vue-router';
// import RouterView from '@/layout/routerView/index.vue';
// import { isUrl } from '@/utils/is';
// import { uniqueSlash } from '@/utils/urlUtils';
// import { constantRouterComponents } from '@/router/asyncModules';
import common from '@/router/staticModules';
import { cloneDeep } from 'lodash-es';
import router, { routes } from '@/router';
// import NotFound from '@/views/error/404.vue';
// import IFramePage from '@/components/basic/iframe-page';
import { USER_MENU, USER_MENUARR } from '@/enums/cacheEnum';
import { Storage } from '@/utils/Storage';
// 需要放在所有路由之后的路由
const endRoutes: RouteRecordRaw[] = [REDIRECT_ROUTE, errorRoute, notFound];

//拍平路由及按钮权限
const getListMenus = (data) => {
  try {
    const menus: any = ['analyticalModel']; //统计分析默认都能看
    data.forEach((v) => {
      menus.push(v.permKey);
      if (!!v.children && v.children?.length > 0) {
        menus.push(...getListMenus(v.children));
      }
    });
    return menus;
  } catch (error) {
    console.error('生成路由时出错', error);
  }
};

//

/**
 * 过滤菜单
 * @param data 路由数据
 * @param menusArr 菜单权限列表
 * @returns 过来了权限后的菜单列表
 */
const filterMenus = (data, menusArr) => {
  try {
    const newCommon: any = [];
    data.forEach((v) => {
      // console.log('v.meta?.authority', v.meta?.authority);
      if (menusArr.includes(v.meta?.authority)) {
        if (!!v.children?.length) {
          v.children = filterMenus(v.children, menusArr);
        } else {
          newCommon.push(v);
        }

        if (!!v.children?.length) {
          newCommon.push(v);
        }
      }
    });
    return newCommon;
  } catch (error) {
    console.error('生成路由时出错', error);
  }
};

/**
 * 动态生成菜单
 * @param token
 * @returns {Promise<Router>}
 */
export const generatorDynamicRouter = () => {
  try {
    const U_MENU = Storage.get(USER_MENU);
    const ex = 7 * 24 * 60 * 60 * 1000;
    const menuArr = getListMenus(U_MENU);
    // const menuArr = U_MENU;
    /** 登录成功保存菜单 */
    Storage.set(USER_MENUARR, menuArr, ex);
    const layout = routes.find((item) => item.name == 'Layout')!;
    const commonMenus = cloneDeep(common);

    // console.log('菜单数据：', menuArr);

    const functionMenu = [...filterMenus(commonMenus, menuArr)].map((v) => {
      if (!!v.children && v.children?.length > 0) {
        v.redirect = `${v?.path}/${v?.children[0]?.path}`;
      }
      return v;
    });

    const menus = [...functionMenu, ...endRoutes];
    // const menus = commonMenus;

    layout.children = menus;
    layout.redirect = menus[0]?.redirect;

    // 重新添处理后的路由
    router.addRoute(layout);
    return Promise.resolve({
      menus,
      routes: layout.children,
    });
  } catch (error) {
    console.error('生成路由时出错', error);
    return Promise.reject(`生成路由时出错: ${error}`);
  }
};
