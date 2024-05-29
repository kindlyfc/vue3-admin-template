<template>
  <div class="zhuxiao" @click="doLogout">
    <svg-icon name="zhuxiao" size="28"> </svg-icon>
  </div>
</template>

<script setup>
  import { nextTick } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import { useKeepAliveStore } from '@/store/modules/keepAlive';
  import { useUserStore } from '@/store/modules/user';
  import { LOGIN_NAME } from '@/router/constant';
  import { Modal, message } from 'ant-design-vue';
  const keepAliveStore = useKeepAliveStore();

  const userStore = useUserStore();
  const router = useRouter();
  const route = useRoute();
  // 退出登录
  const doLogout = () => {
    Modal.confirm({
      title: '您确定要退出登录吗？',
      centered: true,
      onOk: async () => {
        // 移除标签页
        keepAliveStore.clear();
        localStorage.clear();
        message.success('成功退出登录');
        await nextTick();
        router.replace({
          name: LOGIN_NAME,
          query: {
            redirect: route.fullPath,
          },
        });

        userStore.logout();
      },
    });
  };
</script>

<style lang="less" scoped>
  .zhuxiao {
    width: 40px;
    height: 40px;
    border-radius: 6px;
    position: absolute;
    bottom: 6vh;
    text-align: center;
    left: -20px;
    margin-left: 50%;
    line-height: 53px;
    cursor: pointer;
  }

  .zhuxiao:hover {
    background-color: #ffffff69 !important;
  }
</style>
