<template>
  <div class="right_cont4 flex-bc">
    <VChart class="myChart" ref="myChart" :option="option" autoresize @mouseover="mouserOverC" />
    <div class="right_cont4R">
      <div class="flex f_kc" v-for="(item, index) in barChartList" :key="index">
        <div class="f_k" :style="{ backgroundColor: item.color }"></div>
        <div class="text_">
          <div>{{ item.name || '--' }}</div>
          <div>{{ (item?.ratio * 100).toFixed(1) || 0 }}%</div>
        </div>
        <div class="line"></div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { ref, onMounted } from 'vue';
  import { alarmGrid } from '@/api/statistics';

  import VChart from 'vue-echarts';
  const myChart = ref<any>();
  const barChartList = ref<any>([]);
  let currentIndex = 0;
  let oldIndex;
  let color: any = [
    '#0DFFC3',
    '#0DCCFF',
    '#0D7FFF ',
    '#FF8400',
    '#FDCE5E',
    '#fd5151',
    '#f071ff',
    '#85f67a',
  ];
  const option = ref<any>();

  function highlightPie(currentIndex, oldIndex) {
    myChart.value.dispatchAction({
      type: 'downplay',
      seriesIndex: 1,
      dataIndex: oldIndex,
    });
    myChart.value.dispatchAction({
      type: 'highlight',
      seriesIndex: 1,
      dataIndex: currentIndex,
    });
  }
  const getData = () => {
    alarmGrid().then((res) => {
      let data: any = [];
      if (res.length > 8) {
        color.push(...getRandomColor(res.length));
      }
      barChartList.value = res.map((v, index) => {
        return {
          name: v.name,
          value: v.ratio,
          color: color[index],
          ratio: v.ratio,
        };
      });

      for (var i = 0; i < barChartList.value.length; i++) {
        data.push(
          {
            value: barChartList.value[i].value,
            name: barChartList.value[i].name,
            itemStyle: {
              normal: {
                borderWidth: 6,
                shadowBlur: 3,
                borderRadius: 0, // 圆角
                borderColor: color[i],
                shadowColor: color[i],
                color: color[i],
              },
            },
          },
          {
            value: 0,
            name: '',
            itemStyle: {
              normal: {
                label: {
                  show: false,
                },
                labelLine: {
                  show: false,
                },
                color: 'rgba(0, 0, 0, 0)',
                borderColor: 'rgba(0, 0, 0, 0)',
                borderWidth: 0,
              },
            },
          },
        );
      }
      var seriesOption = [
        {
          name: 'pie2',
          type: 'pie',
          radius: [48, 50],
          color: '#a9f5ffb9',
          label: {
            show: false,
          },
          labelLine: {
            show: false,
          },
          data: [1],
          silent: true,
        },
        {
          name: 'pie1',
          type: 'pie',
          radius: [65, 69],
          grid: {
            containLabel: true,
          },
          label: {
            show: false,
            position: 'center',
            formatter: '{c_style|{d}%}\n{b_style|{b}}',
            rich: {
              b_style: {
                fontSize: 13,
                fontWeight: 400,
                color: '#fff',
              },
              c_style: {
                padding: [0, 0, 10, 0],
                fontSize: 24,
                fontWeight: 'bold',
                color: '#fff',
              },
            },
          },
          emphasis: {
            label: {
              show: true,
              fontSize: '14',
              fontWeight: 'normal',
            },
          },
          labelLine: {
            show: false,
          },
          data: data,
        },
      ];
      option.value = {
        backgroundColor: 'transparent',
        color: color,
        tooltip: {
          show: false,
        },
        series: seriesOption,
      };
      setTimeout(() => {
        highlightPie(0, 1);
      }, 1000);
    });
  };
  onMounted(() => {
    getData();
  });
  const mouserOverC = (params) => {
    console.log(params);
    oldIndex = currentIndex;
    currentIndex = params.dataIndex;
    highlightPie(currentIndex, oldIndex);
  };

  //生成随机颜色
  const getRandomColor = (length) => {
    const color: any = [];
    for (let j = 0; j < length; j++) {
      let str = '#';
      const arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'];
      for (let i = 0; i < 6; i++) {
        const num = parseInt(Math.random() * 16);
        str += arr[num];
      }
      color.push(str);
    }
    return color;
  };
</script>

<style scoped lang="less">
  .right_cont4 {
    width: 390px;
    height: 180px;
    margin: 0 auto;
    overflow: hidden;
    margin-top: 20px;
    margin-left: 40px;
  }

  .myChart {
    width: 162px;
    height: 162px;
  }

  .right_cont4R {
    flex: 1;
    height: 100%;
    border-left: 2px solid;
    display: flex;
    flex-wrap: wrap;
    border-image: linear-gradient(
        0deg,
        rgba(255, 255, 255, 0) 0%,
        #ffffffb6 50%,
        rgba(255, 255, 255, 0) 100%
      )
      2 !important;
    margin-left: 15px;
    overflow-y: auto;
    padding: 0 20px;
    position: relative;
    justify-content: space-between;
  }

  .right_cont4R::-webkit-scrollbar {
    width: 0px !important;
    height: 0px !important;
  }

  .f_kc {
    width: 70px;
    height: 60px;
    position: relative;
    padding-left: 12px;
  }

  .f_k {
    width: 10px;
    height: 10px;
    background-color: #fdce5e;
    position: absolute;
    top: 5px;
    left: 1px;
  }

  .text_ {
    font-size: 12px;
    font-family: Source Han Sans CN;
    font-weight: 400;
    color: #ffffff;
    margin-left: 6px;
  }

  .text_ > div:nth-child(1) {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .text_ > div:nth-child(2) {
    margin-top: 10px;
  }

  .line {
    position: absolute;
    left: 6px;
    top: 16px;
    width: 11px;
    height: 23px;
    border: 1px solid #fff;
    border-right: none;
    border-top: none;
  }
</style>
