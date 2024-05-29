<template>
  <div class="left_cont1">
    <div class="left_cont11 flex-bc">
      <div flex>
        <img w39px h40px src="@/assets/images/dp/ups.png" alt="" />
        <div>
          <div class="name_sty">UPS设备</div>
          <div class="unit_sty"
            ><span class="text_sty">{{ dataCont?.upsNum || 0 }}</span
            >个</div
          >
        </div>
      </div>
      <div flex>
        <img w40px h44px src="@/assets/images/dp/sxj.png" alt="" />
        <div>
          <div class="name_sty">摄像机设备</div>
          <div class="unit_sty"
            ><span class="text_sty">{{ dataCont?.videoNum || 0 }}</span
            >个</div
          >
        </div>
      </div>

      <div flex>
        <img w38px h39px mt4px src="@/assets/images/dp/fqry.png" alt="" />
        <div>
          <div class="name_sty">分区人员数</div>
          <div class="unit_sty"
            ><span class="text_sty">{{ dataCont?.gridUserNum || 0 }}</span
            >个</div
          >
        </div>
      </div>

      <div flex>
        <img w40px h46px mt--2px src="@/assets/images/dp/fq.png" alt="" />
        <div>
          <div class="name_sty">分区数</div>
          <div class="unit_sty"
            ><span class="text_sty">{{ dataCont?.gridNum || 0 }}</span
            >个</div
          >
        </div>
      </div>
    </div>
    <div class="left_cont11 flex-ac pl18px">
      <div flex>
        <img w39px h41px src="@/assets/images/dp/upszx.png" alt="" />
        <div>
          <div class="name_sty">UPS在线</div>
          <div class="unit_sty"
            ><span class="text_sty">{{ dataCont?.upsOnlineNum || 0 }}</span
            >个</div
          >
        </div>
      </div>
      <div flex style="min-width: 110px">
        <img w46px h53px src="@/assets/images/dp/sxjzx.png" alt="" />
        <div>
          <div class="name_sty">摄像机在线</div>
          <div class="unit_sty"
            ><span class="text_sty">{{ dataCont?.videoOnlineNum || 0 }}</span
            >个</div
          >
        </div>
      </div>

      <div flex>
        <img w40px h44px src="@/assets/images/dp/gd.png" alt="" />
        <div>
          <div class="name_sty">工单处理率</div>
          <div class="unit_sty"
            ><span class="text_sty">{{
              (dataCont?.workOrderHandleRate * 100).toFixed(2) || 0
            }}</span
            >%</div
          >
        </div>
      </div>
    </div>
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
  .left_cont1 {
    height: 126px;
    padding-left: 20px;
    margin-top: 3px;
    min-width: 100%;
  }

  .left_cont11 {
    min-width: 100%;
  }

  .left_cont11 > div {
    min-width: 104px;
    margin: 6px 0;
  }

  .name_sty {
    font-size: 12px;
    font-family: Source Han Sans CN;
    font-weight: 400;
    color: #edfbff;
    line-height: 22px;
    opacity: 0.98;
  }

  .unit_sty {
    font-size: 10px;
    font-family: Source Han Sans CN;
    font-weight: 400;
    color: #9cc2e3;
  }

  .text_sty {
    font-size: 15px;
    font-family: Source Han Sans CN;
    font-weight: 500;
    color: #f7fbff;
  }
</style>
