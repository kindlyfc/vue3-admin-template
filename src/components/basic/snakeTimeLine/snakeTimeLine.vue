<template>
  <div class="container-fluid blue-bg">
    <div class="container">
      <!-- <h2 class="pb-3 pt-2">标题栏</h2> -->
      <!--first section-->
      <div v-for="index in len" :key="index">
        <div
          class="row align-items-center how-it-works item-row"
          :class="[
            index % 2 === 0 ? 'justify-content-end' : '',
            index === len && index % 2 !== 0 ? 'left' : '',
          ]"
          @click="itemClick(index)"
        >
          <!-- 奇数组 S -->
          <div
            v-if="index % 2 !== 0"
            class="col-2 text-center"
            :class="[
              index === 1 ? 'bottom' : index === len ? 'top' : 'full',
              index % 2 === 0 ? '' : 'left',
            ]"
          >
            <div class="circle">{{ index }}</div>
          </div>
          <!-- 奇数组 E -->

          <!-- 内容区域 S -->
          <div class="col-10" :class="[index % 2 === 0 ? 'text-right' : '']">
            <div class="content-box flex" :class="[index % 2 === 0 ? 'flex-row-reverse' : '']">
              <!-- <div class="left mr-20px"> -->
              <!-- <img
                  style="width: 120px; height: 160px"
                  class="fit-cover"
                  :src="'data:image/jpeg;base64,' + list[index - 1]?.alertImg"
                /> -->

              <div class="left mr-20px h200px flex mb20px justify-center">
                <div class="w120px contras_">
                  <div class="contras_title">预警图片/抓拍照</div>
                  <div class="contras_cont">
                    <a-image
                      style="object-fit: cover; height: 160px"
                      :height="160"
                      width="100%"
                      :src="$getImgAdress(list[index - 1]?.alertImg)"
                      alt=""
                    />
                  </div>
                </div>
                <div class="w70px contras_">
                  <div class="contras_title">相 似 度</div>
                  <div class="contras_cont progress_">
                    <a-progress
                      type="circle"
                      :percent="list[index - 1]?.similarity?.toFixed(2)"
                      :width="50"
                      strokeColor="#FD9A1C"
                      :strokeWidth="8"
                    />
                  </div>
                </div>
                <div class="w120px contras_">
                  <div class="contras_title">对比图</div>
                  <div class="contras_cont">
                    <a-image
                      style="object-fit: cover; height: 160px"
                      :height="160"
                      width="100%"
                      :src="$getImgAdress(list[index - 1]?.faceImg)"
                      alt=""
                    />
                  </div>
                </div>
              </div>
              <!-- </div> -->
              <div class="right w38%!">
                <a-descriptions
                  :column="1"
                  size="small"
                  :labelStyle="{ width: '5em', color: '#333333', fontSize: '14px' }"
                  :contentStyle="{ color: '#333333', fontSize: '14px', fontWeight: 'bold' }"
                >
                  <a-descriptions-item label="姓&#12288;&#12288;名">
                    {{ list[index - 1]?.personName }}
                  </a-descriptions-item>
                  <!-- <a-descriptions-item label="相 似 度">
                    {{ list[index - 1]?.similarity }}%
                  </a-descriptions-item> -->
                  <a-descriptions-item label="时&#12288;&#12288;间">
                    {{ list[index - 1]?.alertTime }}
                  </a-descriptions-item>
                  <a-descriptions-item label="地&#12288;&#12288;点">
                    {{ list[index - 1]?.location }}
                  </a-descriptions-item>
                </a-descriptions>
              </div>
            </div>
          </div>
          <!-- 内容区域 E -->

          <!-- 偶数组 S -->
          <div
            v-if="index % 2 === 0"
            class="col-2 text-center"
            :class="[index === 1 ? 'bottom' : index === len ? 'top' : 'full']"
          >
            <div class="circle">{{ index }}</div>
          </div>
          <!-- 偶数组 E -->
        </div>
        <!--path between 1-2-->
        <div v-if="index !== len" class="row timeline">
          <div class="col-2">
            <div class="corner" :class="[index % 2 === 0 ? 'left-top' : 'left-bottom']"></div>
          </div>
          <div class="col-8">
            <hr />
          </div>
          <div class="col-2">
            <div class="corner" :class="[index % 2 === 0 ? 'right-bottom' : 'right-top']"></div>
          </div>
        </div>
      </div>
      <a-empty v-if="len === 0" />
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref, computed } from 'vue';

  export default defineComponent({
    name: 'SnakeTimeLine',
    props: {
      itemClick: {
        type: Function,
      },
      list: {
        type: Array,
        default: () => [],
      },
    },
    setup(props) {
      const len = computed(() => {
        return props.list.length || 5;
      });

      function itemClick(data) {
        if (props.itemClick) {
          props.itemClick(data);
        }
      }

      return {
        len,
        itemClick,
      };
    },
  });
</script>

<style lang="less" scoped>
  @import '~@/styles/bootstrap.css';

  .blue-bg {
    // background-color: #4d4545;
    color: #3768ce;
    height: 100%;
  }

  .circle {
    font-weight: bold;
    padding: 15px 20px;
    border-radius: 50%;
    background: linear-gradient(0deg, #74b0e4 0%, #3768ce 100%) !important;
    color: #fff;
    height: 60px;
    width: 60px;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 2;
  }

  .how-it-works.row {
    display: flex;
  }

  .how-it-works.row .col-2 {
    display: inline-flex;
    align-self: stretch;
    align-items: center;
    justify-content: center;
  }

  .how-it-works.row .col-2::after {
    content: '';
    position: absolute;
    border-left: 3px solid #3768ce;
    z-index: 1;
  }

  .how-it-works.row .col-2.bottom::after {
    height: 50%;
    left: 50%;
    top: 50%;
  }

  .how-it-works.row .col-2.full::after {
    height: 100%;
    left: calc(50% - 3px);
  }

  .how-it-works.row .col-2.full.left::after {
    height: 100%;
    left: 50%;
  }

  .how-it-works.row .col-2.top::after {
    height: 50%;
    left: calc(50% - 3px);
    top: 0;
  }

  .how-it-works.row .col-2.top.left::after {
    height: 50%;
    left: 50%;
    top: 0;
  }

  .timeline div {
    padding: 0;
    height: 40px;
  }

  .timeline hr {
    border-top: 3px solid #3768ce;
    margin: 0;
    top: 17px;
    position: relative;
  }

  .timeline .col-2 {
    display: flex;
    overflow: hidden;
  }

  .timeline .corner {
    border: 3px solid #3768ce;
    border-radius: 15px;
    width: 100%;
    position: relative;
  }

  .timeline .left-bottom {
    left: 50%;
    top: -50%;
  }

  .timeline .right-top {
    left: -50%;
    top: calc(50% - 3px);
  }

  .timeline .right-bottom {
    left: -50%;
    top: -50%;
  }

  .timeline .left-top {
    left: 50%;
    top: calc(50% - 3px);
  }

  .content-box {
    width: 100%;
    padding: 20px;
  }

  .item-row {
    border-radius: 10px;

    &:hover {
      cursor: pointer;
      background-image: linear-gradient(to right, #a1c4fd 0%, #c2e9fb 51%, #a1c4fd 100%);
      // background: linear-gradient(90deg, #74b0e4 0%, #3768ce 100%) !important;
    }
  }

  .contras_ {
    display: flex;
    flex-direction: column;
  }

  .contras_title {
    height: 40px;
    background: #f1f6fc;
    line-height: 40px;
    text-align: center;
    font-size: 14px;
    font-family: PingFang SC-Bold, PingFang SC;
    font-weight: bold;
    color: #333333;
    border: 1px solid #d7e8f5;
  }

  .contras_cont {
    flex: 1;
    border: 1px solid #d7e8f5;
  }

  .progress_ {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #e3f0ff;
  }

  :deep(.ant-progress-text) {
    color: #fd9a1c !important;
    font-size: 12px !important;
  }
</style>
