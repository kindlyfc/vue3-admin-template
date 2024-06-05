<template>
  <div>
    <div v-show="!formData.isGradation" mt3px mb10px flex>
      <div
        class="color_box"
        :style="{ backgroundColor: formData.colors?.hex8 }"
        @click="showColorPanel('colorsShow')"
      />
      <span ml10px mt2px>{{ formData.colors?.hex8 }}</span></div
    >

    <div v-show="formData.isGradation" mt3px mb10px flex>
      <span mt2px>0%处: </span>
      <div
        ml4px
        class="color_box"
        @click="showColorPanel('colorsShow0')"
        :style="{ backgroundColor: formData.colors0?.hex8 }"
      /><span ml6px mt2px>{{ formData.colors0?.hex8 }}</span>
      <span mt2px ml20px>100%处:</span>
      <div
        ml4px
        class="color_box"
        :style="{ backgroundColor: formData.colors100?.hex8 }"
        @click="showColorPanel('colorsShow100')"
      />
      <span ml6px mt2px>{{ formData.colors100?.hex8 }}</span></div
    >

    <a-checkbox v-model:checked="formData.isGradation" @change="isGradationChange" class="mt6px"
      >是否渐变</a-checkbox
    >
    <a-radio-group v-show="formData.isGradation" ml20px v-model:value="formData.lrRotb">
      <a-radio v-for="item in lrRotbMap" :key="item.value" :value="item.value">{{
        item.name
      }}</a-radio>
    </a-radio-group>

    <div class="mt-20px">
      <Sketch
        v-if="formData.colorsShow && !formData.isGradation"
        class="sketch"
        v-model="formData.colors"
        @changButton="changeColor(1)"
      />
      <Sketch
        v-if="formData.colorsShow0 && formData.isGradation"
        class="sketch"
        v-model="formData.colors0"
        @changButton="changeColor(2)"
      />
      <Sketch
        v-if="formData.colorsShow100 && formData.isGradation"
        class="sketch"
        v-model="formData.colors100"
        @changButton="changeColor(3)"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, reactive } from 'vue';
  import { Sketch } from '@ans1998/vue3-color';

  const lrRotbMap = ref([
    { name: '从上到下', value: 'to bottom' },
    { name: '从左到右', value: 'to right' },
  ]);

  const emit = defineEmits(['formDataChange']);

  const initColor = () => ({
    hex8: '#FFFFFFFF',
    hex: '#FFFFFF',
    a: 1,
  });

  const formData = reactive<any>({
    isGradation: false,
    lrRotb: '',
    /* 颜色选择器 */
    colors: initColor(),
    colorsShow: false,
    /* 颜色选择器0% */
    colors0: initColor(),
    colorsShow0: false,
    /* 颜色选择器100% */
    colors100: initColor(),
    colorsShow100: false,
  });

  const showColorPanel = (panel: string) => {
    formData[panel] = !formData[panel];

    // 收起其他颜色面板
    const panels = ['colorsShow', 'colorsShow0', 'colorsShow100'];
    panels.forEach((item) => {
      if (item !== panel) {
        formData[item] = false;
      }
    });
  };

  const isGradationChange = () => {
    console.log(formData.isGradation);
    if (formData.isGradation) {
      formData.colors0 = {};
      formData.lrRotb = 'to bottom';
    } else {
      formData.colors0 = {};
      formData.colors100 = {};
      formData.lrRotb = '';
    }
    emit('formDataChange', formData);
  };

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
    emit('formDataChange', formData);
  };
</script>
<style scoped lang="less">
  .sketch {
    width: 300px;
  }
</style>
