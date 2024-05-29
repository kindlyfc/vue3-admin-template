<template>
  <div>
    <a-modal
      v-model:visible="visibleModel"
      :width="600"
      title="临时布控"
      centered
      :footer="null"
      :afterClose="close"
      :destroyOnClose="true"
    >
      <div>
        <!-- 图片添加区 S -->
        <div class="top top-line flex items-start">
          <imageUpload v-model:value="imgList" @change="handleChange" />
        </div>
        <!-- 图片添加区 E -->

        <!-- 布控操作区 S -->
        <div class="center top-line">
          <div class="flex items-center mr20px">
            <span class="mr10px">相似度(%)</span>
            <a-input class="w100px!" v-model:value="similarity" type="number" />
          </div>

          <a-button type="primary" @click="startControl">开始布控</a-button>
        </div>
        <!-- 布控操作区 E -->

        <!-- 布控记录区 S -->
        <div class="bottom top-line">
          <div class="list">
            <div class="item" v-for="item in 3" :key="item" @click="showInfo(item)">
              <div class="photo">
                <img
                  src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
                  alt=""
                />
              </div>
              <div class="info">
                <div class="time">2022-12-12 12:12:12</div>
                <div class="location">1F安检处</div>
              </div>
            </div>
          </div>
        </div>
        <!-- 布控记录区 E -->
      </div>
    </a-modal>

    <!-- <PeopleRecognitionRecordModal v-model:visible="recordVisible" :show-add="true" /> -->
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref, watch, computed } from 'vue';
  import imageUpload from '@/components/basic/image-upload/index.vue';
  // import PeopleRecognitionRecordModal from '@/components/modal/peopleRecognitionRecord/peopleRecognitionRecord.vue';

  /**
   * 人员识别记录弹窗组件
   */
  export default defineComponent({
    name: 'TemporaryControlModal',
    props: {
      visible: {
        type: Boolean,
        default: false,
      },
      afterClose: {
        type: Function,
      },
      showAdd: {
        type: Boolean,
        default: false,
      },
    },
    components: {
      imageUpload,
      PeopleRecognitionRecordModal,
    },
    setup(props, context) {
      const visibleModel = ref(false);
      const recordVisible = ref(false);
      const dataSource = ref<any>([]);
      const imgList = ref([]);
      // 相似度
      const similarity = ref(70);

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
      };

      /**
       * 获取识别记录
       */
      const getList = () => {};

      function handleChange(value: any) {
        // imgList.value = value;
        console.log('图片数据变化', imgList);
      }

      function startControl() {
        console.log('开始布控');
      }

      function showInfo(record) {
        console.log('显示信息');
        recordVisible.value = true;
      }

      return {
        visibleModel,
        dataSource,
        imgList,
        similarity,
        recordVisible,
        handleChange,
        close,
        startControl,
        showInfo,
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

  .center {
    display: flex;
    align-items: center;
    width: 100%;
    padding: 20px;
  }

  .bottom {
    padding-top: 20px;
  }

  .list {
    // 区域布局一行5个格子
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    grid-template-rows: repeat(auto, 1fr);
    grid-column-gap: 10px;
    grid-row-gap: 10px;
    max-height: 560px;
    overflow: auto;

    .item,
    .info {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
    }

    .item {
      cursor: pointer;

      &:hover {
        background-color: #f5f5f5;
      }
    }

    .photo img {
      width: 100px;
      height: 120px;
      border-radius: 6px;
      object-fit: cover;
    }
  }
</style>
