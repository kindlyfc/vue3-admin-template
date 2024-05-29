<template>
  <div class="waring-message" v-if="showMessage">
    <div class="box">
      <!--      <div class="content"><warning-outlined />您有一条三级疲劳驾驶预警需要处理。请前往处理！</div>-->
      <div class="title">
        <span>事件通知</span>
        <close-outlined class="close" @click="showMessage = false" />
      </div>
      <div class="content">
        <!-- <video autoplay loop class="iconfont" src="/public/warning.webm" /> -->
        <div class="text">
          <div class="br"
            >{{ sockData?.orgName }} {{ sockData?.reportTime }} 发起事件一键上报，请<a-button
              @click="showDetails"
              type="link"
              >前往查看</a-button
            ></div
          >
        </div>
      </div>

      <div class="bg-top"></div>
      <div class="bg-bottom"></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  /*
应急事件弹窗
*/
  import { onBeforeMount, onUnmounted, ref } from 'vue';
  import { playWaring } from './clewTone';
  import { CloseOutlined } from '@ant-design/icons-vue';
  import { Storage } from '@/utils/Storage';
  import { ACCESS_TOKEN_KEY } from '@/enums/cacheEnum';
  import router from '@/router';

  const websock = ref<any>(null);
  const audioRef = ref<any>(null);
  const showMessage = ref<boolean>(false);
  // const wsuri =
  //   window.location.href.indexOf('32080') > -1
  //     ? `ws://10.30.145.10:32080/sews/ws`
  //     : window.location.href.indexOf('101') > -1
  //     ? `ws://10.10.248.101:30003/sews/ws`
  //     : `ws://10.30.145.8:30003/sews/ws`;
  // node本地测试
  console.log(window.location, 111111111);
  const token = Storage.get(ACCESS_TOKEN_KEY);
  // const wsuri = `ws://192.168.30.13:8080/ws?token=Bearer ${token}`;
  const wsuri = `ws://${window.location.host}/ws?token=Bearer ${token}`;

  const sockData = ref();
  // 重连次数
  const times = ref(0);

  // 组件挂载前
  onBeforeMount(() => {
    initWebSocket(wsuri);
  });

  // 组件卸载后
  onUnmounted(() => {
    if (websock.value) {
      // 离开路由之后断开websocket连接
      websock.value.close();
    }
  });

  // 定时器
  let interval: any = null;

  // 初始化weosocket, wsuri为传入链接，不同socket链接服务不同
  const initWebSocket = (wsuri) => {
    clearInterval(interval);

    if (times.value > 100) return;

    times.value += 1;

    try {
      const websocks = new WebSocket(wsuri);

      websocks.onmessage = websocketonmessage;
      websocks.onopen = websocketonopen;
      websocks.onerror = websocketonerror;
      websocks.onclose = websocketclose;
      websock.value = websocks;

      console.log('初始化weosocket');
    } catch (e) {
      console.error('初始化weosockets失败！请检查websocket连接是否通常！', e);
    }
  };

  // 连接建立成功
  const websocketonopen = (info) => {
    interval = setInterval(() => {
      if (websock.value) {
        websock.value.send('{code: 0}');
      } else {
        clearInterval(interval);
      }
    }, 30 * 1000);

    // 发送认证信息
    websock.value.send(
      JSON.stringify({
        code: 1,
      }),
    );
    console.log('连接建立成功', info);
  };

  // 连接建立失败重连
  const websocketonerror = () => {
    console.log('连接建立失败重连');
    // 防抖重连 10s
    setTimeout(() => {
      initWebSocket(wsuri);
    }, 10 * 1000);
  };

  // 数据接收
  const websocketonmessage = (e) => {
    audioRef?.value?.pause();
    const redata = JSON.parse(e.data);
    console.log(redata, 23333333333);
    sockData.value = redata.data;
    showMessage.value = true;
    try {
      audioRef.value = playWaring();
      audioRef.value.loop = true;
    } catch (error) {
      console.log(`播放声音出错:${error}`);
    }
  };

  // 跳转至详情
  const showDetails = () => {
    showMessage.value = false;
    audioRef.value.pause(); //关闭播报
    router.push(
      `/eventManage/details?id=${sockData.value.id}&orgName=${sockData.value.orgName}&orgId=${sockData.value.orgId}`,
    );
  };

  // 关闭连接
  const websocketclose = (e) => {
    console.log('断开连接', e);
    // 防抖重连 10s
    setTimeout(() => {
      initWebSocket(wsuri);
      audioRef.value.loop = false;
    }, 10 * 1000);
  };
</script>

<style lang="less" scoped>
  @keyframes move-forever {
    0% {
      box-shadow: 0px 0px 25px 0px rgba(247, 15, 26, 0.7);
    }

    50% {
      box-shadow: 0px 0px 10px 0px rgba(247, 15, 26, 0.7);
    }

    100% {
      box-shadow: 0px 0px 25px 0px rgba(247, 15, 26, 0.7);
    }
  }

  .waring-message {
    cursor: pointer;
    width: 400px;
    height: 180px;
    box-shadow: 0px 0px 21px 0px rgba(247, 15, 26, 0.2);
    position: fixed;
    // top: 0;
    right: 20px;
    bottom: 10px;
    // left: 0;
    z-index: 999;
    background-color: #fff;
    animation: move-forever 1.5s cubic-bezier(0.55, 0.5, 0.45, 0.5) infinite;
    border-radius: 6px;

    .box {
      .title {
        padding: 17px 17px 10px 17px;
        border-bottom: 1px solid #dddddd;
        font-size: 16px;
        font-family: Microsoft YaHei;
        font-weight: 600;
        color: #0c0c0c;

        .close {
          float: right;
          cursor: pointer;
        }
      }

      .content {
        padding: 20px 10px 20px;
        display: flex;

        .iconfont {
          font-size: 100px;
          color: red;
          width: 100px;
        }

        .text {
          margin: 10px 20px;
        }
      }
    }
  }
</style>
