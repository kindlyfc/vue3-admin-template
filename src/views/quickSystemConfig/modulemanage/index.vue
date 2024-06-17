<template>
  <div>
    <div class="ca_region">
      <div class="titleSty">一级菜单自定义</div>
      <div class="ca_contentuser">
        <a-form :model="formData1" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }" relative>
          <a-form-item label="字体大小">
            <div flex
              ><a-input-number
                style="width: 300px"
                v-model:value="formData1.fontSize"
                placeholder="请输字体大小"
              ></a-input-number
              ><div w40px ml10px mt3px>px </div></div
            >
          </a-form-item>
          <a-form-item label="菜单间距">
            <div flex
              ><a-input-number
                style="width: 300px"
                v-model:value="formData1.moduleInterval"
                placeholder="请输入菜单间距"
              ></a-input-number
              ><div w40px ml10px mt4px>px</div></div
            >
          </a-form-item>

          <a-form-item label="字体颜色">
            <ColorSelect
              @form-data-change="getColorData($event, Color1Text)"
              v-model:formData="Color1Text"
            ></ColorSelect>
          </a-form-item>

          <a-form-item label="菜单图标颜色">
            <ColorSelect
              :justOneColor="true"
              @form-data-change="getColorData($event, Color1Mdoule)"
              v-model:formData="Color1Mdoule"
            ></ColorSelect>
          </a-form-item>
          <a-form-item label="菜单选中背景颜色">
            <ColorSelect
              @form-data-change="getColorData($event, Color1Bgc)"
              v-model:formData="Color1Bgc"
            ></ColorSelect>
          </a-form-item>
        </a-form>
        <div class="mb30px mt40px text-center">
          <a-button type="primary" class="text-#3A6DFE mr-30px" ghost b-rd-6px> 清空 </a-button>
          <a-button
            type="primary"
            b-rd-6px
            @click="Submit('一级模块', formData1, Color1Text, Color1Mdoule, Color1Bgc)"
            :loading="submitLoading1"
          >
            确定
          </a-button>
        </div>
      </div>
    </div>
    <div class="ca_region">
      <div class="titleSty">二级菜单自定义</div>
      <div class="ca_contentuser">
        <a-form :model="formData2" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }" relative>
          <a-form-item label="字体大小">
            <div flex
              ><a-input-number
                style="width: 300px"
                v-model:value="formData2.fontSize"
                placeholder="请输字体大小"
              ></a-input-number
              ><div w40px ml10px mt3px>px </div></div
            >
          </a-form-item>
          <a-form-item label="菜单间距">
            <div flex
              ><a-input-number
                style="width: 300px"
                v-model:value="formData2.moduleInterval"
                placeholder="请输入菜单间距"
              ></a-input-number
              ><div w40px ml10px mt4px>px</div></div
            >
          </a-form-item>

          <a-form-item label="字体颜色">
            <ColorSelect
              @form-data-change="getColorData($event, Color2Text)"
              v-model:formData="Color2Text"
            ></ColorSelect>
          </a-form-item>

          <a-form-item label="菜单颜色">
            <ColorSelect
              @form-data-change="getColorData($event, Color2Mdoule)"
              v-model:formData="Color2Mdoule"
            ></ColorSelect>
          </a-form-item>
          <a-form-item label="菜单选中背景颜色">
            <ColorSelect
              @form-data-change="getColorData($event, Color2Bgc)"
              v-model:formData="Color2Bgc"
            ></ColorSelect>
          </a-form-item>
        </a-form>
        <div class="mb30px mt40px text-center">
          <a-button type="primary" class="text-#3A6DFE mr-30px" ghost b-rd-6px> 清空 </a-button>
          <a-button
            type="primary"
            b-rd-6px
            @click="Submit('二级模块', formData2, Color2Text, Color2Mdoule, Color2Bgc)"
            :loading="submitLoading2"
          >
            确定
          </a-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { reactive, ref, computed } from 'vue';
  import ColorSelect from '@/components/basic/color-select/color-select.vue';
  import { editModule } from '@/api/uiConfig';
  import { message } from 'ant-design-vue';
  import { useUiStore } from '@/store/modules/uiConfig';
  const uiStore = useUiStore();
  const formData1 = reactive<any>({
    id: null,
    fontSize: null,
    moduleName: null,
    moduleInterval: null,
  });
  const formData2 = reactive<any>({
    id: null,
    fontSize: null,
    moduleName: null,
    moduleInterval: null,
  });
  const initColor = () => ({
    hex8: '#FFFFFFFF',
    hex: '#FFFFFF',
    a: 1,
  });
  const initFormColor = () => {
    return {
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
    };
  };
  const Color1Text = reactive<any>(initFormColor());
  const Color1Mdoule = reactive<any>(initFormColor());
  const Color1Bgc = reactive<any>(initFormColor());
  const Color2Text = reactive<any>(initFormColor());
  const Color2Mdoule = reactive<any>(initFormColor());
  const Color2Bgc = reactive<any>(initFormColor());
  const submitLoading1 = ref<boolean>(false);
  const submitLoading2 = ref<boolean>(false);
  const getList = async () => {
    const res = await uiStore.getModule();
    res.forEach((v) => {
      const {
        id,
        moduleName,
        fontSize,
        fontGradient,
        fontGradientType,
        fontStartColor,
        fontEndColor,
        moduleInterval,
        moduleGradient,
        moduleGradientType,
        moduleStartColor,
        moduleEndColor,
        moduleChooseGradient,
        moduleChooseGradientType,
        moduleChooseStartColor,
        moduleChooseEndColor,
      } = v;
      if (v.moduleName == '一级模块') {
        Object.assign(formData1, {
          id,
          fontSize,
          moduleName,
          moduleInterval,
        });
        Color1Text.colors.hex8 = fontGradient == 1 ? '' : fontStartColor;
        Color1Text.colors0.hex8 = fontGradient == 1 ? fontStartColor : '';
        Color1Text.colors100.hex8 = fontGradient == 1 ? fontEndColor : '';
        Color1Text.isGradation = fontGradient == 1 ? true : false;
        Color1Text.lrRotb =
          fontGradientType == 1 ? 'to bottom' : fontGradientType == 2 ? 'to right' : '';

        Color1Mdoule.colors.hex8 = moduleGradient == 1 ? '' : moduleStartColor;
        Color1Mdoule.colors0.hex8 = moduleGradient == 1 ? moduleStartColor : '';
        Color1Mdoule.colors100.hex8 = moduleGradient == 1 ? moduleEndColor : '';
        Color1Mdoule.isGradation = moduleGradient == 1 ? true : false;
        Color1Mdoule.lrRotb =
          moduleGradientType == 1 ? 'to bottom' : moduleGradientType == 2 ? 'to right' : '';

        Color1Bgc.colors.hex8 = moduleChooseGradient == 1 ? '' : moduleChooseStartColor;
        Color1Bgc.colors0.hex8 = moduleChooseGradient == 1 ? moduleChooseStartColor : '';
        Color1Bgc.colors100.hex8 = moduleChooseGradient == 1 ? moduleChooseEndColor : '';
        Color1Bgc.isGradation = moduleChooseGradient == 1 ? true : false;
        Color1Bgc.lrRotb =
          moduleChooseGradientType == 1
            ? 'to bottom'
            : moduleChooseGradientType == 2
            ? 'to right'
            : '';
      } else {
        Object.assign(formData2, {
          id,
          fontSize,
          moduleName,
          moduleInterval,
        });
        Color2Text.colors.hex8 = fontGradient == 1 ? '' : fontStartColor;
        Color2Text.colors0.hex8 = fontGradient == 1 ? fontStartColor : '';
        Color2Text.colors100.hex8 = fontGradient == 1 ? fontEndColor : '';
        Color2Text.isGradation = fontGradient == 1 ? true : false;
        Color2Text.lrRotb =
          fontGradientType == 1 ? 'to bottom' : fontGradientType == 2 ? 'to right' : '';

        Color2Mdoule.colors.hex8 = moduleGradient == 1 ? '' : moduleStartColor;
        Color2Mdoule.colors0.hex8 = moduleGradient == 1 ? moduleStartColor : '';
        Color2Mdoule.colors100.hex8 = moduleGradient == 1 ? moduleEndColor : '';
        Color2Mdoule.isGradation = moduleGradient == 1 ? true : false;
        Color2Mdoule.lrRotb =
          moduleGradientType == 1 ? 'to bottom' : moduleGradientType == 2 ? 'to right' : '';

        Color2Bgc.colors.hex8 = moduleChooseGradient == 1 ? '' : moduleChooseStartColor;
        Color2Bgc.colors0.hex8 = moduleChooseGradient == 1 ? moduleChooseStartColor : '';
        Color2Bgc.colors100.hex8 = moduleChooseGradient == 1 ? moduleChooseEndColor : '';
        Color2Bgc.isGradation = moduleChooseGradient == 1 ? true : false;
        Color2Bgc.lrRotb =
          moduleChooseGradientType == 1
            ? 'to bottom'
            : moduleChooseGradientType == 2
            ? 'to right'
            : '';
      }
    });
  };
  getList();

  const Submit = (name, formData, color1, color2, color3) => {
    const { id, fontSize, moduleName, moduleInterval } = formData;
    const data = {
      id,
      fontSize,
      moduleName,
      moduleInterval,
      fontStartColor: color1.isGradation ? color1.colors0.hex8 : color1.colors.hex8,
      fontEndColor: color1.isGradation ? color1.colors100.hex8 : color1.colors.hex8,
      fontGradient: color1.isGradation ? 1 : 0,
      fontGradientType: color1.lrRotb == 'to bottom' ? 1 : color1.lrRotb == 'to right' ? 2 : '',
      moduleStartColor: color2.isGradation ? color2.colors0.hex8 : color2.colors.hex8,
      moduleEndColor: color2.isGradation ? color2.colors100.hex8 : color2.colors.hex8,
      moduleGradient: color2.isGradation ? 1 : 0,
      moduleGradientType: color2.lrRotb == 'to bottom' ? 1 : color2.lrRotb == 'to right' ? 2 : '',
      moduleChooseStartColor: color3.isGradation ? color3.colors0.hex8 : color3.colors.hex8,
      moduleChooseEndColor: color3.isGradation ? color3.colors100.hex8 : color3.colors.hex8,
      moduleChooseGradient: color3.isGradation ? 1 : 0,
      moduleChooseGradientType:
        color3.lrRotb == 'to bottom' ? 1 : color3.lrRotb == 'to right' ? 2 : '',
    };
    let loading = name == '一级模块' ? submitLoading1.value : submitLoading2.value;
    loading = true;
    editModule(data)
      .then((res) => {
        message.success('操作成功');
        getList();
      })
      .finally(() => {
        loading = false;
      });
  };

  const getColorData = (data, colorForm) => {
    Object.assign(colorForm, data);
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

  // :deep(.vc-botton-right) {
  //   display: none !important;
  // }
</style>
