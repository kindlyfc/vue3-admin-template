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
                v-model:value="formData.fontSize"
                placeholder="请输入字体大小"
              ></a-input-number
              ><div w40px ml10px mt3px>px</div></div
            >
          </a-form-item>
          <a-form-item label="字体间距">
            <div flex
              ><a-input-number
                style="width: 300px"
                v-model:value="formData.fontInterval"
                placeholder="请输入字体间距"
              ></a-input-number
              ><div w40px ml10px mt4px>px</div></div
            >
          </a-form-item>

          <a-form-item label="字体颜色">
            <ColorSelect
              @form-data-change="getColorData"
              v-model:formData="formDataColor"
            ></ColorSelect>
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
  import ColorSelect from '@/components/basic/color-select/color-select.vue';
  import { getModule, editModule } from '@/api/uiConfig';
  import { message } from 'ant-design-vue';

  const formData = reactive<any>({
    id: null,
    fontSize: null,
    fontInterval: null,
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
  const formDataColor = reactive<any>(initFormColor());
  const formRef = ref();
  const tableLoading = ref<boolean>(false);
  const submitLoading = ref<boolean>(false);
  const getList = () => {
    getModule().then((res) => {
      const {
        id,
        fontSize,
        fontInterval,
        gradient,
        gradientType,
        startGradientColor,
        endGradientColor,
      } = res;
      Object.assign(formData, {
        id,
        fontSize,
        fontInterval,
      });
      formDataColor.colors.hex8 = gradient == 1 ? '' : startGradientColor;
      formDataColor.colors0.hex8 = gradient == 1 ? startGradientColor : '';
      formDataColor.colors100.hex8 = gradient == 1 ? endGradientColor : '';
      formDataColor.isGradation = gradient == 1 ? true : false;
      formDataColor.lrRotb = gradientType == 1 ? 'to bottom' : gradientType == 2 ? 'to right' : '';
    });
  };
  getList();
  const Submit = () => {
    formRef.value.validate().then((res) => {
      const { id, fontInterval, fontSize } = formData;
      const { colors, colors0, colors100, isGradation, lrRotb } = formDataColor;
      const data = {
        id,
        fontInterval,
        fontSize,
        startGradientColor: isGradation ? colors0.hex8 : colors.hex8,
        endGradientColor: isGradation ? colors100.hex8 : colors.hex8,
        gradient: isGradation ? 1 : 0,
        gradientType: lrRotb == 'to bottom' ? 1 : lrRotb == 'to right' ? 2 : '',
      };
      tableLoading.value = true;
      editModule(data)
        .then((res) => {
          message.success('操作成功');
          getList();
          clearForm();
        })
        .finally(() => {
          tableLoading.value = false;
        });
    });
  };
  const clearForm = () => {
    Object.assign(formData, {
      id: null,
      fontSize: null,
      fontInterval: null,
    });
    Object.assign(formDataColor, initFormColor());
    formRef.value.resetFields();
  };
  const getColorData = (data) => {
    Object.assign(formDataColor, data);
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
