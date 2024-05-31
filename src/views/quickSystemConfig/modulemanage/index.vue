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
        >
          <a-form-item label="字体大小">
            <div flex
              ><a-input v-model:value="formData.fonSize" placeholder="请输入字体大小"></a-input
              ><div w20px ml10px mt3px>px</div></div
            >
          </a-form-item>
          <a-form-item label="字体间距">
            <div flex>
              <a-input
                v-model:value="formData.fonSize"
                placeholder="请输入字体间距(建议以0.1em为基准)"
              ></a-input
              ><div w20px ml10px mt3px>em</div>
            </div>
          </a-form-item>
          <a-form-item label="字体颜色">
            <a-input v-model:value="formData.fontColor" placeholder="请输入字体颜色"></a-input>
          </a-form-item>
        </a-form>
        <div class="mb30px mt40px text-center">
          <a-button type="primary" class="text-#3A6DFE mr-30px" ghost b-rd-6px> 取消 </a-button>
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
  const formData = reactive<any>({
    fonSize: '',
    interval: '',
    fontColor: '',
  });
  const formRef = ref();
  const tableLoading = ref<boolean>(false);
  const submitLoading = ref<boolean>(false);
  const getList = () => {};
  const Submit = () => {};
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
      width: 30%;
      margin: 0 auto;
      margin-top: 40px;
    }
  }
</style>
