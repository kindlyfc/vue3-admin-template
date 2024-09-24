<template>
  <div>
    <a-tabs v-model:activeKey="activeKey">
      <a-tab-pane key="1" tab="证件识别">
        <OcrIdCar></OcrIdCar>
      </a-tab-pane>
      <a-tab-pane key="2" tab="自定义识别" force-render>
        <OcrCustom
          :loading="loading"
          :imgData="imgData"
          :itemData="{
            id: 1,
            name: '设备1',
            deviceNo: 123123,
            status: 1,
            host: '127.0.0.1',
            port: 8080,
            username: 'admin',
            password: 123456,
            algorithmPipingNum: 1,
            ocrDeviceAreaConfig: {
              leftTopX: '10,10',
              leftTopY: '10,10',
              width: 100,
              height: 100,
            },
            deviceCameraAlgorithms: [{ sceneType: 1 }],
          }"
        ></OcrCustom>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script lang="ts" setup>
  import { reactive, ref } from 'vue';
  import OcrIdCar from '@/components/basic/ocr-id-card/ocr-id-card.vue';
  import OcrCustom from '@/components/basic/ocr-custom/ocr-custom.vue';
  const activeKey = ref('1');
  const loading = ref(false);
  const imgData = reactive({
    img: 'data:image/jpeg;base64,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',
  });
</script>
<style scoped lang="less"></style>
