<template>
  <Layout class="layout" :style="{ background: layoutBackground }">
    <Layout.Sider
      v-if="themeStore.layout === 'sidemenu'"
      v-model:collapsed="collapsed"
      :width="asiderWidth"
      :trigger="null"
      collapsible
      :theme="getTheme"
      :style="{ background: sideBackground }"
    >
      <avatar />
      <asiderList />
      <loginOut />
    </Layout.Sider>
    <Layout>
      <PageHeader />
      <Layout.Content class="layout-content">
        <tabs-view />
      </Layout.Content>
    </Layout>
  </Layout>
</template>

<script lang="ts" setup>
  import { ref, computed, watch } from 'vue';
  import { Layout } from 'ant-design-vue';
  import { useUiStore } from '@/store/modules/uiConfig';
  // import Logo from './logo/index.vue';
  //@ts-ignore
  import avatar from './avatar/index.vue';
  //@ts-ignore
  import loginOut from './loginOut/index.vue';
  import { TabsView } from './tabs';
  // import AsideMenu from './menu/menu.vue';
  //@ts-ignore
  import asiderList from './asiderList/index.vue';
  //@ts-ignore
  import PageHeader from './headerNew/index.vue';
  // import PageFooter from './footer';
  import { useThemeStore } from '@/store/modules/projectConfig';

  const themeStore = useThemeStore();
  const uiStore = useUiStore();

  const getBGcolor = (name) => {
    return computed(() => {
      const colorInfo = uiStore.customConfig.colorManageWeb.find((item) => item.name === name);
      if (colorInfo?.gradation) {
        return `linear-gradient(${colorInfo?.irRotb}, ${colorInfo?.color[0].hex8}, ${colorInfo?.color[1].hex8})`;
      } else {
        return colorInfo?.color[0].hex8;
      }
    });
  };

  const sideBackground = getBGcolor('左侧菜单栏');
  const layoutBackground = getBGcolor('中间主题背景');

  const collapsed = ref<boolean>(false);
  // 自定义侧边栏菜单收缩和展开时的宽度
  // const asiderWidth = computed(() => (collapsed.value ? 80 : 220));
  const asiderWidth = computed(() => 105);

  const getTheme = computed(() => (themeStore.navTheme === 'light' ? 'light' : 'dark'));
</script>

<style lang="less" scoped>
  .layout {
    display: flex;
    height: 100vh;
    overflow: hidden;

    .ant-layout {
      overflow: hidden;
      background: none !important;
    }

    .layout-content {
      flex: none;
    }
  }

  .ant-layout-sider {
    position: relative;
    border-radius: 0 30px 30px 0;
  }
</style>
