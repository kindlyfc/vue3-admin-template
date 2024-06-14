<template>
  <div>
    <a-tabs v-model:activeKey="activeKey" type="card">
      <a-tab-pane key="1" tab="通知公告">
        <Notification></Notification>
      </a-tab-pane>
      <a-tab-pane key="2" tab="消息模板">
        <Message></Message>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import Notification from './components/notification.vue';
  import Message from './components/message.vue';
  const activeKey = ref('1');
</script>

<style lang="less" scoped></style>
