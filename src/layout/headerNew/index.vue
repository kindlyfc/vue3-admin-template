<template>
  <Layout.Header class="layout-header">
    <div class="secondPath">
      <img
        :src="logoImageUrl"
        :alt="webTop?.titleName"
        :style="{
          height: logoImage?.height ? logoImage?.height + 'px' : '21px',
          width: logoImage?.width ? logoImage?.width + 'px' : '194px',
        }"
      />
      <!-- <div class="top-title">后台管理系统</div> -->
      <div class="second_content" :style="{ background: topBackground }">
        <div
          v-for="item in SecondPath"
          :key="item.path"
          :style="{
            marginRight: menuData?.moduleInterval ? menuData?.moduleInterval + 'px' : '10px',
            display: item?.meta?.hideInTabs ? 'none' : '',
            fontSize: menuData?.fontSize ? menuData?.fontSize + 'px' : '',
            backgroundImage:
              route.name === item?.name
                ? `linear-gradient( ${
                    menuData?.moduleChooseGradientType == 1 ? 'to bottom' : 'to right'
                  },${menuData?.moduleChooseStartColor || '#74b0e4'},${
                    menuData?.moduleChooseEndColor || '#3768ce'
                  })`
                : `linear-gradient( ${
                    menuData?.moduleGradientType == 1 ? 'to bottom' : 'to right'
                  },${menuData?.moduleStartColor || '#fff'},${menuData?.moduleEndColor || '#fff'})`,
          }"
          :class="{ active: route.name === item?.name }"
          @click="clickMenuItem(item?.name)"
          ><span
            :style="{
              backgroundImage:
                route.name === item?.name
                  ? ''
                  : `linear-gradient(${
                      menuData?.fontGradientType == 1 ? 'to bottom' : 'to right'
                    },${menuData?.fontStartColor || '#333'},${menuData?.fontEndColor || '#333'})`,
              WebkitBackgroundClip: route.name === item?.name ? '' : 'text',
              WebkitTextFillColor: route.name === item?.name ? '' : 'transparent',
            }"
            >{{ item?.meta?.title }}</span
          ></div
        >
      </div>
    </div>
    <div class="Bread_crumbs">
      <span
        :style="
          webTop?.gradient == 1
            ? `background-image:linear-gradient(${
                webTop?.gradientType == 1 ? 'to bottom' : 'to right'
              },${webTop?.startGradientColor || '#fff'},${webTop?.endGradientColor || '#fff'}); 
              -webkit-background-clip:text; 
              -webkit-text-fill-color:transparent;`
            : `color:${webTop?.startGradientColor || '#fff'};`
        "
      >
        {{ webTop?.titleName ? webTop?.titleName + '-' : '' }}{{ firstPathName || '' }}
        <span>{{ secondPathName || '' }}</span>
      </span></div
    >
  </Layout.Header>
</template>

<script lang="tsx" setup>
  import { computed, onBeforeMount, watch, ref } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import { Layout, type MenuTheme } from 'ant-design-vue';
  import { useUserStore } from '@/store/modules/user';
  import { useUiStore } from '@/store/modules/uiConfig';
  import { useKeepAliveStore } from '@/store/modules/keepAlive';
  import { LOGIN_NAME } from '@/router/constant';
  const uiStore = useUiStore();
  const menuData = computed(() => {
    return uiStore.systemModule2;
  });
  const webTop = computed(() => {
    return uiStore.systemNameConfig?.webTop;
  });
  const logoImageUrl = computed(() => {
    return import.meta.env.VITE_BASE_IMAGE_PATH + uiStore.systemLogoConfig?.webTop?.imageUrl;
  });
  const logoImage = computed(() => {
    return uiStore.systemLogoConfig?.webTop;
  });

  defineProps({
    collapsed: {
      type: Boolean,
    },
    theme: {
      type: String as PropType<MenuTheme>,
    },
  });

  const getBGcolor = (name) => {
    return computed(() => {
      const colorInfo = uiStore.customConfig.colorManageWeb.find((item) => item.name === name);
      if (colorInfo.isGradation) {
        return `linear-gradient(${colorInfo?.lrRotb}, ${colorInfo?.color[0].hex8}, ${colorInfo?.color[1].hex8})`;
      } else {
        return colorInfo?.color[0].hex8;
      }
    });
  };
  const topBackground = getBGcolor('中间顶部');

  const firstPathName = ref<any>();
  const secondPathName = ref<any>();
  const userStore = useUserStore();
  const keepAliveStore = useKeepAliveStore();
  // 当前路由
  const router = useRouter();
  const route = useRoute();

  const notNeedPath = ['/redirect', '/error', '/:pathMatch(.*)*']; //不用渲染的路由过滤
  const menus = computed(() => {
    return userStore.menus.filter((v) => {
      return !notNeedPath.includes(v.path);
    });
  });
  onBeforeMount(() => {
    initSecond();
  });
  const SecondPath = computed(() => userStore.childrenPath);

  //初始二级菜单
  const initSecond = () => {
    // userStore.setSecondPath(menus?.value?.[0]?.children);
    menus.value.forEach((v) => {
      v.children?.forEach((x) => {
        if (x.name === route.name) {
          userStore.setSecondPath(v.children);
        }
      });
    });
  };

  // 点击菜单
  const clickMenuItem = (name: string) => {
    if (route.name === name) return;
    router.push({ name });
  };

  // 跟随页面路由变化，切换面包屑
  watch(
    () => route.fullPath,
    () => {
      if (route.name === LOGIN_NAME) return;
      menus.value.forEach((v) => {
        v.children?.forEach((x) => {
          if (x.name === route.name) {
            firstPathName.value = `${v.meta?.title}>`;
            secondPathName.value = x.meta?.title;
          }
        });
      });
    },
    {
      immediate: true,
    },
  );
</script>

<style lang="less" scoped>
  .layout-header {
    position: sticky;
    top: 0;
    z-index: 10;
    // display: flex;
    // height: @header-height;
    height: auto;
    padding: 0 20px;
    // justify-content: space-between;
    background-color: #ffffff00 !important;
    // align-items: center;
    padding-top: 20px;

    * {
      cursor: pointer;
    }

    .secondPath {
      display: flex;
      align-items: center;

      .top-title {
        font-size: 22px;
        margin-right: 30px;
        font-weight: bold;
        background-image: linear-gradient(to bottom, #74b0e4 0%, #3768ce 100%) !important;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        display: inline-block;
      }

      > img {
        // width: 194px;
        // height: 21px;
        margin-right: 32px;
      }

      .second_content {
        flex: 1;
        height: 40px;
        border-radius: 20px;
        background-color: #fff;
        display: flex;
        padding: 0 36px;
        flex-wrap: nowrap;
        overflow-x: auto;
        box-shadow: 3px 3px 10px 1px rgba(69, 75, 81, 0.06);

        > div {
          padding: 0 24px;
          border-radius: 20px;
          font-size: 14px;
          font-family: PingFang SC-Bold, PingFang SC;
          font-weight: bold;
          color: #333333;
          line-height: 40px;
        }

        .active {
          // background: linear-gradient(0deg, #74b0e4 0%, #3768ce 100%) !important;
          color: #fff !important;
        }
      }
    }

    .Bread_crumbs {
      height: 36px;
      line-height: 36px;
      font-size: 12px;
      font-family: PingFang SC-Medium, PingFang SC;
      font-weight: 500;
      // color: #333333;

      // span {
      //   color: #5389d8;
      // }
    }
  }
</style>
