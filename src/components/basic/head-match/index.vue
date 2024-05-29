<template>
  <a-upload
    name="avatar"
    list-type="picture-card"
    class="avatar-uploader"
    :show-upload-list="false"
    :before-upload="beforeUpload"
    @change="handleChange"
  >
    <img v-if="imageUrl" :src="imageUrl" alt="avatar" class="defaultimg" />
    <div v-else v-on:loading="loading">
      <img :src="chooseUrl" class="defaultimg" />
      <div class="ant-upload-text"> 选择照片 </div>
    </div>
  </a-upload>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { message } from 'ant-design-vue';
  import chooseUrl from '@/assets/images/chooseUrl.png';
  const imageUrl = ref<any>();
  const loading = ref<boolean>(false);

  // const props = defineProps({});

  const emit = defineEmits(['update:value']);

  function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }
  const beforeUpload = (file: any) => {
    const isJpgOrPng =
      file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg';
    if (!isJpgOrPng) {
      // message.error('仅支持jpg,jpeg,png格式');
    }
    const isLt2M = file.size / 1024 / 1024 < 5;
    if (!isLt2M) {
      // message.error('图片大小请不超过5MB');
    }
    return isJpgOrPng && isLt2M;
  };

  const handleChange = (info) => {
    if (info.file.status === 'uploading') {
      loading.value = true;
      return;
    }
    getBase64(info.file.originFileObj, (Url: any) => {
      imageUrl.value = Url;
      loading.value = false;
      const value = Url.split(',')[1];
      emit('update:value', value);
    });
  };

  defineExpose({
    imageUrl,
  });
</script>
<style lang="less" scoped>
  .defaultimg {
    width: 72px;
    height: 72px;
    border-radius: 50% !important;
  }

  .avatar-uploader {
    width: 72px !important;
    height: 72px !important;
    border-radius: 50% !important;
    margin-right: 30px;
  }

  .avatar-uploader > .ant-upload {
    width: 72px !important;
    height: 72px !important;
    border-radius: 50% !important;
  }

  :deep(.ant-upload-select-picture-card) {
    background-color: #ffffff00 !important;
    width: 72px !important;
    height: 72px !important;
    border-radius: 50% !important;
    margin: 0 !important;
    padding: 0 !important;
    border: none !important;
    position: relative;
  }

  .ant-upload-select-picture-card .ant-upload-text {
    font-size: 12px;
    font-family: PingFang SC-Regular, PingFang SC;
    font-weight: 400;
    color: #333333;
    width: 100%;
    text-align: center;
    position: absolute;
    top: 28px;
  }
</style>
