<template>
  <div class="sider-container">
    <div
      v-for="(item, index) in menus"
      :key="item.path"
      :class="{ Ch_bc: checkRouter(index) }"
      @click="clickMenuItem(item.name, item?.children)"
    >
      <a-tooltip placement="right" color="#659fd1">
        <template #title>
          <span>{{ item?.meta?.title }}</span>
        </template>
        <svg-icon :name="item?.meta?.icon" size="28"> </svg-icon>
      </a-tooltip>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, watch, ref } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { useUserStore } from '@/store/modules/user';
  import { LOGIN_NAME } from '@/router/constant';

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
    margin-top: 50px;
    overflow: auto;
    cursor: pointer;
    // background-color: #000;

    > div {
      text-align: center;
      width: 40px;
      height: 40px;
      border-radius: 6px;
      margin: 0 auto;
      margin-bottom: 3.1vh;
      line-height: 53px;
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
