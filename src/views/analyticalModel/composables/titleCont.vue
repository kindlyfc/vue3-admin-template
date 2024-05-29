<template>
  <div class="title_cont">
    <div class="flex-c">
      <div class="ZHTEXT">{{ props.ZHTEXT || '' }}</div>
      <div class="ENEXT">{{ props.ENEXT || '' }}</div>
    </div>
    <div class="more" v-if="props.isShowMore && $auth(props.role)" @click="more">更多>></div>
  </div>
</template>
<script lang="ts" setup>
  import router from '@/router';

  const props = defineProps({
    ZHTEXT: {
      type: String,
      default: '',
    },
    ENEXT: {
      type: String,
      default: '',
    },
    pageURL: {
      type: String,
      default: '',
    },
    isShowMore: {
      type: Boolean,
      default: true,
    },
    role: {
      type: String,
      default: '',
    },
  });

  const more = () => {
    if (props.pageURL) router.push({ name: props.pageURL });
  };
</script>

<style scoped>
  .title_cont {
    width: 428px;
    height: 42px;
    background: url('@/assets/images/dp/title.png') no-repeat !important;
    background-size: 100% 100% !important;
    background-position: 0 0;
    padding-left: 68px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .ZHTEXT {
    font-size: 19px;
    font-family: Source Han Sans CN;
    font-weight: 600;
    font-style: italic;
    color: #ffffff;
    text-shadow: 0px 2px 6px rgba(24, 118, 226, 0.938);
    margin-top: -4px;
  }

  .ENEXT {
    width: 110px;
    font-size: 14px;
    font-family: Source Han Sans CN;
    font-weight: 400;
    color: #f4f9ff;
    opacity: 0.7;
    margin-left: 12px;
  }

  .more {
    font-size: 14px;
    font-family: Source Han Sans CN;
    font-weight: 400;
    font-style: italic;
    color: #f4f9ff;
    opacity: 0.7;
    cursor: pointer;
  }
</style>
