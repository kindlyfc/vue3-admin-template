<template>
  <div>
    <div v-show="!props.formData.gradation" mt3px mb10px flex>
      <div
        class="color_box"
        :style="{ backgroundColor: props.formData.colors?.hex8 }"
        @click="showColorPanel('colorsShow')"
      />
      <span ml10px mt2px>{{ props.formData.colors?.hex8 }}</span></div
    >

    <div v-show="props.formData.gradation" mt3px mb10px flex>
      <span mt2px>0%处: </span>
      <div
        ml4px
        class="color_box"
        @click="showColorPanel('colorsShow0')"
        :style="{ backgroundColor: props.formData.colors0?.hex8 }"
      /><span ml6px mt2px>{{ props.formData.colors0?.hex8 }}</span>
      <span mt2px ml20px>100%处:</span>
      <div
        ml4px
        class="color_box"
        :style="{ backgroundColor: props.formData.colors100?.hex8 }"
        @click="showColorPanel('colorsShow100')"
      />
      <span ml6px mt2px>{{ props.formData.colors100?.hex8 }}</span></div
    >

    <a-checkbox
      v-if="!justOneColor"
      v-model:checked="props.formData.gradation"
      @change="isGradationChange"
      class="mt6px"
      >是否渐变</a-checkbox
    >
    <a-radio-group
      v-show="props.formData.gradation"
      ml20px
      @change="changeGradation"
      v-model:value="props.formData.irRotb"
    >
      <a-radio v-for="item in lrRotbMap" :key="item.value" :value="item.value">{{
        item.name
      }}</a-radio>
    </a-radio-group>

    <div class="mt-20px">
      <Sketch
        v-model="props.formData.colors"
        v-if="panelVisibleMap.colorsShow && !props.formData.gradation"
        class="sketch"
        @changButton="(item) => changeColor(item, 1)"
      />
      <Sketch
        v-model="props.formData.colors0"
        v-if="panelVisibleMap.colorsShow0 && props.formData.gradation"
        class="sketch"
        @changButton="(item) => changeColor(item, 2)"
      />
      <Sketch
        v-model="props.formData.colors100"
        v-if="panelVisibleMap.colorsShow100 && props.formData.gradation"
        class="sketch"
        @changButton="(item) => changeColor(item, 3)"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, reactive } from 'vue';
  import { Sketch } from '@ans1998/vue3-color';

  const props = defineProps({
    justOneColor: {
      type: Boolean,
      default: false,
    }, //只能选一个颜色
    formData: {
      type: Object,
      default: () => {
        return {
          gradation: false,
          irRotb: '',
          /* 颜色选择器 */
          colors: {
            hex8: '#FFFFFFFF',
            hex: '#FFFFFF',
            a: 1,
          },
          /* 颜色选择器0% */
          colors0: {
            hex8: '#FFFFFFFF',
            hex: '#FFFFFF',
            a: 1,
          },
          /* 颜色选择器100% */
          colors100: {
            hex8: '#FFFFFFFF',
            hex: '#FFFFFF',
            a: 1,
          },
        };
      },
    },
  });

  const panelVisibleMap = reactive({
    colorsShow: false,
    colorsShow0: false,
    colorsShow100: false,
  });

  const lrRotbMap = ref([
    { name: '从上到下', value: 'to bottom' },
    { name: '从左到右', value: 'to right' },
  ]);

  const emit = defineEmits(['props.formDataChange']);

  const showColorPanel = (panel: string) => {
    panelVisibleMap[panel] = !panelVisibleMap[panel];

    // 收起其他颜色面板
    const panels = ['colorsShow', 'colorsShow0', 'colorsShow100'];
    panels.forEach((item) => {
      if (item !== panel) {
        panelVisibleMap[item] = false;
      }
    });
  };

  const isGradationChange = () => {
    // if (props.formData.gradation) {
    //   props.formData.colors0 = {};
    //   props.formData.irRotb = 'to bottom';
    // } else {
    //   props.formData.colors0 = {};
    //   props.formData.colors100 = {};
    //   props.formData.irRotb = '';
    // }
    emit('props.formDataChange', props.formData);
  };

  const changeColor = (item, type) => {
    if (item.isOk) {
      const color = {
        hex8: '#' + item.hex,
        hex: '#' + item.hex.slice(0, 6),
        a: item.activeColor.split(',')[3].split(')')[0],
      };
      switch (type) {
        case 1:
          props.formData.colors = color;
          break;
        case 2:
          props.formData.colors0 = color;
          break;
        case 3:
          props.formData.colors100 = color;
          break;
      }
    }
    console.log(item, type);
    switch (type) {
      case 1:
        panelVisibleMap.colorsShow = false;
        break;
      case 2:
        panelVisibleMap.colorsShow0 = false;
        break;
      case 3:
        panelVisibleMap.colorsShow100 = false;
        break;
    }
    emit('props.formDataChange', props.formData);
  };

  const changeGradation = () => {
    emit('props.formDataChange', props.formData);
  };
</script>
<style scoped lang="less">
  .sketch {
    width: 300px;
  }
</style>
