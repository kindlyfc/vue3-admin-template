<template>
  <div>
    <div class="ca_region">
      <div class="titleSty">左侧模块自定义</div>
      <div class="ca_contentuser">
        <a-form
          ref="formRef"
          :model="formData"
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 19 }"
          relative
        >
          <a-form-item label="字体大小">
            <div flex
              ><a-input-number
                style="width: 300px"
                v-model:value="formData.fonSize"
                placeholder="请输入字体大小"
              ></a-input-number
              ><div w40px ml10px mt3px>px</div></div
            >
          </a-form-item>
          <a-form-item label="字体间距">
            <div flex
              ><a-input-number
                style="width: 300px"
                v-model:value="formData.fonSize"
                placeholder="请输入字体间距"
              ></a-input-number
              ><div w40px ml10px mt4px>px</div></div
            >
          </a-form-item>

          <a-form-item label="字体颜色">
            <a-checkbox v-model:checked="formData.isGradation" class="mt6px">是否渐变</a-checkbox>
            <a-radio-group v-show="formData.isGradation" ml20px v-model:value="formData.lrRotb">
              <a-radio :value="1">从上到下</a-radio>
              <a-radio :value="2" ml10px>从左往右</a-radio>
            </a-radio-group>
            <div v-show="!formData.isGradation" mt20px flex>
              <div
                class="color_box"
                :style="{ backgroundColor: formData.colors?.hex8 }"
                @click="formData.colorsShow = !formData.colorsShow"
              />
              <span ml10px mt2px>{{ formData.colors?.hex8 }}</span></div
            >

            <div v-show="formData.isGradation" mt20px flex>
              <span mt2px>0%处: </span>
              <div
                ml4px
                class="color_box"
                @click="formData.colorsShow0 = !formData.colorsShow0"
                :style="{ backgroundColor: formData.colors0?.hex8 }"
              /><span ml6px mt2px>{{ formData.colors0?.hex8 }}</span>
              <span mt2px ml20px>100%处:</span>
              <div
                ml4px
                class="color_box"
                :style="{ backgroundColor: formData.colors100?.hex8 }"
                @click="formData.colorsShow100 = !formData.colorsShow100"
              />
              <span ml6px mt2px>{{ formData.colors100?.hex8 }}</span></div
            >
            <Sketch
              v-if="formData.colorsShow && !formData.isGradation"
              class="sketch"
              v-model="formData.colors"
              @changButton="changeColor(1)"
            />
            <Sketch
              v-if="formData.colorsShow0 && formData.isGradation"
              class="sketch ml42px"
              v-model="formData.colors0"
              @changButton="changeColor(2)"
            />
            <Sketch
              v-if="formData.colorsShow100 && formData.isGradation"
              class="sketch ml182px"
              v-model="formData.colors100"
              @changButton="changeColor(3)"
            />
          </a-form-item>
        </a-form>
        <div class="mb30px mt40px text-center">
          <a-button type="primary" class="text-#3A6DFE mr-30px" ghost b-rd-6px> 清空 </a-button>
          <a-button type="primary" b-rd-6px @click="Submit" :loading="submitLoading">
            确定
          </a-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { reactive, ref } from 'vue';
  import { Sketch } from '@ans1998/vue3-color';
  const formData = reactive<any>({
    fonSize: '',
    interval: '',
    fontColor: '',
    isGradation: false,
    lrRotb: 1,
    /* 颜色选择器 */
    colors: {},
    colorsShow: false,
    /* 颜色选择器0% */
    colors0: {},
    colorsShow0: false,
    /* 颜色选择器100% */
    colors100: {},
    colorsShow100: false,
  });
  const formRef = ref();
  const tableLoading = ref<boolean>(false);
  const submitLoading = ref<boolean>(false);
  const getList = () => {};
  const Submit = () => {};

  const changeColor = (type) => {
    switch (type) {
      case 1:
        formData.colorsShow = false;
        break;
      case 2:
        formData.colorsShow0 = false;
        break;
      case 3:
        formData.colorsShow100 = false;
        break;
      default:
        break;
    }
  };
</script>

<style lang="less" scoped>
  .ca_region {
    border-radius: 6px;
    background-color: #fff;
    padding: 0 20px 20px;

    .titleSty {
      font-weight: 600;
      font-size: 14px;
      color: #1f2122c5;
      padding: 16px;
      padding-left: 0;
      border-bottom: 1px solid #e6e3e3;
    }

    .ca_contentuser {
      width: 40%;
      margin: 0 auto;
      margin-top: 40px;
    }
  }

  .color_box {
    width: 62px;
    height: 26px;
    border: 1px solid #dfd9d9;
    border-radius: 4px;
  }

  .sketch {
    position: absolute;
    margin-top: 10px;
    z-index: 100000;
  }

  :deep(.vc-botton-right) {
    display: none !important;
  }
</style>
