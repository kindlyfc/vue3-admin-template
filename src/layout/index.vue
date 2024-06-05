<template>
  <Layout class="layout">
    <Layout.Sider
      v-if="themeStore.layout === 'sidemenu'"
      v-model:collapsed="collapsed"
      :width="asiderWidth"
      :trigger="null"
      collapsible
      :theme="getTheme"
      :style="{ background }"
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
  const background = computed(() => {
    const colorInfo = uiStore.customConfig.colorManageWeb.find(
      (item) => item.name === '左侧菜单栏',
    );
    if (colorInfo.isGradation) {
      return `linear-gradient(${colorInfo?.lrRotb}, ${colorInfo?.color[0].hex8}, ${colorInfo?.color[1].hex8})`;
    } else {
      return colorInfo?.color[0].hex8;
    }
  });
  const collapsed = ref<boolean>(false);
  // 自定义侧边栏菜单收缩和展开时的宽度
  // const asiderWidth = computed(() => (collapsed.value ? 80 : 220));
  const asiderWidth = computed(() => 70);

  const getTheme = computed(() => (themeStore.navTheme === 'light' ? 'light' : 'dark'));
</script>

<style lang="less" scoped>
  .layout {
    display: flex;
    height: 100vh;
    overflow: hidden;
    background-color: #9bc0f82a !important;

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
