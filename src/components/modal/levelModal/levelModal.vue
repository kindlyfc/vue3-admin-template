<template>
  <div>
    <a-modal
      v-model:visible="visibleModel"
      :width="660"
      title="查看"
      centered
      destroyOnClose
      :footer="null"
      :afterClose="close"
    >
      <div>
        <div pl20px>
          <div class="type_title">告警信息</div>
          <a-descriptions
            :column="1"
            size="small"
            :labelStyle="{
              width: '100px',
              color: '#333333',
              fontSize: '14px',
              textAlign: 'right',
            }"
            :contentStyle="{ color: '#333333', fontSize: '14px', fontWeight: 'bold' }"
          >
            <a-descriptions-item label="告警编号">
              <span
                style="color: #4080ff; text-decoration: underline"
                class="goPage"
                @click="goPage"
                title="点击跳转告警时间"
              >
                {{ detail?.warnNum || '' }}</span
              >
            </a-descriptions-item>
            <a-descriptions-item label="告警类型">
              {{
                detail?.warnType == 1
                  ? 'USP设备运行异常'
                  : detail?.warnType == 2
                  ? '摄像机异常'
                  : ''
              }}
            </a-descriptions-item>
            <a-descriptions-item label="所属区域">
              {{ detail?.gridName || '' }}
            </a-descriptions-item>
          </a-descriptions>
          <div class="type_title">工单信息</div>
          <a-descriptions
            :column="1"
            size="small"
            :labelStyle="{
              width: '100px',
              color: '#333333',
              fontSize: '14px',
              textAlign: 'right',
            }"
            :contentStyle="{ color: '#333333', fontSize: '14px', fontWeight: 'bold' }"
          >
            <a-descriptions-item label="工 单 号">
              {{ detail?.number || '' }}
            </a-descriptions-item>
            <!-- <a-descriptions-item label="工单类型">
              {{ detail?.warnNum || '' }}
            </a-descriptions-item> -->
            <a-descriptions-item label="创 建 人">
              {{ detail?.createPeople || '' }}
            </a-descriptions-item>
            <a-descriptions-item label="接 收 人">
              {{
                detail?.workOrderPeopleList?.map((v) => v.peopleName).join(',') ||
                detail?.personName ||
                '--'
              }}
            </a-descriptions-item>
            <a-descriptions-item label="工单状态">
              <span
                :style="{
                  color:
                    detail?.status == 1
                      ? 'red'
                      : detail?.status == 2
                      ? '#dad60f'
                      : detail?.status == 3
                      ? '#0fda2a'
                      : '#ccc',
                }"
              >
                {{ ['待下发', '待反馈', '处理中', '已办结'][Number(detail?.status) - 1] }}</span
              >
            </a-descriptions-item>
            <a-descriptions-item label="工单描述">
              {{ detail?.description || '' }}
            </a-descriptions-item>
          </a-descriptions>
          <div class="type_title">回执信息</div>
          <a-descriptions
            :column="1"
            size="small"
            :labelStyle="{
              width: '100px',
              color: '#333333',
              fontSize: '14px',
              textAlign: 'right',
            }"
            :contentStyle="{ color: '#333333', fontSize: '14px', fontWeight: 'bold' }"
          >
            <a-descriptions-item label="回执描述">
              {{ detail?.backInfo || '' }}
            </a-descriptions-item>
            <a-descriptions-item label="图 片">
              <a-image
                v-if="detail?.imgURL"
                :width="130"
                :height="160"
                style="border-radius: 6px; height: 160px"
                :src="detail?.backPicUrl"
              />
            </a-descriptions-item>
            <!-- <a-descriptions-item label="处 置 人">
              {{ detail?.personName || '' }}
            </a-descriptions-item> -->
            <a-descriptions-item label="回执时间">
              {{ detail?.backTime || '' }}
            </a-descriptions-item>
          </a-descriptions>
        </div>
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
      detailData: {
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
        () => props.detailData,
        (val) => {
          console.log(val, 888);

          if (val) {
            detail.value = {
              ...val,
              imgURL: val?.backPicUrl,
              backPicUrl:
                (import.meta.env.VITE_BASE_API || 'http://182.148.114.142:2670') +
                '/v1/file?uri=' +
                val?.backPicUrl?.replace(/\\/g, '/'),
            };
          }
        },
        {
          // immediate: true,
          deep: true,
        },
      );
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

      const goPage = () => {
        if (detail?.value.warnNum) {
          //跳转UPS
          if (detail?.value.warnType == 1) {
            router.push({
              path: '/practiceSandard/UPSDataAlarm',
              query: {
                warnType: 1,
                warnNum: detail?.value.warnNum,
              },
            });
          }
          //跳转jk
          if (detail?.value.warnType == 2) {
            router.push({
              path: '/practiceSandard/cameraAlarm',
              query: {
                warnType: 2,
                warnNum: detail?.value.warnNum,
              },
            });
          }
        }
      };
      return {
        visibleModel,
        detail,
        close,
        goPage,
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

  .goPage:hover {
    color: #64a0ff !important;
  }
</style>
