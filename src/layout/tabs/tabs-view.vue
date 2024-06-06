<template>
  <div class="tabs-view">
    <router-view v-slot="{ Component }" class="tabs-view-content">
      <template v-if="Component">
        <keep-alive>
          <component :is="Component" v-if="$route.meta.keepAlive" />
        </keep-alive>
        <component :is="Component" v-if="!$route.meta.keepAlive" />
      </template>
    </router-view>
  </div>
</template>

<script setup lang="ts">
  import { computed, watch } from 'vue';
  import { useRoute } from 'vue-router';

  import type { RouteLocation } from 'vue-router';
  import { Storage } from '@/utils/Storage';
  import { TABS_ROUTES } from '@/enums/cacheEnum';
  import { useTabsViewStore, blackList } from '@/store/modules/tabsView';
  import { useKeepAliveStore } from '@/store/modules/keepAlive';

  type RouteItem = Omit<RouteLocation, 'matched' | 'redirectedFrom'>;

  const route = useRoute();
  const tabsViewStore = useTabsViewStore();
  const keepAliveStore = useKeepAliveStore();
  // 标签页列表
  const tabsList = computed(() => tabsViewStore.getTabsList);

  // 缓存的路由组件列表
  const keepAliveComponents = computed(() => keepAliveStore.list);

  // 获取简易的路由对象
  const getSimpleRoute = (route): RouteItem => {
    const { fullPath, hash, meta, name, params, path, query } = route;
    return { fullPath, hash, meta, name, params, path, query };
  };

  let routes: RouteItem[] = [];

  try {
    const routesStr = Storage.get(TABS_ROUTES) as string | null | undefined;
    routes = routesStr ? JSON.parse(routesStr) : [getSimpleRoute(route)];
  } catch (e) {
    routes = [getSimpleRoute(route)];
  }

  // 初始化标签页
  tabsViewStore.initTabs(routes);

  // tabsViewMutations.initTabs(routes)

  watch(
    () => route.fullPath,
    () => {
      if (blackList.some((n) => n === route.name)) return;
      // tabsViewMutations.addTabs(getSimpleRoute(route))
      tabsViewStore.addTabs(getSimpleRoute(route));
    },
    { immediate: true },
  );

  // 在页面关闭或刷新之前，保存数据
  window.addEventListener('beforeunload', () => {
    Storage.set(TABS_ROUTES, JSON.stringify(tabsList.value));
  });

  // // 目标路由是否等于当前路由
  // const isCurrentRoute = (route) => {
  //   return router.currentRoute.value.matched.some((item) => item.name === route.name);
  // };

  // // 关闭当前页面
  // const removeTab = (route) => {
  //   if (tabsList.value.length === 1) {
  //     return message.warning('这已经是最后一页，不能再关闭了！');
  //   }
  //   // tabsViewMutations.closeCurrentTabs(route)
  //   tabsViewStore.closeCurrentTab(route);
  // };
  // tabs 编辑（remove || add）
  // const editTabItem = (targetKey, action: string) => {
  //   if (action == 'remove') {
  //     removeTab(tabsList.value.find((item) => item.fullPath == targetKey));
  //   }
  // };
  // // 切换页面
  // const changePage = (key) => {
  //   Object.is(route.fullPath, key) || router.push(key);
  // };

  // // 刷新页面
  // const reloadPage = () => {
  //   router.replace({
  //     name: REDIRECT_NAME,
  //     params: {
  //       path: unref(route).fullPath,
  //     },
  //   });
  // };

  // // 关闭左侧
  // const closeLeft = (route) => {
  //   // tabsViewMutations.closeLeftTabs(route)
  //   tabsViewStore.closeLeftTabs(route);
  //   !isCurrentRoute(route) && router.replace(route.fullPath);
  // };

  // // 关闭右侧
  // const closeRight = (route) => {
  //   // tabsViewMutations.closeRightTabs(route)
  //   tabsViewStore.closeRightTabs(route);
  //   !isCurrentRoute(route) && router.replace(route.fullPath);
  // };

  // // 关闭其他
  // const closeOther = (route) => {
  //   // tabsViewMutations.closeOtherTabs(route)
  //   tabsViewStore.closeOtherTabs(route);
  //   !isCurrentRoute(route) && router.replace(route.fullPath);
  // };

  // // 关闭全部
  // const closeAll = () => {
  //   localStorage.removeItem('routes');
  //   // tabsViewMutations.closeAllTabs()
  //   tabsViewStore.closeAllTabs();
  //   router.replace('/');
  // };
</script>

<style lang="less" scoped>
  .dark .tabs-view {
    border-top: 1px solid black;
  }

  .tabs-view {
    // border-top: 1px solid #eee;
    padding: 10px 20px;

    :deep(.tabs) {
      .ant-tabs-nav {
        @apply bg-white dark:bg-black;
        padding: 4px 20px 0 10px;
        margin: 0;
        user-select: none;
      }

      .ant-tabs-tabpane {
        display: none;
      }

      .ant-tabs-tab-remove {
        display: flex;
        padding: 0;
        margin: 0;

        .anticon-close {
          padding-left: 6px;
        }
      }

      .ant-tabs-tab:not(.ant-tabs-tab-active) {
        .ant-tabs-tab-remove {
          width: 0;
        }

        .anticon-close {
          width: 0;
          visibility: hidden;
          transition: width 0.3s;
        }

        &:hover {
          .anticon-close {
            width: 16px;
            visibility: visible;
            padding-left: 6px;
          }

          .ant-tabs-tab-remove {
            width: unset;
          }
        }
      }
    }

    .tabs-view-content {
      /* height: calc(100vh - #{$header-height}); */
      height: calc(100vh - 130px);
      padding: 20px 20px 0;
      overflow-y: scroll;
      background: #fff;

      &::-webkit-scrollbar {
        width: 0px !important;
      }
    }
  }
</style>
