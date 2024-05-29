<template>
  <div>
    <a-upload
      name="avatar"
      class="avatar-uploader"
      :disabled="defaultFileList.length >= props.limit || imageUrl.length >= props.limit"
      :before-upload="beforeUpload"
      :default-file-list="defaultFileList"
      @change="handleChange"
    >
      <div v-loading="loading" class="img_item defaultimg">
        <img
          :src="props.limit == 1 && imageUrl.length > 0 ? imageUrl : chooseUrl"
          class="defaultimg"
        />
        <div class="men" v-if="imageUrl.length > 0">
          <svg-icon name="big" size="24" class="mr10px" @click="previewImg(imageUrl[0])"></svg-icon>
          <svg-icon name="delet" size="24" @click="deletImage(0)"></svg-icon>
        </div>
        <div class="ant-upload-text" v-if="imageUrl.length === 0"> 点击上传图片 </div>
      </div>
    </a-upload>
    <div class="tips" v-if="props.tipsText">
      <img src="@/assets/images/tost.png" alt="" />{{
        props.tipsText || '最多上传三张照片（只支持JPG、 JPEG、PNG,大小不超过5M'
      }}
    </div>
    <div v-if="imageUrl.length > 0 && props.limit > 1" class="flex justify-between flex-wrap">
      <div class="img_item" v-for="(item, index) in imageUrl" :key="index">
        <img :src="item" alt="" />
        <div class="men">
          <svg-icon name="big" size="24" class="mr10px" @click="previewImg(item)"></svg-icon>
          <svg-icon name="delet" size="24" @click="deletImage(index)"></svg-icon>
        </div>
      </div>
    </div>

    <a-modal :visible="previewVisible" :footer="null" @cancel="previewVisible = false">
      <img alt="example" style="width: 100%" :src="previewImage" />
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
  import { ref, onMounted } from 'vue';
  import { message } from 'ant-design-vue';
  import chooseUrl from '@/assets/images/avatar.png';
  const imageUrl = ref<any>([]);
  const loading = ref<boolean>(false);
  const previewVisible = ref<boolean>(false);
  const defaultFileList = ref<any>([]);
  const files = ref<any>([]);
  const previewImage = ref<any>('');
  const props = defineProps({
    tipsText: {
      //文本
      type: String,
      required: true,
      default: '',
    },
    limit: {
      //上传限制
      type: Number,
      required: false,
      default: 3,
    },
    echoList: {
      //回显图片
      type: Array,
      required: false,
      default: () => [],
    },
    prohibitBase64: {
      //禁止使用base64格式，使用file格式
      type: Boolean,
      required: false,
      default: false,
    },
  });
  onMounted(() => {
    if (props.echoList?.length > 0 && props.echoList[0]) {
      imageUrl.value.push(...props.echoList);
      if (props.prohibitBase64) {
        files.value.push(...props.echoList);
      }
    }
  });

  const emit = defineEmits(['update:value']);

  function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }
  const beforeUpload = (file: any) => {
    if (defaultFileList.value.length >= props.limit) {
      // message.error('最多上传三张');
      return false;
    }
    const isJpgOrPng =
      file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg';
    if (!isJpgOrPng) {
      // message.error('仅支持jpg,jpeg,png格式');
    }
    const isLt2M = file.size / 1024 / 1024 < 5;
    if (!isLt2M) {
      // message.error('图片大小请不超过5MB');
    }
    defaultFileList.value.push(file);
    return isJpgOrPng && isLt2M;
  };

  const handleChange = (info) => {
    if (info.file.status === 'uploading') {
      loading.value = true;
      return;
    }

    if (props.prohibitBase64) {
      const windowURL: any = window.url || window.webkitURL;
      const dataimgurl = windowURL.createObjectURL(info.file.originFileObj);
      files.value.push(info.file.originFileObj);
      imageUrl.value.push(dataimgurl);
      emit('update:value', files);
      return;
    }

    getBase64(info.file.originFileObj, (Url: any) => {
      imageUrl.value.push(Url);
      loading.value = false;
      let arrUrls: any = [];
      for (let i = 0; i < imageUrl.value.length; i++) {
        const v = imageUrl.value[i];
        arrUrls.push(v);
        // if (v.includes('http')) {
        //   arrUrls.push(v);
        // } else {
        //   arrUrls.push(v.split(',')[1]);
        // }
      }

      emit('update:value', arrUrls);
    });
  };

  const previewImg = (item) => {
    previewImage.value = item;
    previewVisible.value = true;
  };
  const deletImage = (index) => {
    imageUrl.value.splice(index, 1);
    defaultFileList.value.splice(index, 1);
    if (props.prohibitBase64) {
      files.value.splice(index, 1);
      emit('update:value', files.value);
      return;
    }
    emit('update:value', imageUrl.value);
  };

  defineExpose({
    imageUrl,
  });
</script>
<style lang="less" scoped>
  .defaultimg {
    width: 160px !important;
    height: 200px !important;
    border-radius: 10px;
  }

  .avatar-uploader {
    display: block;
    width: 160px !important;
    min-height: 200px !important;
    margin-left: 40px;
    margin-top: 60px;
    position: relative;
  }

  .avatar-uploader > .ant-upload {
    width: 160px !important;
    height: 200px !important;
  }

  :deep(.ant-upload-list) {
    display: none !important;
  }

  .ant-upload-text {
    font-size: 14px;
    font-family: PingFang SC-Bold, PingFang SC;
    font-weight: bold;
    color: #333333;
    width: 100%;
    text-align: center;
    position: absolute;
    top: 90px;
  }

  .img_item {
    width: 110px;
    height: 140px;
    margin-top: 10px;
    position: relative;

    img {
      width: 100%;
      height: 100%;
    }

    .men {
      opacity: 0;
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background-color: #00000049;
      z-index: 1000;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer !important;
    }
  }

  .img_item:hover .men {
    opacity: 1;
  }

  .tips {
    font-size: 12px;
    font-family: PingFang SC-Regular, PingFang SC;
    font-weight: 400;
    color: #5389d8;
    padding-top: 20px;
    // padding: 0 30px;
    padding-left: 40px;
    // text-align: right;

    img {
      width: 16px;
      height: 16rpx;
      vertical-align: top;
    }
  }
</style>
