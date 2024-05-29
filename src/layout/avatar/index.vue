<template>
  <div class="avatar">
    <Avatar class="userhead" :src="userInfo?.headImg || defaultHead" :alt="userInfo?.name"></Avatar>
    <div class="username">{{ userInfo?.name || '管理员' }}</div>
  </div>
</template>

<script setup>
  import { computed } from 'vue';
  import { Avatar } from 'ant-design-vue';
  import { USER__INFO } from '@/enums/cacheEnum';
  import { Storage } from '@/utils/Storage';
  import defaultHead from '@/assets/images/defaultHead.png';
  const userInfo = computed(() => Storage.get(USER__INFO));
  defineProps({
    collapsed: {
      type: Boolean,
    },
  });
</script>

<style lang="less" scoped>
  .avatar {
    text-align: center;
    margin-top: 5vh;

    .userhead {
      width: 40px;
      height: 40px;
    }

    .username {
      margin-top: 8px;
      font-size: 12px;
      font-family: PingFang SC-Medium, PingFang SC;
      font-weight: 500;
      color: #ffffff;
    }
  }
</style>
