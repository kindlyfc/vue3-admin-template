<template>
  <VChart class="right_cont1" ref="myChart" :option="option" autoresize id="right_cont1"> </VChart>
</template>
<script lang="ts" setup>
  import { ref, onMounted, onUnmounted } from 'vue';
  import { alarmThreetiy } from '@/api/statistics';
  import VChart from 'vue-echarts';
  import * as echarts from 'echarts';
  import dayjs from 'dayjs';

  const myChart = ref<any>();
  let timer: any = null;
  let xLabel = [];
  let levelData1 = [];
  let levelData2 = [];
  let levelData3 = [];
  let levelData4 = [];
  const option = ref<any>();
  const getData = () => {
    alarmThreetiy().then((res) => {
      xLabel = res[0]?.analysis.map((v) => {
        v.date = dayjs(v.date).format('DD');
        return v.date;
      });
      res.forEach((v) => {
        switch (v.level) {
          case 1:
            levelData1 = v.analysis.map((v) => v.num);
            break;
          case 2:
            levelData2 = v.analysis.map((v) => v.num);
            break;
          case 3:
            levelData3 = v.analysis.map((v) => v.num);
            break;
          case 4:
            levelData4 = v.analysis.map((v) => v.num);
            break;
          default:
            break;
        }
      });
      option.value = {
        backgroundColor: 'transparent',
        tooltip: {
          trigger: 'axis',
          backgroundColor: '#102138d5',
          borderWidth: 0,
          textStyle: {
            color: '#fff',
            fontSize: 12,
          },
          axisPointer: {
            lineStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: 'rgba(126,199,255,0)', // 0% 处的颜色
                  },
                  {
                    offset: 0.5,
                    color: 'rgba(126,199,255,1)', // 100% 处的颜色
                  },
                  {
                    offset: 1,
                    color: 'rgba(126,199,255,0)', // 100% 处的颜色
                  },
                ],
                global: false, // 缺省为 false
              },
              type: 'slider',
            },
          },
        },
        legend: {
          align: 'left',
          right: '2%',
          top: '-1%',
          type: 'plain',
          textStyle: {
            color: 'rgba(212, 232, 254, 1)',
            fontSize: 10,
          },
          icon: 'rect',
          itemGap: 10,
          itemWidth: 16,
          itemHeight: 3,
          itemStyle: {
            borderWidth: 0,
          },
          data: [
            {
              name: '一级',
            },
            {
              name: '二级',
            },
            {
              name: '三级',
            },
            {
              name: '四级',
            },
          ],
        },
        grid: {
          top: '12%',
          left: '10%',
          right: '4%',
          bottom: '10%',
          // containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            axisLine: {
              //坐标轴轴线相关设置。数学上的x轴
              show: true,
              lineStyle: {
                color: '#82A6D5 ',
              },
            },
            axisLabel: {
              //坐标轴刻度标签的相关设置
              textStyle: {
                color: '#7ec7ff',
                fontSize: 14,
              },
              formatter: function (data) {
                return data;
              },
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: 'transparent',
              },
            },
            axisTick: {
              show: false,
            },
            data: xLabel,
          },
        ],
        yAxis: [
          {
            name: '数量',
            nameTextStyle: {
              color: '#7ec7ff',
              fontSize: 12,
              padding: -6,
            },
            min: 0,
            splitLine: {
              show: true,
              lineStyle: {
                type: [10, 5],
                color: ['#82A6D5', '#7ec7ff'],
              },
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: 'transparent',
              },
            },
            axisLabel: {
              show: true,
              textStyle: {
                color: '#0e3e79',
              },
              formatter: function (value) {
                if (value === 0) {
                  return value;
                }
                return value;
              },
            },
            axisTick: {
              show: false,
            },
          },
        ],
        series: [
          {
            name: '一级',
            type: 'line',
            symbol: 'circle', // 默认是空心圆（中间是白色的），改成实心圆
            showAllSymbol: true,
            symbolSize: 0,
            smooth: true,
            lineStyle: {
              normal: {
                width: 2.5,
                color: '#CD142E', // 线条颜色
              },
              borderColor: 'rgba(0,0,0,.4)',
            },
            itemStyle: {
              color: '#CD142E',
              borderColor: '#fff',
              borderWidth: 2,
            },
            tooltip: {
              show: true,
            },
            areaStyle: {
              //区域填充样式
              normal: {
                //线性渐变，前4个参数分别是x0,y0,x2,y2(范围0~1);相当于图形包围盒中的百分比。如果最后一个参数是‘true’，则该四个值是绝对像素位置。
                color: new echarts.graphic.LinearGradient(
                  0,
                  0,
                  0,
                  1,
                  [
                    {
                      offset: 0,
                      color: 'rgba(205, 20, 46, 0.3)',
                    },
                    {
                      offset: 1,
                      color: 'rgba(205, 20, 46, 0)',
                    },
                  ],
                  false,
                ),
                shadowColor: 'rgba(205, 20, 46, 0.5)', //阴影颜色
                shadowBlur: 20, //shadowBlur设图形阴影的模糊大小。配合shadowColor,shadowOffsetX/Y, 设置图形的阴影效果。
              },
            },
            data: levelData1,
          },
          {
            name: '二级',
            type: 'line',
            symbol: 'circle', // 默认是空心圆（中间是白色的），改成实心圆
            showAllSymbol: true,
            symbolSize: 0,
            smooth: true,
            lineStyle: {
              normal: {
                width: 2.5,
                color: 'rgba(251, 190, 5, 1)', // 线条颜色
              },
              borderColor: 'rgba(0,0,0,.4)',
            },
            itemStyle: {
              color: 'rgba(251, 190, 5, 1)',
              borderColor: '#fff',
              borderWidth: 2,
            },
            tooltip: {
              show: true,
            },
            areaStyle: {
              //区域填充样式
              normal: {
                //线性渐变，前4个参数分别是x0,y0,x2,y2(范围0~1);相当于图形包围盒中的百分比。如果最后一个参数是‘true’，则该四个值是绝对像素位置。
                color: new echarts.graphic.LinearGradient(
                  0,
                  0,
                  0,
                  1,
                  [
                    {
                      offset: 0,
                      color: 'rgba(251, 190, 5,  0.3)',
                    },
                    {
                      offset: 1,
                      color: 'rgba(251, 190, 5,  0)',
                    },
                  ],
                  false,
                ),
                shadowColor: 'rgba(251, 190, 5,  0.5)', //阴影颜色
                shadowBlur: 20, //shadowBlur设图形阴影的模糊大小。配合shadowColor,shadowOffsetX/Y, 设置图形的阴影效果。
              },
            },
            data: levelData2,
          },
          {
            name: '三级',
            type: 'line',
            symbol: 'circle', // 默认是空心圆（中间是白色的），改成实心圆
            showAllSymbol: true,
            symbolSize: 0,
            smooth: true,
            lineStyle: {
              normal: {
                width: 2.5,
                color: '#01E8FD', // 线条颜色
              },
              borderColor: 'rgba(0,0,0,.4)',
            },
            itemStyle: {
              color: '#01E8FD',
              borderColor: '#fff',
              borderWidth: 2,
            },
            tooltip: {
              show: true,
            },
            areaStyle: {
              //区域填充样式
              normal: {
                //线性渐变，前4个参数分别是x0,y0,x2,y2(范围0~1);相当于图形包围盒中的百分比。如果最后一个参数是‘true’，则该四个值是绝对像素位置。
                color: new echarts.graphic.LinearGradient(
                  0,
                  0,
                  0,
                  1,
                  [
                    {
                      offset: 0,
                      color: 'rgba(1, 230, 252, 0.3)',
                    },
                    {
                      offset: 1,
                      color: 'rgba(1, 230, 252, 0)',
                    },
                  ],
                  false,
                ),
                shadowColor: 'rgba(1, 230, 252, 0.5)', //阴影颜色
                shadowBlur: 20, //shadowBlur设图形阴影的模糊大小。配合shadowColor,shadowOffsetX/Y, 设置图形的阴影效果。
              },
            },
            data: levelData3,
          },
          {
            name: '四级',
            type: 'line',
            symbol: 'circle', // 默认是空心圆（中间是白色的），改成实心圆
            showAllSymbol: true,
            symbolSize: 0,
            smooth: true,
            lineStyle: {
              normal: {
                width: 2.5,
                color: '#EEB90D', // 线条颜色
              },
              borderColor: 'rgba(0,0,0,.4)',
            },
            itemStyle: {
              color: '#EEB90D',
              borderColor: '#fff',
              borderWidth: 2,
            },
            tooltip: {
              show: true,
            },
            areaStyle: {
              //区域填充样式
              normal: {
                //线性渐变，前4个参数分别是x0,y0,x2,y2(范围0~1);相当于图形包围盒中的百分比。如果最后一个参数是‘true’，则该四个值是绝对像素位置。
                color: new echarts.graphic.LinearGradient(
                  0,
                  0,
                  0,
                  1,
                  [
                    {
                      offset: 0,
                      color: 'rgba(238, 185, 13, 0.3)',
                    },
                    {
                      offset: 1,
                      color: 'rgba(238, 185, 13, 0)',
                    },
                  ],
                  false,
                ),
                shadowColor: 'rgba(238, 185, 13, 0.5)', //阴影颜色
                shadowBlur: 20, //shadowBlur设图形阴影的模糊大小。配合shadowColor,shadowOffsetX/Y, 设置图形的阴影效果。
              },
            },
            data: levelData4,
          },
        ],
      };
      let len = 0;
      timer = setInterval(() => {
        if (len === xLabel.length) {
          len = 0;
        }
        myChart.value.dispatchAction({
          type: 'showTip',
          seriesIndex: 0,
          dataIndex: len,
        });
        len++;
      }, 2600);
    });
  };
  onMounted(() => {
    getData();
  });

  onUnmounted(() => {
    clearInterval(timer);
    timer = null;
  });
</script>

<style scoped lang="less">
  .right_cont1 {
    width: 395px;
    height: 190px;
    margin: 0 auto;
    margin-left: 20px;
    margin-top: 10px;
    color: #102138d5;
  }
</style>
