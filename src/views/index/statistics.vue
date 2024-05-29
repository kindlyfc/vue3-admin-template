<template>
  <div class="index-box">
    <div class="left_container">
      <!-- 人数统计 -->
      <div class="white_box">
        <div class="white_title">
          <span>人数统计</span>
          <div>
            <span class="label">所属机构</span>
            <a-select
              class="select"
              v-model:value="orgId"
              placeholder="请选择"
              show-search
              @search="getOrgName"
              @change="orgChange"
              :options="orgList"
            ></a-select>
          </div>
          <!-- <span class="to_module">进入模块 <svg-icon name="1077" size="12" class="mt5px"></svg-icon></span> -->
        </div>
        <div class="content_item people_counting">
          <div>
            <div>{{ humanTrafficData.realTime || 0 }}</div>
            <div>实时人流量总数</div>
          </div>
          <div>
            <div>{{ humanTrafficData.total || 0 }}</div>
            <div>今日人流量累计</div>
          </div>
        </div>

        <div>
          <a-carousel arrows>
            <template #prevArrow>
              <div class="custom-slick-arrow" style="left: 10px; z-index: 1">
                <left-circle-outlined twoToneColor="#000" />
              </div>
            </template>
            <template #nextArrow>
              <div class="custom-slick-arrow" style="right: 10px">
                <right-circle-outlined />
              </div>
            </template>
            <!-- <div>1</div>
            <div>2</div>
            <div>3</div> -->
            <div class="content_item four_data" v-for="(group, index) in cameraGroups" :key="index">
              <div v-for="item in group" :key="item.id">
                <div>{{ item.count }}</div>
                <div>{{ item.name }}</div>
              </div>
            </div>
            <!-- <div v-for="item in humanTrafficData.cameraCounts" :key="item.id">
              <div>{{ item.count }}</div>
              <div>{{ item.name }}</div>
            </div> -->
          </a-carousel>
        </div>

        <div id="lineChart"></div>
      </div>
      <!-- 人数统计 -->

      <!-- 今日预警情况 -->
      <div class="white_box">
        <div class="white_title">
          <span>今日预警情况</span>
          <!-- <span class="to_module">进入模块 <svg-icon name="1077" size="12" class="mt5px"></svg-icon></span> -->
        </div>
        <div class="white_content" style="height: 280px">
          <div class="content_item" style="overflow: visible !important">
            <div>
              <div>{{ warningData.total }}</div>
              <div>预警总数</div>
            </div>
            <div>
              <div>{{ warningData.pending }}</div>
              <div>待处理</div>
            </div>
            <div>
              <div class="horizontal">
                <div>一级</div>
                <div class="red">{{ warningData.stair }}</div>
              </div>
              <div class="horizontal">
                <div>二级</div>
                <div class="orange">{{ warningData.second }}</div>
              </div>
              <div class="horizontal">
                <div>三级</div>
                <div class="blue">{{ warningData.third }}</div>
              </div>
            </div>
          </div>
          <div class="content_borderW"></div>
          <div class="content_item warning_total">
            <div
              v-for="(item, index) in warningData.typeNum"
              :key="index"
              class="w33%!"
              @click="goPage(item)"
            >
              <div>{{ item.num }}</div>
              <div>{{ item.name }}</div>
            </div>
          </div>
        </div>
      </div>
      <!-- 今日预警情况 -->
    </div>

    <!-- 右侧视频播放区域 -->
    <div class="right_container">
      <div class="white_box">
        <div class="tab_title">实时监控</div>
        <div class="white_title">
          <!-- <a-popover trigger="click">
            <template #content>
              <a-checkbox-group v-model:value="deviceIds" @change="chooseDevice" name="checkboxgroup"
                :options="treeData" />
            </template>
            <a-button type="primary">选择设备</a-button>
          </a-popover> -->
          <div class="choose_device">
            <span class="label">设备选择</span>
            <a-select
              class="select"
              v-model:value="deviceIds"
              mode="multiple"
              :max-tag-count="1"
              placeholder="请选择"
              show-search
              @change="divceChange"
              :options="optionDevice"
            ></a-select>
          </div>
          <router-link to="/videoMonitor/realTimeMonitor">
            <span class="to_module"
              >进入模块 <svg-icon name="1077" size="12" class="mt5px"></svg-icon
            ></span>
          </router-link>
        </div>
        <div class="video_box">
          <div style="width: 49%; margin-bottom: 20px" v-for="item in playingUrls" :key="item.id">
            <VideoPlayer
              v-if="item.url"
              :videoUrl="item.url"
              :deviceId="item.id"
              :videoId="item.id"
              height="348px"
              :width="'48%'"
            />
            <div v-if="!item.url && item.id" class="videoErr" style="height: 348px">
              <a-spin tip="同时拉流已达上限，加载中请稍后..."> </a-spin>
            </div>
            <div v-if="!item.id && !item.url" class="videoErr" style="height: 348px">
              <div style="text-align: center; line-height: 348px; color: #fff"
                >请选择播放设备...</div
              >
            </div>
          </div>
          <div v-if="playingUrls.length == 0" class="noVideo">暂无监控视频</div>
        </div>
      </div>
    </div>
    <!-- 右侧视频播放区域 -->
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import useLeftData from './composables/leftData';
  import useVideo from './composables/video';
  import { LeftCircleOutlined, RightCircleOutlined } from '@ant-design/icons-vue';

  const treeValue = ref<string[]>([]);

  // 左侧数据功能块
  const {
    initChart,
    getOrgName,
    orgChange,
    goPage,
    orgList,
    orgId,
    warningData,
    humanTrafficData,
    cameraGroups,
  } = useLeftData();

  // 右侧视频功能块
  const { playingUrls, treeData, optionDevice, deviceIds, chooseDevice, divceChange } =
    useVideo(orgId);
</script>

<style lang="less" scoped>
  #lineChart {
    width: 100%;
    height: 200px;
  }

  .index-box {
    display: flex;
    width: 100%;
    justify-content: space-between;

    .left_container {
      width: 40%;
    }

    .white_box {
      background-color: #fff;
      margin-bottom: 20px;

      .white_content {
        padding: 20px;
        display: flex;
        // align-items: center;

        .content_borderW {
          width: 1px;
          background-color: #e6e6e6;
          height: 100%;
          margin: 0 20px;
        }

        .content_borderH {
          background-color: #e6e6e6;
          height: 1px;
          margin: 0 20px;
        }
      }
    }

    .white_title {
      display: flex;
      justify-content: space-between;
      padding: 20px;
      align-items: center;
      height: 60px;
      box-sizing: border-box;
      border-bottom: 1px solid #e6e6e6;
      position: relative;

      > span {
        font-size: 14px;
        font-family: PingFang SC-Bold, PingFang SC;
        font-weight: bold;
        color: #333333;
      }

      > div {
        margin-left: auto;

        .select {
          width: 240px;
          margin: 0 30px 0 10px;
        }

        :deep(.ant-select:not(.ant-select-customize-input) .ant-select-selector) {
          height: 30px;
          background: #fff;
          border-radius: 6px;
          margin-left: 10px;
        }
      }

      .choose_device {
        position: absolute;
        left: 30px;
      }
    }

    .content_item {
      display: flex;
      flex-wrap: wrap;
      flex: 1;
      // height: 100%;
      overflow-y: auto;

      > div:not(.class_item) {
        width: 33%;
        text-align: center;
        margin-bottom: 20px;

        > div:nth-child(1) {
          font-size: 18px;
          font-family: PingFang SC-Bold, PingFang SC;
          font-weight: bold;
          color: #333333;
          margin-bottom: 6px;
        }

        > div:nth-child(2) {
          font-size: 14px;
          font-family: PingFang SC-Medium, PingFang SC;
          font-weight: 500;
          color: #333333;
        }
      }

      .class_item {
        width: 34%;

        > div {
          padding: 0 16px 0 0;
          display: flex;
          align-items: center;
          justify-content: space-between;

          > span:nth-child(1) {
            font-size: 14px;
            font-family: PingFang SC-Medium, PingFang SC;
            font-weight: 500;
            color: #333333;
          }

          > span:nth-child(2) {
            font-size: 18px;
            font-family: PingFang SC-Bold, PingFang SC;
            font-weight: bold;
          }
        }
      }
    }

    .warning_total {
      height: 220px;

      > div {
        cursor: pointer;
      }
    }

    .horizontal {
      width: 100px;
      display: flex;
      justify-content: space-around;
      align-items: flex-end;
      margin-bottom: 0 !important;

      > div {
        font-size: 14px;
        font-weight: normal;
        margin-bottom: 15px;
      }

      .red,
      .orange,
      .blue {
        font-weight: bold;
        font-size: 16px !important;
      }

      .orange {
        color: #ff910a;
      }

      .red {
        color: #d10000;
      }

      .blue {
        color: #5389d8;
      }
    }

    .four_data {
      display: flex !important;
      flex-wrap: wrap;
      padding: 0 10px;

      > div {
        width: 24% !important;
        margin: 0 !important;

        div {
          text-align: center;
        }
      }
    }

    .people_counting {
      display: flex;
      justify-content: space-around;
      margin-top: 20px;
      border-bottom: 1px solid #e6e6e6;
      margin-bottom: 20px;
    }

    .content_item5 {
      flex: 2 !important;

      > div {
        width: 25% !important;
      }
    }

    .right_container {
      width: 58%;

      .white_box {
        margin-top: 40px !important;
        height: calc(100% - 60px) !important;
        position: relative;
        padding: 20px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      }

      .white_title {
        position: absolute;
        top: -58px;
        border: none;
        right: 0;
        width: 86%;
        display: flex;
        justify-content: flex-end;
      }

      .video_box {
        height: 49%;
        border-radius: 6px;
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
      }
    }
  }

  :deep(.slick-arrow.custom-slick-arrow) {
    width: 25px;
    height: 25px;
    font-size: 25px;
    color: #5470c6;
    transition: ease all 0.3s;
    opacity: 0.8;
  }

  :deep(.slick-arrow.custom-slick-arrow:before) {
    display: none;
  }

  :deep(.slick-arrow.custom-slick-arrow:hover) {
    opacity: 0.5;
  }

  .to_module {
    color: #5389d8 !important;
    cursor: pointer;
    float: right;
  }

  .videoErr {
    width: 100%;
    background-color: #000;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .noVideo {
    width: 100%;
    text-align: center;
    font-size: 18px;
    color: #5f5b5b;
    font-weight: 600;
    line-height: 600px;
  }
</style>
