<template>
  <div class="left_cont2">
    <img class="dz" src="@/assets/images/dp/tjdz.png" alt="" />
    <img class="dby" src="@/assets/images/dp/dby.png" alt="" />
    <img class="xby" src="@/assets/images/dp/xby.png" alt="" />

    <div class="value_sty"
      >{{ (dataCont?.userOnDutyRate * 100).toFixed(2) || 0 }}<span>%</span></div
    >
    <div class="text_sty">服务人员在岗率</div>
  </div>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import { overView } from '@/api/statistics';
  const dataCont = ref<any>({});
  const getData = () => {
    overView().then((res) => {
      dataCont.value = res;
    });
  };
  getData();
</script>

<style scoped>
  .left_cont2 {
    height: 182px;
    position: relative;
    transform: scale(0.9);
    margin-top: 28px;
  }

  .dz {
    position: absolute;
    width: 224px;
    height: 206px;
    top: -15px;
    left: 60px;
  }

  .dby {
    position: absolute;
    width: 131px;
    height: 111px;
    left: 112px;
    top: 7px;
  }

  .xby {
    position: absolute;
    width: 116px;
    height: 71px;
    left: 136px;
    top: 42px;
  }

  .text_sty {
    font-size: 18px;
    font-family: Source Han Sans CN;
    font-weight: 500;
    color: #d9f3ff;
    text-align: center;
    position: absolute;
    left: 180px;
    top: 55px;
  }

  .value_sty {
    text-align: center;
    position: absolute;
    left: 190px;
    top: -5px;
    font-size: 38px;
    font-family: Source Han Sans CN;
    font-weight: 500;
    color: #ffffff;
    text-shadow: 0px 0px 30px #00d0ffee;
  }

  .value_sty span {
    font-size: 16px;
    font-family: Source Han Sans CN;
    font-weight: 500;
    color: #d9f3ff;
  }
</style>
