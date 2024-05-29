<template>
  <div class="w100%! h100%! video_bg">
    <vue3VideoPlay
      width="100%"
      :height="props.height"
      :key="props.videoId"
      :src="options.src"
      :type="options.type"
      :autoPlay="true"
      @play="onPlay"
      @pause="onPause"
      @timeupdate="onTimeupdate"
      @canplay="onCanplay"
    />
  </div>
</template>

<script setup lang="ts">
  import { onUnmounted, reactive, watchEffect } from 'vue';
  import { cameraClose } from '@/api/common';

  const props = defineProps({
    videoId: {
      //播放器id 页面多播放器必传
      type: String,
      required: true,
      defauit: 'container',
    },
    height: {
      //当为true的时候：视频画面做等比缩放后,高或宽对齐canvas区域,画面不被拉伸,但有黑边。
      type: String,
      required: false,
      defauit: '450px',
    },
    videoUrl: {
      // 播放地址
      type: String,
      required: true,
      defauit: '',
    },
  });
  const options = reactive<any>({});
  watchEffect(() => {
    if (props.videoUrl) {
      Object.assign(options, {
        src: props.videoUrl, //视频源
        poster: '', //封面
        type: 'm3u8', //视频类型
      });
    }
  });
  const onPlay = (ev) => {
    // console.log('播放');
  };
  const onPause = (ev) => {
    // console.log(ev, '暂停');
  };

  const onTimeupdate = (ev) => {
    // console.log(ev, '时间更新');
  };
  const onCanplay = (ev) => {
    // console.log(ev, '可以播放');
  };
</script>

<style lang="less" scoped>
  :deep(.d-control-progress),
  :deep(.speedRate-btn),
  :deep(.volume-btn),
  :deep(.quality-btn),
  :deep(.icon-pip),
  :deep(.setting-btn),
  :deep(.icon-web-screen) {
    display: none !important;
  }

  .video_bg {
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
