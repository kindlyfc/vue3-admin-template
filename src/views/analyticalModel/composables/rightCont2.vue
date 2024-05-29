<template>
  <VChart class="right_cont1" ref="myChart" :option="option" autoresize id="right_cont1"> </VChart>
</template>
<script lang="ts" setup>
  import { ref, onMounted, onUnmounted } from 'vue';
  import { alarmSeven } from '@/api/statistics';
  import VChart from 'vue-echarts';
  import * as echarts from 'echarts';
  import dayjs from 'dayjs';

  const myChart = ref<any>();
  let timer: any = null;
  let xLabel = [];
  let levelData1: any = [];
  let levelData2: any = [];
  const offsetX = 6;
  const offsetY = 3;
  // 绘制左侧面
  const CubeLeft = echarts.graphic.extendShape({
    shape: {
      x: 0,
      y: 0,
    },
    buildPath: function (ctx: any, shape) {
      // 会canvas的应该都能看得懂，shape是从custom传入的
      const xAxisPoint = shape.xAxisPoint;
      const c0 = [shape.x, shape.y];
      const c1 = [shape.x - offsetX, shape.y - offsetY];
      const c2 = [xAxisPoint[0] - offsetX, xAxisPoint[1] - offsetY];
      const c3 = [xAxisPoint[0], xAxisPoint[1]];
      ctx
        .moveTo(c0[0], c0[1])
        .lineTo(c1[0], c1[1])
        .lineTo(c2[0], c2[1])
        .lineTo(c3[0], c3[1])
        .closePath();
    },
  });

  // 绘制右侧面
  const CubeRight = echarts.graphic.extendShape({
    shape: {
      x: 0,
      y: 0,
    },
    buildPath: function (ctx: any, shape) {
      const xAxisPoint = shape.xAxisPoint;
      const c1 = [shape.x, shape.y];
      const c2 = [xAxisPoint[0], xAxisPoint[1]];
      const c3 = [xAxisPoint[0] + offsetX, xAxisPoint[1] - offsetY];
      const c4 = [shape.x + offsetX, shape.y - offsetY];
      ctx
        .moveTo(c1[0], c1[1])
        .lineTo(c2[0], c2[1])
        .lineTo(c3[0], c3[1])
        .lineTo(c4[0], c4[1])
        .closePath();
    },
  });

  // 绘制顶面
  const CubeTop = echarts.graphic.extendShape({
    shape: {
      x: 0,
      y: 0,
    },
    buildPath: function (ctx: any, shape) {
      const c1 = [shape.x, shape.y];
      const c2 = [shape.x + offsetX, shape.y - offsetY]; //右点
      const c3 = [shape.x, shape.y - offsetX];
      const c4 = [shape.x - offsetX, shape.y - offsetY];
      ctx
        .moveTo(c1[0], c1[1])
        .lineTo(c2[0], c2[1])
        .lineTo(c3[0], c3[1])
        .lineTo(c4[0], c4[1])
        .closePath();
    },
  });

  // 注册三个面图形
  echarts.graphic.registerShape('CubeLeft', CubeLeft);
  echarts.graphic.registerShape('CubeRight', CubeRight);
  echarts.graphic.registerShape('CubeTop', CubeTop);
  const option = ref<any>({});
  const getData = () => {
    alarmSeven().then((res) => {
      xLabel = res.map((v) => {
        v.date = dayjs(v.date).format('DD');
        return v.date;
      });
      levelData1 = res.map((v) => v.cameras);
      levelData2 = res.map((v) => v.ups);

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
              name: '摄像机',
            },
            {
              name: 'UPS',
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
                padding: 7,
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
            name: '摄像机',
            type: 'custom',
            itemStyle: {
              normal: {
                color: '#16ecff',
              },
            },
            renderItem: (params, api) => {
              const location = api.coord([api.value(0), api.value(1)]);
              return {
                type: 'group',
                x: -4,
                children: [
                  {
                    type: 'CubeLeft',
                    shape: {
                      api,
                      xValue: api.value(0),
                      yValue: api.value(1),
                      x: location[0],
                      y: location[1],
                      xAxisPoint: api.coord([api.value(0), 0]),
                    },
                    style: {
                      fill: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        {
                          offset: 0,
                          color: '#00d7eb',
                        },

                        {
                          offset: 1,
                          color: '#1ccada8a',
                        },
                      ]),
                    },
                  },
                  {
                    type: 'CubeRight',
                    shape: {
                      api,
                      xValue: api.value(0),
                      yValue: api.value(1),
                      x: location[0],
                      y: location[1],
                      xAxisPoint: api.coord([api.value(0), 0]),
                    },
                    style: {
                      fill: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        {
                          offset: 0,
                          color: '#127680',
                        },

                        {
                          offset: 1,
                          color: '#1099a58a',
                        },
                      ]),
                    },
                  },
                  {
                    type: 'CubeTop',
                    shape: {
                      api,
                      xValue: api.value(0),
                      yValue: api.value(1),
                      x: location[0],
                      y: location[1],
                      xAxisPoint: api.coord([api.value(0), 0]),
                    },
                    style: {
                      fill: '#04d0e2',
                    },
                  },
                ],
              };
            },
            data: levelData1,
          },
          {
            name: 'UPS',
            type: 'custom',
            itemStyle: {
              normal: {
                color: '#35add8',
              },
            },
            renderItem: (params, api) => {
              const location = api.coord([api.value(0), api.value(1)]);
              var color =
                api.value(1) > 10000
                  ? 'red'
                  : new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                      {
                        offset: 0,
                        color: '#5cc4eb',
                      },
                      {
                        offset: 0.8,
                        color: '#21658c',
                      },
                    ]);
              return {
                type: 'group',
                x: 10,
                children: [
                  {
                    type: 'CubeLeft',
                    shape: {
                      api,
                      xValue: api.value(0),
                      yValue: api.value(1),
                      x: location[0],
                      y: location[1],
                      xAxisPoint: api.coord([api.value(0), 0]),
                    },
                    style: {
                      fill: (color =
                        api.value(1) > 10000
                          ? 'red'
                          : new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                              {
                                offset: 0,
                                color: '#5cc4eb',
                              },
                              {
                                offset: 0.8,
                                color: '#21658c',
                              },
                            ])),
                    },
                  },
                  {
                    type: 'CubeRight',
                    shape: {
                      api,
                      xValue: api.value(0),
                      yValue: api.value(1),
                      x: location[0],
                      y: location[1],
                      xAxisPoint: api.coord([api.value(0), 0]),
                    },
                    style: {
                      fill: (color =
                        api.value(1) > 10000
                          ? 'red'
                          : new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                              {
                                offset: 0,
                                color: '#048fd4',
                              },
                              {
                                offset: 0.8,
                                color: '#195684',
                              },
                            ])),
                    },
                  },
                  {
                    type: 'CubeTop',
                    shape: {
                      api,
                      xValue: api.value(0),
                      yValue: api.value(1),
                      x: location[0],
                      y: location[1],
                      xAxisPoint: api.coord([api.value(0), 0]),
                    },
                    style: {
                      fill: (color =
                        api.value(1) > 10000
                          ? 'red'
                          : new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                              {
                                offset: 0,
                                color: '#65c7ec',
                              },
                              {
                                offset: 1,
                                color: '#65c7ec',
                              },
                            ])),
                    },
                  },
                ],
              };
            },

            data: levelData2,
          },
        ],
      };

      let len = 0;
      timer = setInterval(() => {
        if (len === xLabel?.length) {
          len = 0;
        }
        myChart.value.dispatchAction({
          type: 'showTip',
          seriesIndex: 0,
          dataIndex: len,
          show: true,
        });
        len++;
      }, 1600);
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
    color: #35add8;
  }
</style>
