<template>
  <a-modal title="拍照" width="690px" v-model:visible="visible" @cancel="closeCamera">
    <!--摄像头实时视频-->
    <video ref="video" width="640" height="480" autoplay></video>
    <a-spin class="loading" :tip="'摄像头启用中'" :spinning="cameraLoading" />
    <!--canvas截取流-->
    <canvas ref="canvas" class="canvas" width="640" height="480"></canvas>
    <template #footer>
      <a-button type="primary" :loading="photographLoading" @click="photograph">拍照</a-button>
      <a-button @click="closeCamera">关闭</a-button>
    </template>
  </a-modal>
</template>

<script lang="ts" setup>
  import { message } from 'ant-design-vue';
  import { ref, watch } from 'vue';
  // import { upload } from '@/api/common';

  const visible = ref(false);
  const cameraLoading = ref(false);
  const video = ref();
  const canvas = ref();
  const imgBase64 = ref('');
  const props = defineProps({
    showModal: {
      type: Boolean,
      default: false,
    },
  });
  const emits = defineEmits(['close', 'complate']);

  watch(
    () => props.showModal,
    (newVal) => {
      visible.value = newVal;
      if (newVal === true) {
        callCamera();
      }
    },
    {
      immediate: true,
    },
  );

  const callCamera = () => {
    cameraLoading.value = true;
    // H5调用电脑摄像头API，成功则返回视频流
    navigator.mediaDevices
      .getUserMedia({
        video: true,
      })
      .then((success) => {
        // 摄像头开启成功
        console.log(video.value);
        video.value.srcObject = success;
        // 播放摄像头画面
        video.value.play();
        cameraLoading.value = false;
      })
      .catch((error) => {
        message.error('摄像头开启失败，请尝试本地上传');
        console.error(error, '摄像头开启失败，请检查摄像头是否可用！');
        cameraLoading.value = false;
      });
  };

  // 拍照
  const photographLoading = ref(false);
  const photograph = async () => {
    photographLoading.value = true;
    let ctx = canvas.value.getContext('2d');
    // 把当前视频帧内容渲染到canvas上
    ctx.drawImage(video.value, 0, 0, 640, 480);
    // 转base64格式、图片格式转换、图片质量压缩
    imgBase64.value = canvas.value.toDataURL('image/jpeg', 1);
    const fileName = `${+new Date()}照片.jpg`;
    const file: any = base64ToFile(imgBase64.value, fileName);
    file.url = URL.createObjectURL(file);
    const formData = new FormData();
    formData.append('file', file);
    try {
      // const res = await upload(formData)
      // console.log(res[0]?.fileUrl)
      // emits('complate', res[0]?.fileUrl)
      emits('complate', file);
      closeCamera();
    } finally {
      photographLoading.value = false;
    }
  };

  /**
   * base64转化为file
   * @param {urlData} base64内容
   * @param {fileName} 文件名称
   */
  const base64ToFile = (urlData, fileName) => {
    const arr = urlData.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bytes = atob(arr[1]);
    let n = bytes.length;
    const ia = new Uint8Array(n);
    while (n--) {
      ia[n] = bytes.charCodeAt(n);
    }
    return new File([ia], fileName, { type: mime });
  };

  // 关闭摄像头
  const closeCamera = () => {
    if (!video.value.srcObject) {
      return false;
    }
    let stream = video.value.srcObject;
    let tracks = stream.getTracks();
    tracks.forEach((track) => {
      track.stop();
    });
    video.value.srcObject = null;
    visible.value = false;
    emits('close');
  };
</script>
<style scoped lang="less">
  .canvas {
    display: none;
  }

  .loading {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
  }
</style>
