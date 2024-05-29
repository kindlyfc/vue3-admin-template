<template>
  <div class="right_cont3">
    <div class="cont_title flex-bc">
      <div>规则名称</div>
      <div>状态</div>
      <div>操作</div>
    </div>

    <div class="SwiperCont">
      <div
        class="SwiperCont1"
        :style="`top:${top}px;position: absolute;
        left: 0;transition: 0.5s;`"
        @mouseover="stop"
        @mouseout="start"
      >
        <div class="SwiperSlide flex-bc" v-for="(item, index) in list" :key="index">
          <div>{{ item.name }}</div>
          <div :class="item.enabled ? 'text-#46FF21!' : 'text-#FD1525'">{{
            item.enabled ? '启用' : '停用'
          }}</div>
          <div class="detail_sty" @click="more(item.id)"
            ><span v-if="$auth('/alarm/config')">详情>></span></div
          ></div
        >
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { ref, onMounted, onUnmounted } from 'vue';
  import { ruleLan } from '@/api/statistics';
  import router from '@/router';

  const top = ref<any>(0);
  const list = ref<any>([]);
  const getData = () => {
    ruleLan().then((res) => {
      list.value = res;
    });
  };
  getData();
  let timer: any = null;
  onMounted(() => {
    timer = setInterval(() => {
      if (Math.abs(top.value) + 4 * 40 >= list.value?.length * 40) {
        top.value = 0;
        return;
      }
      top.value -= 40;
    }, 1500);
  });
  onUnmounted(() => {
    clearInterval(timer);
    timer = null;
  });
  const stop = () => {
    clearInterval(timer);
    timer = null;
  };
  const start = () => {
    timer = setInterval(() => {
      if (Math.abs(top.value) + 4 * 40 >= list.value?.length * 40) {
        top.value = 0;
        return;
      }
      top.value -= 40;
    }, 1500);
  };

  const more = (id) => {
    router.push(`/practiceSandard/alarmConfiguration?id=${id}`);
  };
</script>

<style scoped lang="less">
  .right_cont3 {
    width: 390px;
    height: 196px;
    margin: 0 auto;
    overflow: hidden;
    margin-top: 10px;
    margin-left: 35px;
  }

  .cont_title {
    width: 390px;
    height: 30px;
    background: rgba(0, 117, 155, 0.1);
    border: 1px solid #79f4ff;
    box-shadow: 0 0 12px 6px #68e4f079 inset;
    font-size: 16px;
    font-family: Source Han Sans CN;
    font-weight: 400;
    color: #f4f9ff;
    padding: 0 34px;
    margin-bottom: 8px;
  }

  .SwiperSlide {
    width: 390px;
    height: 30px;
    background: rgba(6, 39, 61, 0.4);
    border: 1px solid #169dbe;
    font-size: 16px;
    font-family: Source Han Sans CN;
    font-weight: 400;
    color: #f4f9ff;
    margin-bottom: 10px;
  }

  .SwiperSlide > div:nth-child(1) {
    text-align: center !important;
    width: 140px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .SwiperSlide > div:nth-child(2) {
    width: 60px;
  }

  .SwiperSlide > div:nth-child(3) {
    text-align: center !important;
    width: 80px;
  }

  .SwiperCont {
    height: 160px;
    width: 390px;
    overflow: auto;
    position: relative;
  }

  .SwiperCont::-webkit-scrollbar {
    width: 0;
    height: 0;
  }

  .SwiperCont1 {
    width: 390px;
    height: auto;
  }

  .detail_sty {
    font-size: 14px;
    font-family: Source Han Sans CN;
    font-weight: 400;
    font-style: italic;
    color: #77d7ff;
    cursor: pointer;
  }
</style>
