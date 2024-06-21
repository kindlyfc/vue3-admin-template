<template>
  <!-- <v-scale-screen :width="innerWidth" :height="innerHeight"> -->
  <ConfigProvider :locale="getAntdLocale" :theme="theme" :transform-cell-text="transformCellText">
    <router-view #="{ Component }">
      <component :is="Component" />
    </router-view>
  </ConfigProvider>
  <!-- </v-scale-screen> -->
</template>

<script setup lang="ts">
  import { watchEffect, computed, nextTick } from 'vue';
  import { useRoute } from 'vue-router';
  import { ConfigProvider } from 'ant-design-vue';
  import { transformI18n } from './hooks/useI18n';
  import { useLocale } from '@/locales/useLocale';
  import { isEmpty } from '@/utils/common';
  import VScaleScreen from 'v-scale-screen';
  import { useUiStore } from '@/store/modules/uiConfig';

  const uiStore = useUiStore();
  const theme = uiStore.themeConfig;
  uiStore.getModule();
  uiStore.getSysLogo();
  uiStore.getSysName();
  uiStore.getItemList();
  uiStore.getColorConfigList();

  const webTop = computed(() => {
    return uiStore.systemNameConfig?.webTop;
  });

  const innerWidth = 1920;
  const innerHeight = 1080;
  const route = useRoute();
  const { getAntdLocale } = useLocale();

  watchEffect(() => {
    if (route.meta?.title) {
      // 翻译网页标题
      document.title = transformI18n((webTop.value?.titleName || '') + '-' + route.meta.title);
    } else {
      document.title = transformI18n(webTop.value?.titleName);
    }
  });

  /**
   * 表格数据过滤
   * @param row 表格行数据
   * @returns
   */
  const transformCellText = ({ text, column /* , record, index */ }) => {
    //   console.log('transformCellText', text);
    // console.log('表单：', column);

    if (Array.isArray(text)) {
      return !isEmpty(text[0]) ? text[0] : '--';
    } else {
      return !isEmpty(text) ? text : '--';
    }
  };
</script>

<style lang="less">
  .v-screen-box {
    background-color: #ffffff00 !important;
  }
</style>
WS
