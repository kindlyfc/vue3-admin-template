<template>
  <div class="left_cont4">
    <div
      v-for="(item, index) in rankList"
      :key="index"
      class="list_cont flex-bc"
      :class="index == 0 ? 'no1' : index == 1 ? 'no2' : index == 2 ? 'no3' : ''"
      :style="`background: url(${No[index]}) no-repeat !important;background-size: 65% 100% !important;
       background-position: 0 0;`"
    >
      <div class="name_">{{ item?.name || '--' }}</div>
      <div class="proess_">
        <div class="proess_inner" :style="`width:${item?.handleRate * 100}%`">
          <div class="proess_cercel"></div>
        </div>
      </div>
      <div class="num_">{{ (item?.handleRate * 100).toFixed(1) || 0 }}%</div>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import { orderRank } from '@/api/statistics';
  import No1 from '@/assets/images/dp/n1.png';
  import No2 from '@/assets/images/dp/n2.png';
  import No3 from '@/assets/images/dp/n3.png';
  import No4 from '@/assets/images/dp/n4.png';
  import No5 from '@/assets/images/dp/n5.png';
  import No6 from '@/assets/images/dp/n6.png';
  import No7 from '@/assets/images/dp/n7.png';
  import No8 from '@/assets/images/dp/n8.png';
  import No9 from '@/assets/images/dp/n9.png';
  import No10 from '@/assets/images/dp/n10.png';

  const props = defineProps({
    pageURL: {
      type: String,
      default: '',
    },
  });
  const No = ref<any>([No1, No2, No3, No4, No5, No6, No7, No8, No9, No10]);
  const rankList = ref<any>([]);
  const getData = () => {
    orderRank().then((res) => {
      rankList.value = res;
    });
  };
  getData();
</script>

<style scoped lang="less">
  .left_cont4 {
    position: relative;
    width: 530px;
    transform: scale(0.76);
    margin-top: 8px;
    margin-left: 24px;
    transform-origin: 0 0;
  }

  .list_cont {
    width: 100%;
    height: 24px;
    margin-bottom: 1.4vh;
    padding-left: 90px;
  }

  .name_ {
    width: 60px;
    font-size: 16px;
    font-family: Source Han Sans CN;
    font-weight: 500;
    color: #bcf0fe;
    line-height: 24px;
  }

  .proess_ {
    width: 310px;
    height: 8px;
    background: rgba(62, 92, 112, 0.45);
    border-radius: 4px;
    position: relative;
  }

  .proess_inner {
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    border-radius: 4px;
    background: linear-gradient(89deg, rgba(0, 0, 0, 0.13) 0%, rgba(255, 255, 255, 0.83) 71%);
  }

  .proess_cercel {
    position: absolute;
    right: -1px;
    top: -1px;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: #fff;
    box-shadow: 0 0 10px 2px #fff;
  }

  .num_ {
    width: 30px;
    font-size: 16px;
    font-family: Source Han Sans CN;
    font-weight: 500;
    color: #1ac9ff;
  }

  .no1 {
    .proess_inner {
      background: linear-gradient(
        89deg,
        rgba(0, 0, 0, 0.13) 0%,
        rgba(241, 79, 62, 0.83) 71%
      ) !important;
    }

    .proess_cercel {
      background-color: #f14f3e !important;
      box-shadow: 0 0 10px 3px #f14f3e !important;
    }
  }

  .no2 {
    .proess_inner {
      background: linear-gradient(
        89deg,
        rgba(0, 0, 0, 0.13) 0%,
        rgba(255, 202, 58, 0.83) 71%
      ) !important;
    }

    .proess_cercel {
      background-color: #ffc93a !important;
      box-shadow: 0 0 10px 2px #ffc93a !important;
    }
  }

  .no3 {
    .proess_inner {
      background: linear-gradient(
        89deg,
        rgba(0, 0, 0, 0.13) 0%,
        rgba(105, 240, 255, 0.83) 71%
      ) !important;
    }

    .proess_cercel {
      background-color: #69f0ff !important;
      box-shadow: 0 0 10px 2px #69f0ff !important;
    }
  }
</style>
