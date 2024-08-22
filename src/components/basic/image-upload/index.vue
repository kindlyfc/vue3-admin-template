<template>
  <div class="flex flex-col">
    <a-upload
      v-bind="{ ...$attrs, ...props }"
      :list-type="props.listType"
      accept="image/png,image/jpeg"
      :file-list="fileList"
      :custom-request="customRequest"
      :max-count="props.limit"
      :disabled="props.disabled"
      @preview="handlePreview"
      @remove="removeHandle"
    >
      <div v-if="(fileList || []).length < props.limit" class="upload-btn">
        <svg-icon name="upload" size="20" color="#5389D8"></svg-icon>
      </div>

      <template v-if="props.disabled" #removeIcon></template>
    </a-upload>

    <!-- 提示 S -->
    <div v-if="props.showTip && (fileList || []).length < props.limit" mt-10px>
      <a-tag color="#FFE6B2">
        <template #icon>
          <info-circle-filled color="#FFAA00" />
        </template>
        <span class="text-#333333">支持JPG、JPEG、PNG, 大小不超过5M</span>
      </a-tag>
    </div>
    <!-- 提示 E -->

    <!-- 调用摄像头拍照 -->
    <a-button type="link" @click="cameraVisible = true">摄像头拍照</a-button>
    <CameraPhotography :show-modal="cameraVisible" @complate="getCameraImage"></CameraPhotography>

    <!-- 图片预览弹窗 S -->
    <!-- <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
      <img alt="example" style="width: 100%" :src="previewImage" />
    </a-modal> -->
    <a-image
      :style="{ display: 'none' }"
      :preview="{
        visible: previewVisible,
        onVisibleChange: setPreviewImageVisible,
      }"
      :src="previewImage"
    />
    <!-- 图片预览弹窗 E -->
  </div>
</template>

<script setup lang="ts">
  import { ref, watch } from 'vue';
  import { InfoCircleFilled } from '@ant-design/icons-vue';
  import { uploadProps } from 'ant-design-vue/es/upload/interface';
  import { message, UploadProps } from 'ant-design-vue';
  import { arrayIsSame } from '../../../utils/common';
  import CameraPhotography from '../camera-photography/camera-photography.vue';

  // 图片预览
  const setPreviewImageVisible = (value): void => {
    previewVisible.value = value;
  };

  const previewVisible = ref(false);
  const previewImage = ref('');

  const props = defineProps({
    ...uploadProps(),
    value: {
      type: Array,
      default: () => [],
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    limit: { type: Number, default: 1 },
    showTip: {
      type: Boolean,
      default: false,
    },
    listType: {
      type: String,
      default: 'picture-card',
    },
    noDelExistingImage: {
      type: Boolean,
      default: false,
    },
  });

  const emit = defineEmits(['update:value', 'change']);

  // 更新value
  const updateValue = (value: any, fileList) => {
    console.log(value, fileList, 444444);
    emit('update:value', value);
    emit('change', value, fileList);
  };

  // 上传功能
  const fileList = ref<UploadProps['fileList']>([]);

  watch(
    () => fileList.value,
    (value) => {
      const newValue = value?.map((item) => item.url) || [];

      // 如果值相同则不更新
      if (!arrayIsSame(newValue, props.value)) {
        updateValue(newValue, value);
      }
    },
    {
      deep: true,
    },
  );

  watch(
    () => props.value,
    (value) => {
      const newValue = fileList.value?.map((item) => item.url) || [];

      // 判断上传文件类型，若不是PNG或JPG格式则提示“文件类型错误”，并删除该文件
      fileList.value = fileList.value?.filter((item) => {
        if (!item.url && item.type !== 'image/png' && item.type !== 'image/jpeg') {
          // message.error('仅支持jpg、png格式图片上传');
          return false;
        }
        return true;
      });

      // 如果值相同则不更新
      if (arrayIsSame(newValue, value)) {
        return;
      }

      const _fileList = value?.map((item: any, index) => {
        if (item?.url) {
          return {
            uid: item.uid || `-${index + 1}`,
            name: item.name || 'image.png',
            status: 'done',
            url: item.url,
          };
        }
        return {
          uid: `-${index + 1}`,
          name: 'image.png',
          status: 'done',
          url: item,
        };
      });
      fileList.value = (_fileList as UploadProps['fileList']) || [];
    },
    {
      immediate: true,
    },
  );

  // 摄像头拍照
  const cameraVisible = ref(false);
  const getCameraImage = (file) => {
    console.log(file, 2222);
    fileList.value.push(file);
  };

  function getBase64(file: File) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  }

  // customRequest 上传文件 转base64
  const customRequest = (options: any) => {
    const { file, onSuccess, onError, onProgress } = options;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      onProgress({ percent: (event.loaded / event.total) * 100 });
      file.url = reader.result as string;
      if ((fileList.value || []).length >= props.limit) {
        message.info(`最多上传${props.limit}张图片！`);
      }
      fileList.value?.push(file);
      onSuccess(reader.result);
      console.log('上传成功：', reader.result, fileList.value);
    };
    reader.onerror = (error) => {
      console.log('上传失败：', error);
      // message.error('图片上传失败');

      onError(error);
    };
  };

  // const handleCancel = () => {
  //   previewVisible.value = false;
  // };

  const handlePreview = async (file: UploadProps['fileList'][number]) => {
    if (!file.url && !file.preview) {
      file.preview = (await getBase64(file.originFileObj)) as string;
    }
    previewImage.value = file.url || file.preview;
    previewVisible.value = true;
  };

  const removeHandle = (file: UploadProps['fileList'][number]) => {
    if (!file.url?.includes('base64') && props.noDelExistingImage) {
      message.warning('不允许删除原有图片');
      return;
    }
    fileList.value = (fileList?.value || []).filter((item) => item.uid !== file.uid);
  };
</script>

<style lang="less" scoped>
  .upload-btn {
    width: 100%;
    height: 100%;
    background: #f1f6fc;
    border: 1px dashed #e6e6e6;
    border-radius: 6px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
