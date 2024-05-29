<template>
  <div class="index-box" ref="imgFull">
    <!-- 地图 -->
    <BaseAmap
      :option="mapOption"
      ref="baseAmap"
      @loaded="
        () => {
          getMap1();
          baseAmap.map.setZoomAndCenter(13, [104.0668, 30.5988]);
        }
      "
      @zoom="zoomMap"
    >
    </BaseAmap>

    <!-- 蒙版 -->
    <img class="mengban" src="@/assets/images/dp/mb.png" alt="" />
    <!--标题框  -->
    <img class="mengban bk" src="@/assets/images/dp/bk.png" alt="" />
    <!--标题  -->
    <img class="btwz" src="@/assets/images/dp/bt.png" alt="" />
    <!-- 左边数据 -->
    <div class="list_cont left_">
      <div class="left_contT flex-bc pl40px pr40px">
        <div
          ><img w14px h13px src="@/assets/images/dp/fx.png" alt="" /> <span>风向：</span>西北风</div
        >
        <div class="center-border"
          ><img w13px h15px src="@/assets/images/dp/fl.png" alt="" /> <span>风力：</span>＜3级</div
        >
        <div><img w14px h14px src="@/assets/images/dp/sd.png" alt="" /> <span>湿度：</span>91%</div>
      </div>
      <!-- 当年数据总览 -->
      <titleCont ZHTEXT="当年数据总览" ENEXT="Data overview" :isShowMore="false" />
      <leftCont1 />
      <!-- 当年数据总览 -->

      <!-- 服务人员在岗率 -->
      <titleCont ZHTEXT="服务人员在岗率" ENEXT="Online rate" :isShowMore="false" />
      <leftCont2 />
      <!-- 服务人员在岗率 -->

      <!-- 终端设备统计 -->
      <titleCont
        ZHTEXT="终端设备统计"
        ENEXT="Device Statistics"
        pageURL="equipmentEntry"
        role="/device/list"
      />
      <leftCont3 />
      <!-- 终端设备统计 -->

      <!-- 当月工单处置率TOP -->
      <titleCont
        ZHTEXT="当月工单处置率TOP"
        ENEXT="Work order"
        pageURL="riskPeopleBase"
        role="/order/worker"
      />
      <leftCont4 />
      <!-- 当月工单处置率TOP -->

      <!-- 选择框 -->
      <div class="choose_cont" v-if="haveData == 2">
        <div class="choose_item" @click="chooseType(1)">
          <div class="choose_box">
            <div v-if="typeCount.includes(1)" class="choose_inner"></div>
          </div>
          <div>人 员</div>
        </div>
        <div class="choose_item" @click="chooseType(2)">
          <div class="choose_box">
            <div v-if="typeCount.includes(2)" class="choose_inner"></div>
          </div>
          <div>正 常</div>
        </div>
        <div class="choose_item" @click="chooseType(3)">
          <div class="choose_box">
            <div v-if="typeCount.includes(3)" class="choose_inner"></div>
          </div>
          <div>告 警</div>
        </div>
      </div>
      <!-- 选择框 -->
    </div>
    <!-- 左边数据 -->

    <!-- 右边数据 -->
    <div class="list_cont right_">
      <div class="left_contT flex-bc pl60px pr40px">
        <div
          ><img w15px h15px style="vertical-align: -1px" src="@/assets/images/dp/sj.png" alt="" />
          {{ time }}</div
        >
        <div style="vertical-align: -2px" class="center-border"
          ><img w17px h19px src="@/assets/images/dp/dw.png" alt="" /> 成都市</div
        >
        <div @click="isFullscreen ? exitfull() : Fullscreen()" class="Fullscreen"
          ><img
            style="vertical-align: -2px"
            mr8px
            w17px
            h17px
            :src="!isFullscreen ? qp : sx"
            alt=""
          />{{ isFullscreen ? '缩小' : '全屏' }}</div
        >
      </div>
      <!-- 近一个月告警趋势 -->
      <titleCont
        ZHTEXT="近一个月告警趋势"
        ENEXT="Alarm trend"
        pageURL="UPSDataAlarm"
        role="/alarm/ups"
      />
      <rightCont1 />
      <!-- 近一个月告警趋势 -->
      <!-- 近7天告警排查 -->
      <titleCont
        ZHTEXT="近7天告警排查"
        ENEXT="Alarm analysis"
        pageURL="UPSDataAlarm"
        role="/alarm/ups"
      />
      <rightCont2 />
      <!-- 近7天告警排查 -->
      <!-- 告警规则一览 -->
      <titleCont
        ZHTEXT="告警规则一览"
        ENEXT="Alarm rule"
        pageURL="alarmConfiguration"
        role="/alarm/config"
      />
      <rightCont3 />
      <!-- 告警规则一览 -->
      <!-- 当月各分区告警占比 -->
      <titleCont
        ZHTEXT="当月各分区告警占比"
        ENEXT="Warning"
        pageURL="gridManagement"
        role="/grid/list"
      />
      <rightCont4 />
      <!-- 当月各分区告警占比 -->
    </div>
    <!-- 右边数据 -->

    <!-- 人员列表 -->
    <div class="user_tk" v-if="haveData == 2 && typeCount.includes(1)">
      <div class="user_title">分区内人员详情</div>
      <div class="user_num">
        <div
          >监管<span class="text-#ff9000 ml3px"> {{ usersCount?.superviseNum || 0 }}</span></div
        >
        <div
          >运维<span class="text-#5EDBFF ml3px"> {{ usersCount?.operationNum || 0 }}</span></div
        >
      </div>
      <div class="usertable_title">
        <div>姓名</div>
        <div>角色</div>
      </div>

      <div class="usertable_scorll">
        <div v-for="(item, index) in usersList" :key="index">
          <div title="姓名">{{ item.userName || '--' }}</div>
          <div title="角色">{{ item.role || '--' }}</div>
        </div>
      </div>
    </div>
    <!-- 人员列表 -->

    <!-- 底部数据 -->
    <div flex-bc class="bottom_cont">
      <div>
        <div class="bottom_title">UPS告警</div>
        <div class="bottom_num">{{ dataCont?.ups || 0 }} <span>个</span></div>
      </div>
      <div>
        <div class="bottom_title">摄像机告警</div>
        <div class="bottom_num">{{ dataCont?.cameras || 0 }} <span>个</span></div>
      </div>
      <div>
        <div class="bottom_title">新增工单</div>
        <div class="bottom_num">{{ dataCont?.order || 0 }} <span>个</span></div>
      </div>
    </div>
    <!-- 底部数据 -->
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, reactive, onUnmounted, nextTick } from 'vue';
  import { message } from 'ant-design-vue';
  import titleCont from './composables/titleCont.vue';
  import leftCont1 from './composables/leftCont1.vue';
  import leftCont2 from './composables/leftCont2.vue';
  import leftCont3 from './composables/leftCont3.vue';
  import leftCont4 from './composables/leftCont4.vue';
  import rightCont1 from './composables/rightCont1.vue';
  import rightCont2 from './composables/rightCont2.vue';
  import rightCont3 from './composables/rightCont3.vue';
  import rightCont4 from './composables/rightCont4.vue';
  import alar from '@/assets/images/dp/alar.png';
  import zc from '@/assets/images/dp/zc.png';
  // import usserM from '@/assets/images/dp/usserM.png';
  // import sxM from '@/assets/images/dp/sxM.png';
  // import sxA from '@/assets/images/dp/sxA.png';
  import qp from '@/assets/images/dp/qp.png';
  import sx from '@/assets/images/dp/sx.png';
  import BaseAmap from '@/components/GAmap/GAmap.vue';
  import { mapCont1, mapCont2, mapCont3, gridUserList, gridUserCount } from '@/api/statistics';
  import dayjs from 'dayjs';
  const baseAmap = ref<any>();
  const mapOption = reactive({
    center: [104.0668, 30.5988],
    zoom: 10,
    zooms: [11, 32],
  });
  const timer = ref<any>();
  const time = ref<any>();
  const imgFull = ref<any>();
  const dataCont = ref<any>();
  const gridId = ref<any>();
  const usersList = ref<any>([]);
  const usersCount = ref<any>([]);

  //分区层级数据
  const haveData = ref<1 | 2 | 3>(1);
  const getMap1 = () => {
    mapCont1().then((res) => {
      baseAmap.value.map.clearMap();
      res.forEach((v) => {
        const MarkerLs = v.points.map((v) => {
          return [v.lng, v.lat];
        });
        if (MarkerLs?.length) {
          // baseAmap.value.map.setZoomAndCenter(12, MarkerLs[0]);
          addPolygonAll(MarkerLs, v);
        }
      });
      if (res?.length) {
        haveData.value = 1;
      }
    });
  };
  /* 总览区域绘制 */
  function addPolygonAll(path, data) {
    setTimeout(() => {
      const polygonC = new baseAmap.value.AMap.Polygon({
        path: path,
        data,
        fillColor: '#98dbfb',
        strokeOpacity: 1,
        fillOpacity: 0.8,
        strokeColor: '#2b8cbe',
        strokeWeight: 1,
        strokeStyle: 'dashed',
        strokeDasharray: [5, 5],
      });
      polygonC.on('mouseover', () => {
        polygonC.setOptions({
          fillOpacity: 0.6,
          fillColor: '#7bccc4',
        });
      });
      polygonC.on('mouseout', () => {
        polygonC.setOptions({
          fillOpacity: 0.8,
          fillColor: '#98dbfb',
        });
      });
      polygonC.on('click', (e) => {
        const { id } = e.target._opts.data;
        UserList(id);
        UserCount(id);
        gridId.value = id;
        getMap2(id);
      });
      baseAmap.value.map.add(polygonC);
    }, 0);
  }
  //人员设备层级数据
  const getMap2 = (id, type?) => {
    mapCont2(id).then((res) => {
      // if (res?.length) {
      baseAmap.value.map.clearMap();
      // } else {
      //   message.warning('该分区下暂无点位');
      // }
      res.forEach((v, index) => {
        let URL: any = null;
        if (v.hasAlarm) {
          URL = alar;
        } else {
          URL = zc;
        }
        const icon = new baseAmap.value.AMap.Icon({
          size: new baseAmap.value.AMap.Size(45, 45),
          image: URL,
          imageSize: new baseAmap.value.AMap.Size(45, 45),
        });

        const lng = v.lng;
        const lat = v.lat;
        const marker = new baseAmap.value.AMap.Marker({
          position: [Number(lng), Number(lat)],
          icon,
        });
        if (!type) {
          marker.setMap(baseAmap.value.map);
        } else if (type && typeCount.value.indexOf(2) != -1 && !v.hasAlarm) {
          marker.setMap(baseAmap.value.map);
        } else if (type && typeCount.value.indexOf(3) != -1 && v.hasAlarm) {
          marker.setMap(baseAmap.value.map);
        }
        if (index == 0) {
          baseAmap.value.map.setZoomAndCenter(14.5, [Number(lng), Number(lat)]);
        }
      });
      nextTick(() => {
        setTimeout(() => {
          haveData.value = 2;
        }, 2000);
      });
    });
  };

  /* 地图层级改变 */
  const zoomMap = (e) => {
    if (haveData.value == 1) return;
    if (e <= 13) {
      baseAmap.value.map.clearMap();
      usersList.value = [];
      haveData.value = 1;
      getMap1();
    }
  };
  // 网格下的人员统计
  const UserCount = (gridId) => {
    gridUserCount({ gridId }).then((res) => {
      usersCount.value = res;
    });
  };
  // 网格下的人员列表
  const UserList = (gridId) => {
    gridUserList({ gridId }).then((res) => {
      usersList.value = res;
    });
  };
  // 地图底部数据
  const getDatamapCont3 = () => {
    mapCont3().then((res) => {
      dataCont.value = res;
    });
  };
  onMounted(() => {
    getDatamapCont3();
    timer.value = setInterval(() => {
      time.value = dayjs().format('HH:mm:ss');
    }, 1000);
  });
  onUnmounted(() => {
    clearInterval(timer.value);
    timer.value = null;
  });

  const typeCount = ref<any>([1, 2, 3]);
  const chooseType = (type) => {
    if (typeCount.value.indexOf(type) != -1) {
      typeCount.value.splice(typeCount.value.indexOf(type), 1);
    } else {
      typeCount.value.push(type);
    }
    if (type !== 1) {
      getMap2(gridId.value, true);
    }
  };
  //全屏
  const isFullscreen = ref<any>(false);
  const Fullscreen = () => {
    const element: any = imgFull.value;
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.mozRequestFullScreen) {
      element.mozRequestFullScreen();
    } else if (element.msRequestFullscreen) {
      element.msRequestFullscreen();
    } else if (element.webkitRequestFullscreen) {
      element.webkitRequestFullScreen();
    }
    isFullscreen.value = true;
  };

  // 退出全屏
  const exitfull = () => {
    const element: any = document;
    if (element.cancelFullScreen) {
      element.cancelFullScreen();
    } else if (element.mozCancelFullScreen) {
      element.mozCancelFullScreen();
    } else if (element.webkitCancelFullScreen) {
      element.webkitCancelFullScreen();
    }
    isFullscreen.value = false;
  };
</script>

<style lang="less" scoped>
  .index-box {
    width: calc(100vw - 140px);
    height: calc(100vw - 850px);
    position: relative;
    margin: 0 auto;

    #imgFull {
      width: 100%;
      height: 100%;
    }

    .mengban {
      position: absolute;
      width: 100%;
      height: 100%;
      pointer-events: none;
      left: 0;
      top: 0;
    }

    .btwz {
      position: absolute;
      left: 50%;
      top: 0.9vh;
      width: 512px;
      height: 82px;
      margin-left: -256px;
      z-index: 100 !important;
    }

    .bk {
      z-index: 10 !important;
    }

    .list_cont {
      width: 428px;
      z-index: 1000 !important;
      transform: scale(0.8);
      position: relative;
    }

    .left_ {
      position: absolute;
      left: 2.1%;
      top: 5.4vh;
      transform-origin: left top;
    }

    .right_ {
      position: absolute;
      right: 2.1%;
      top: 5.4vh;
      transform-origin: right top;
    }

    .left_contT {
      height: 25px;
      padding-top: 4rpx;

      > div {
        font-size: 16px;
        font-family: Source Han Sans CN;
        font-weight: 400;
        color: #ffffff;

        span {
          font-size: 12px;
        }
      }

      .center-border {
        text-align: center;
        border-right: 1px solid #ffffff4e;
        border-left: 1px solid #ffffff4e;
        padding: 0 15px;
      }
    }
  }

  .Fullscreen {
    cursor: pointer;
  }

  .bottom_cont {
    position: absolute;
    left: 50%;
    margin-left: -300px;
    bottom: 4.2vh;
    width: 600px;
    height: 140px;
  }

  .bottom_cont > div {
    width: 104px;
    height: 98px;
    background: url('@/assets/images/dp/fgbj.png') no-repeat !important;
    background-size: 100% 100% !important;
    background-position: 0 0;
  }

  .bottom_title {
    text-align: center;
    font-size: 15px;
    font-family: Source Han Sans CN;
    font-weight: bold;
    color: #44c1ef;
    line-height: 32px;
    text-shadow: 1px 2px 10px rgba(28, 238, 253, 0.39);
    padding-top: 4px;
  }

  .bottom_num {
    text-align: center;
    font-size: 24px;
    font-family: Source Han Sans CN;
    font-weight: bold;
    font-style: italic;
    color: #edfbff;
  }

  .bottom_num span {
    font-size: 14px;
    font-family: Source Han Sans CN;
    font-weight: bold;
    font-style: italic;
    color: #edfbff;
  }

  .choose_cont {
    position: absolute;
    right: -44%;
    bottom: 0vh;
    width: 92px;
    height: 124px;
    background: url('@/assets/images/dp/choose.png') no-repeat !important;
    background-size: 100% 100% !important;
    background-position: 0 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .choose_box {
    width: 14px;
    height: 14px;
    border: 1px solid #98e4fb;
    border-radius: 1px;
    position: relative;
    margin-right: 12px;
    // box-sizing: border-box;
  }

  .choose_inner {
    margin: auto;
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    width: 7px;
    height: 7px;
    background: #98dbfb;
    border-radius: 1px;
  }

  .choose_item {
    font-size: 12px;
    font-family: PingFang SC;
    font-weight: 500;
    color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 7px 0;
  }

  .user_tk {
    width: 199px;
    height: 245px;
    position: absolute;
    background: url('@/assets/images/dp/tk.png') no-repeat !important;
    background-size: 100% 100% !important;
    background-position: 0 0;
    right: 430px;
    top: 14vh;
    padding: 16px 22px;
  }

  .user_title {
    font-size: 14px;
    font-family: PingFang SC;
    font-weight: 500;
    color: #ffffff;
  }

  .user_num {
    display: flex;
    align-items: center;

    > div {
      font-size: 12px;
      font-family: Source Han Sans CN;
      font-weight: 400;
      color: #ffffff;
      flex: 1;
      text-align: center;

      span {
        font-style: italic;
        font-size: 20px;
        font-family: YouSheBiaoTiHei;
        font-weight: 400;
      }
    }
  }

  .usertable_title {
    display: flex;
    align-items: center;
    width: 100%;
    height: 28px;
    background: linear-gradient(0deg, rgba(25, 86, 155, 0.56), rgba(68, 165, 220, 0.45));

    > div {
      flex: 1;
      text-align: center;
      font-size: 12px;
      font-family: Source Han Sans CN;
      font-weight: 400;
      color: #ffffff;
    }
  }

  .usertable_scorll {
    width: 100%;
    height: 130px;
    overflow: auto;

    > div {
      display: flex;
      align-items: center;
      width: 100%;
      height: 27px;
      background: #298fe31a;

      > div {
        flex: 1;
        font-size: 12px;
        font-family: Source Han Sans CN;
        font-weight: 400;
        color: #ffffff;
        text-align: center;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }

    > div:nth-child(2n) {
      background: #298fe34d;
    }

    &::-webkit-scrollbar {
      width: 0;
      height: 0;
    }
  }
</style>
<style>
  .tabs-view-content {
    padding-top: 10px !important;
    border: none !important;
  }
</style>
