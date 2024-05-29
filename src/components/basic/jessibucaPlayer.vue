<template>
  <div :id="props.videoId" class="w100%! h100%! video_bg"></div>
</template>

<script lang="ts" setup>
  import { ref, onMounted, watchEffect, nextTick } from 'vue';
  const jessibuca = ref<any>('');
  const props = defineProps({
    videoId: {
      //播放器id 页面多播放器必传
      type: String,
      required: true,
      defauit: 'container',
    },
    isResize: {
      //当为true的时候：视频画面做等比缩放后,高或宽对齐canvas区域,画面不被拉伸,但有黑边。
      type: Boolean,
      required: false,
      defauit: false,
    },
    isFullResize: {
      //当为true的时候：视频画面做等比缩放后,完全填充canvas区域,画面不被拉伸,没有黑边,但画面显示不全
      type: Boolean,
      required: false,
      defauit: false,
    },
    background: {
      // 背景图片
      type: String,
      required: false,
      defauit: '',
    },
    videoUrl: {
      // 播放地址
      type: String,
      required: true,
      defauit: '',
    },
  });
  // const emit = defineEmits(['update:value']);

  onMounted(() => {
    nextTick(() => {
      init();
    });
  });

  const init = () => {
    // @ts-ignore
    jessibuca.value = new Jessibuca({
      //详细配置请参考//https://jessibuca.com/api.html
      container: document.getElementById(props.videoId),
      videoBuffer: 0, // 缓存时长
      isResize: props.isResize,
      isFullResize: props.isFullResize,
      text: '',
      loadingText: '加载中',
      debug: true,
      background: props.background,
      decoder: '/decoder.js',
      hiddenAutoPause: true,
      // hasAudio: false,
      showBandwidth: true, // 显示网速
      operateBtns: {
        fullscreen: true,
        screenshot: true,
        play: true,
        audio: true,
        record: true,
      },
      forceNoOffscreen: true,
      isNotMute: false,
      heartTimeout: 100,
    });
  };

  watchEffect(() => {
    if (props.videoUrl && jessibuca.value) {
      console.log(props.videoUrl, 99);
      jessibuca.value.play(props.videoUrl);
    }
    // if (jessibuca.value)
    //   jessibuca.value.play('ws://110.185.187.158:8547/stream?url=511234200100000219');
  });

  defineExpose({});
</script>
<style lang="less" scoped>
  .video_bg {
    background-color: #222424;
  }
</style>
