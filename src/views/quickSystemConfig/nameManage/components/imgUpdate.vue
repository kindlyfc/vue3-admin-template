<template>
  <div>
    <a-upload
      class="avatar-uploader"
      :disabled="defaultFileList.length >= props.limit || imageUrl.length >= props.limit"
      :before-upload="beforeUpload"
      :default-file-list="defaultFileList"
      @change="handleChange"
      action="/api/v1/common/upload"
      name="file"
      :headers="headers"
      accept=".jpg,.jpeg,.png"
    >
      <div v-loading="loading" class="img_item defaultimg">
        <img
          :src="props.limit == 1 && imageUrl.length > 0 ? imageUrl : chooseUrl"
          class="defaultimg"
        />
        <div class="men" v-if="imageUrl.length > 0">
          <svg-icon
            style="color: #fff"
            name="big"
            size="24"
            class="mr10px"
            @click="previewImg(imageUrl[0])"
          ></svg-icon>
          <svg-icon style="color: #fff" name="delet" size="24" @click="deletImage(0)"></svg-icon>
        </div>
        <div class="ant-upload-text" v-if="imageUrl.length === 0"> 点击上传图片 </div>
      </div>
    </a-upload>
    <div class="tips" v-if="props.tipsText">
      <img src="@/assets/images/tost.png" alt="" />{{
        props.tipsText || '最多上传三张照片(只支持JPG、 JPEG、PNG,大小不超过5M)'
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

    <a-modal
      :width="980"
      :visible="previewVisible"
      class="avatarContent"
      :footer="null"
      @cancel="previewVisible = false"
    >
      <img alt="example" style="width: 100%" :src="previewImage" />
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
  import { ref, onMounted } from 'vue';
  import { message } from 'ant-design-vue';
  import chooseUrl from '@/assets/images/update.png';
  import { upDateFile } from '@/api/uiConfig';
  import { Storage } from '@/utils/Storage';
  import { ACCESS_TOKEN_KEY } from '@/enums/cacheEnum';
  const imageUrl = ref<any>([]);
  const loading = ref<boolean>(false);
  const previewVisible = ref<boolean>(false);
  const defaultFileList = ref<any>([]);
  const files = ref<any>([]);
  const previewImage = ref<any>('');
  const token = Storage.get(ACCESS_TOKEN_KEY);
  const headers = ref({
    Authorization: `Bearer ${token}`,
  });
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
      default: 1,
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
      default: true,
    },
  });
  onMounted(() => {
    if (props.echoList?.length > 0 && props.echoList[0]) {
      imageUrl.value.push(...props.echoList);
      if (props.prohibitBase64) {
        files.value.push(...props.echoList);
      }
    } else {
      files.value = [];
      imageUrl.value = [];
      defaultFileList.value = [];
    }
  });

  const emit = defineEmits(['update:value', 'deleteImage']);

  function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }
  const beforeUpload = (file: any) => {
    if (defaultFileList.value.length >= props.limit) {
      message.error('最多上传三张');
      return false;
    }
    const isJpgOrPng =
      file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg';
    if (!isJpgOrPng) {
      message.error('仅支持jpg,jpeg,png格式');
    }
    const isLt2M = file.size / 1024 / 1024 < 5;
    if (!isLt2M) {
      message.error('图片大小请不超过5MB');
    }
    defaultFileList.value.push(file);
    return isJpgOrPng && isLt2M;
  };

  const handleChange = (info) => {
    console.log(info, 888);
    if (info.file.status === 'uploading') {
      loading.value = true;
      return;
    }

    if (props.prohibitBase64) {
      const windowURL: any = window?.url || window.webkitURL;
      const dataImgurl = windowURL.createObjectURL(info.file.originFileObj);
      files.value.push(info.file.originFileObj);
      imageUrl.value.push(dataImgurl);
      if (props.limit == 1) {
        emit('update:value', info.file.response.data?.fileUrl);
        return;
      }
      emit('update:value', info.file.response.data);
      loading.value = false;
      return;
    }

    getBase64(info.file.originFileObj, (Url: any) => {
      imageUrl.value.push(Url);
      loading.value = false;
      let arrUrls: any = [];
      for (let i = 0; i < imageUrl.value.length; i++) {
        const v = imageUrl.value[i];
        arrUrls.push(v);
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
    if (props.prohibitBase64) {
      files.value.splice(index, 1);
    }
    defaultFileList.value.splice(index, 1);
    emit('deleteImage');
  };

  defineExpose({
    imageUrl,
  });
</script>
<style lang="less" scoped>
  .defaultimg {
    width: 240px !important;
    height: 164px !important;
    border-radius: 10px;
  }

  .avatar-uploader {
    display: block;
    width: 240px !important;
    min-height: 164px !important;
    margin-left: 40px;
    position: relative;
  }

  .avatar-uploader > .ant-upload {
    width: 240px !important;
    height: 164px !important;
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
    top: 120px;
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
    color: #1890ff;
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
<style lang="less">
  .avatarContent .ant-modal-close-x {
    font-size: 18px !important;
    color: #000 !important;
    line-height: -6px !important;
    margin-top: -22px;
    margin-right: -26px;
  }
</style>
