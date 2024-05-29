<template>
  <div>
    <a-modal
      v-model:visible="visibleModel"
      :width="460"
      title="查看"
      centered
      destroyOnClose
      :footer="null"
      :afterClose="close"
    >
      <div pl20px min-h260px>
        <a-descriptions
          :column="1"
          size="small"
          :labelStyle="{
            color: '#333333',
            fontSize: '14px',
            textAlign: 'right',
          }"
          :contentStyle="{ color: '#333333', fontSize: '14px', fontWeight: 'bold' }"
        >
          <a-descriptions-item v-for="item in recordData" :key="item.id" :label="item.paramName">
            {{ item?.ratedValue || '' }}{{ item.paramUnit }}
          </a-descriptions-item>
        </a-descriptions>
      </div>
    </a-modal>
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref, reactive, watch, computed } from 'vue';
  import router from '@/router';

  // import { Addpersonlevel, personlevelList, personlevelDelet } from '@/api/rskPersonnel';
  /**
   * 新增名单库弹窗组件
   */
  export default defineComponent({
    name: 'AddListModal',
    props: {
      visible: {
        type: Boolean,
        default: false,
      },
      recordData: {
        type: Object,
        default: {},
      },
      afterClose: {
        type: Function,
      },
    },

    setup(props, context) {
      const visibleModel = ref(false);
      const detail = ref<any>();
      watch(
        () => props.visible,
        (val) => {
          visibleModel.value = val;
        },
      );

      watch(visibleModel, (val) => {
        context.emit('update:visible', val);
      });

      /**
       * 弹窗关闭
       */
      const close = () => {
        props.afterClose && props.afterClose();
        visibleModel.value = false;
      };

      return {
        visibleModel,
        detail,
        close,
      };
    },
  });
</script>

<style lang="less" scoped>
  .top-line {
    border-top: 3px dashed #ccc;
  }

  .top {
    padding: 20px 0;
  }

  .img-item {
    display: flex;
    flex-direction: column;
    height: 100%;

    :deep(.ant-tag) {
      margin-top: 15px;
    }
  }

  :deep(.ant-form-item) {
    margin-bottom: 10px;
  }

  :deep(.ant-upload-list-picture-card) {
    width: 220px !important;
    height: 220px !important;

    .ant-upload-list-picture-card-container,
    .ant-upload-select-picture-card {
      width: 100% !important;
      height: 100% !important;
    }
  }

  .center-line {
    margin: 0 10px;
    width: 1px;
  }

  .type_title {
    text-align: left;
    font-size: 15px;
    font-family: PingFang SC-Bold, PingFang SC;
    color: #181717;
    border-bottom: 1px solid #e2dcdc;
    margin-bottom: 30px;
    margin-top: 20px;
  }

  .goPage {
    cursor: pointer;
  }
</style>
