<template>
  <div class="sider-container">
    <div
      v-for="(item, index) in menus"
      :key="item.path"
      :style="
        (!checkRouter(index)
          ? ''
          : modulesData?.moduleChooseGradient == 1
          ? `background-image: linear-gradient( ${
              modulesData?.moduleChooseGradientType == 1 ? 'to bottom' : 'to right'
            },${modulesData?.moduleChooseStartColor || '#ffffff69'},${
              modulesData?.moduleChooseEndColor || '#ffffff69'
            });`
          : `background:${modulesData?.moduleChooseStartColor || '#ffffff69'};`) +
        `margin-bottom:${
          modulesData?.moduleInterval ? modulesData?.moduleInterval + 'px' : 'margin-bottom: 2.5vh;'
        }`
      "
      @click="clickMenuItem(item.name, item?.children)"
    >
      <!-- <a-tooltip placement="right" color="#659fd1">
        <template #title>
          <span>{{ item?.meta?.title }}</span>
        </template> -->
      <svg-icon
        :name="item?.meta?.icon || ''"
        size="28"
        :color="
          modulesData?.moduleGradient == 1
            ? ` background-image:linear-gradient(${
                modulesData?.moduleGradientType == 1 ? 'to bottom' : 'to right'
              },${modulesData?.moduleStartColor || '#fff'},${
                modulesData?.moduleEndColor || '#fff'
              }); 
              -webkit-background-clip:text; 
              -webkit-text-fill-color:transparent;`
            : `${modulesData?.moduleStartColor || '#fff'}`
        "
      >
      </svg-icon>
      <div
        class="text_sty"
        :style="
          (modulesData?.fontGradient == 1
            ? ` background-image:linear-gradient(${
                modulesData?.fontGradientType == 1 ? 'to bottom' : 'to right'
              },${modulesData?.fontStartColor || '#fff'},${modulesData?.fontEndColor || '#fff'}); 
              -webkit-background-clip:text; 
              -webkit-text-fill-color:transparent;`
            : `color:${modulesData?.fontStartColor || '#fff'};`) +
          `font-size:${modulesData?.fontSize ? modulesData?.fontSize + 'px' : ''}`
        "
        >{{ item?.meta?.title }}</div
      >
      <!-- </a-tooltip> -->
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, watch, ref } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { useUserStore } from '@/store/modules/user';
  import { LOGIN_NAME } from '@/router/constant';
  import { useUiStore } from '@/store/modules/uiConfig';
  const uiStore = useUiStore();
  const modulesData = computed(() => {
    return uiStore.systemModule1;
  });
  const chooseName = ref<any>('');
  const userStore = useUserStore();
  // 当前路由
  const currentRoute = useRoute();

  const router = useRouter();
  const notNeedPath = ['/redirect', '/error', '/:pathMatch(.*)*']; //不用渲染的路由过滤
  const menus = computed(() => {
    return userStore.menus.filter((v) => {
      return !notNeedPath.includes(v.path);
    });
  });

  //判断是那个一级菜单
  const checkRouter = (index: number) => {
    const data: any = menus.value[index];
    if (data?.children?.length > 0) {
      const childItem = data.children.map((v) => {
        return v.name;
      });
      return childItem.includes(chooseName.value);
    } else {
      return data?.name === chooseName.value;
    }
  };

  // 跟随页面路由变化，切换菜单选中状态
  watch(
    () => currentRoute.fullPath,
    () => {
      if (currentRoute.name === LOGIN_NAME) return;
      chooseName.value = currentRoute.name;
    },
    {
      immediate: true,
    },
  );

  // 点击菜单
  const clickMenuItem = (name, children) => {
    if (name === currentRoute.name) return;
    if (!children || !children.length) return;
    console.log(children);
    userStore.setSecondPath(children);
    router.push({ name });
  };
</script>

<style lang="less" scoped>
  .sider-container {
    min-height: 40vh;
    max-height: calc(100vh - 280px);
    margin-top: 50px;
    overflow: auto;
    cursor: pointer;
    overflow-y: scroll;
    // background-color: #000;

    > div {
      text-align: center;
      width: 95px;
      border-radius: 6px;
      margin: 0 auto;
      padding: 5px 0 5px 0;

      .text_sty {
        margin-top: 3px;
        text-align: center !important;
        width: 100%;
        font-weight: 550;
      }
    }

    &::-webkit-scrollbar {
      width: 0;
      height: 0;
    }
  }

  .Ch_bc {
    background-color: #ffffff69 !important;
  }

  // :deep(use) {
  // border-color: none !important;
  // background-color: none !important;
  // }
</style>
