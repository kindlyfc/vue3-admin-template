<template>
  <div class="left_cont3">
    <div id="left_cont3"></div>
    <!-- <VChart id="left_cont3" ref="myChart" :option="option" autoresize /> -->
    <img class="dz" src="@/assets/images/dp/dz.png" />
  </div>
</template>
<script lang="ts" setup>
  import { ref, nextTick, onMounted } from 'vue';
  import * as echarts from 'echarts';
  import 'echarts-gl';
  import { deviceCount } from '@/api/statistics';
  function getParametricEquation(startRatio, endRatio, isSelected, isHovered, k, height, i) {
    // 计算
    let midRatio = (startRatio + endRatio) / 2;

    let startRadian = startRatio * Math.PI * 2;
    let endRadian = endRatio * Math.PI * 2;
    let midRadian = midRatio * Math.PI * 2;

    // 如果只有一个扇形，则不实现选中效果。
    if (startRatio === 0 && endRatio === 1) {
      isSelected = false;
    }

    // 通过扇形内径/外径的值，换算出辅助参数 k（默认值 1/3）
    k = typeof k !== 'undefined' ? k : 1 / 3;

    // 计算选中效果分别在 x 轴、y 轴方向上的位移（未选中，则位移均为 0）
    let offsetX = isSelected ? Math.cos(midRadian) * 0.1 : 0;
    let offsetY = isSelected ? Math.sin(midRadian) * 0.1 : 0;
    let offsetZ = i == 1 ? 2 : 0;
    // 计算高亮效果的放大比例（未高亮，则比例为 1）
    let hoverRate = isHovered ? 1.05 : 1;

    // 返回曲面参数方程
    return {
      u: {
        min: -Math.PI,
        max: Math.PI * 3,
        step: Math.PI / 32,
      },

      v: {
        min: 0,
        max: Math.PI * 2,
        step: Math.PI / 20,
      },

      x: function (u, v) {
        if (u < startRadian) {
          return offsetX + Math.cos(startRadian) * (1 + Math.cos(v) * k) * hoverRate;
        }
        if (u > endRadian) {
          return offsetX + Math.cos(endRadian) * (1 + Math.cos(v) * k) * hoverRate;
        }
        return offsetX + Math.cos(u) * (1 + Math.cos(v) * k) * hoverRate;
      },

      y: function (u, v) {
        if (u < startRadian) {
          return offsetY + Math.sin(startRadian) * (1 + Math.cos(v) * k) * hoverRate;
        }
        if (u > endRadian) {
          return offsetY + Math.sin(endRadian) * (1 + Math.cos(v) * k) * hoverRate;
        }
        return offsetY + Math.sin(u) * (1 + Math.cos(v) * k) * hoverRate;
      },

      z: function (u, v) {
        if (u < -Math.PI * 0.5) {
          return Math.sin(u);
        }
        if (u > Math.PI * 2.5) {
          return Math.sin(u);
        }
        return Math.sin(v) > 0 ? 1 * height : -1;
      },
    };
  }
  // 生成模拟 3D 饼图的配置项
  function getPie3D(pieData, internalDiameterRatio) {
    let series: any = [];
    let sumValue: any = 0;
    let startValue: any = 0;
    let endValue: any = 0;
    let legendData: any = [];
    let k =
      typeof internalDiameterRatio !== 'undefined'
        ? (1 - internalDiameterRatio) / (1 + internalDiameterRatio)
        : 1 / 3;

    // 为每一个饼图数据，生成一个 series-surface 配置
    for (let i = 0; i < pieData.length; i++) {
      sumValue += pieData[i].value;

      let seriesItem: any = {
        name: typeof pieData[i].name === 'undefined' ? `series${i}` : pieData[i].name,
        type: 'surface',
        parametric: true,
        wireframe: {
          show: false,
        },
        pieData: pieData[i],
        pieStatus: {
          selected: false,
          hovered: false,
          k: k,
        },
      };

      if (typeof pieData[i].itemStyle != 'undefined') {
        let itemStyle: any = {};

        typeof pieData[i].itemStyle.color != 'undefined'
          ? (itemStyle.color = pieData[i].itemStyle.color)
          : null;
        itemStyle.opacity = 1000000000000;
        seriesItem.itemStyle = itemStyle;
      }
      series.push(seriesItem);
    }

    // 使用上一次遍历时，计算出的数据和 sumValue，调用 getParametricEquation 函数，
    // 向每个 series-surface 传入不同的参数方程 series-surface.parametricEquation，也就是实现每一个扇形。
    for (let i = 0; i < series.length; i++) {
      endValue = startValue + series[i].pieData.value;
      console.log(series[i]);
      series[i].pieData.startRatio = startValue / sumValue;
      series[i].pieData.endRatio = endValue / sumValue;
      series[i].parametricEquation = getParametricEquation(
        series[i].pieData.startRatio,
        series[i].pieData.endRatio,
        false,
        false,
        k,
        // 调整扇形高度
        i === 0 ? 10 : 10,
        i,
      );

      startValue = endValue;

      legendData.push(series[i].name);
    }
    return series;
  }
  // 传入数据生成 option
  const optionsData = ref<any>([]);

  // 折线图
  const chart = ref<any>();
  const initChart = (option) => {
    nextTick(async () => {
      chart.value = echarts.init(document.getElementById('left_cont3') as any);
      // chart.showLoading({ text: '加载中...' })
      chart.value?.setOption(option);
      // chart.hideLoading()
    });
  };
  //获取数据
  const getData = () => {
    deviceCount().then((res) => {
      optionsData.value = [
        {
          name: 'UPS',
          value: res.ups || 0,
          itemStyle: {
            color: '#306eff',
          },
        },

        {
          name: '摄像机',
          value: res.cameras || 0,
          itemStyle: {
            color: '#00D7E9',
          },
        },
      ];
      const series = getPie3D(optionsData.value, 0); // 可做为调整内环大小 0为实心圆饼图，大于0 小于1 为圆环
      series.push({
        name: 'pie2d',
        type: 'pie',
        label: {
          opacity: 1,
          fontSize: 14,
          lineHeight: 20,
          textStyle: {
            fontSize: 14,
            color: '#00D7E9',
          },
        },
        labelLine: {
          length: 22,
          length2: 30,
          width: 4,
        },
        startAngle: -30, //起始角度，支持范围[0, 360]。
        clockwise: false, //饼图的扇区是否是顺时针排布。上述这两项配置主要是为了对齐3d的样式
        radius: ['60%', '50%'],
        center: ['50%', '56%'],
        data: optionsData.value,
        itemStyle: {
          opacity: 0,
        },
      });
      // 准备待返回的配置项，把准备好的 legendData、series 传入。
      let option = {
        legend: {
          show: true,
          tooltip: {
            show: true,
          },
          orient: 'vertical',
          data: ['UPS', '摄像机'],
          itemGap: 14,
          itemHeight: 8,
          itemWidth: 17,
          right: '0%',
          top: '13%',
          textStyle: {
            color: '#fff',
            fontSize: 12,
          },
        },
        animation: true,
        tooltip: {
          formatter: (params) => {
            if (params.seriesName !== 'mouseoutSeries' && params.seriesName !== 'pie2d') {
              return `${
                params.seriesName
              }<br/><span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${
                params.color
              };"></span>${option.series[params.seriesIndex].pieData.value + '个'}`;
            }
          },
          textStyle: {
            fontSize: 14,
          },
        },
        title: {
          x: 'center',
          top: '20',
          textStyle: {
            color: '#fff',
            fontSize: 22,
          },
        },
        backgroundColor: 'transparent',
        labelLine: {
          show: true,
          lineStyle: {
            color: '#7BC0CB',
          },
          normal: {
            show: true,
            length: 10,
            length2: 10,
          },
        },
        label: {
          show: true,
          position: 'outside',
          formatter: '{b} \n{d}%',
          textStyle: {
            color: '#fff',
            fontSize: '14px',
          },
        },
        xAxis3D: {
          min: -1,
          max: 1,
        },
        yAxis3D: {
          min: -1,
          max: 1,
        },
        zAxis3D: {
          min: -1,
          max: 1,
        },
        grid3D: {
          show: false,
          boxHeight: 3,
          //top: '30%',
          left: '4%',
          bottom: '50%',
          // environment: "rgba(255,255,255,0)" ,
          viewControl: {
            distance: 255,
            alpha: 18,
            beta: 20,
            autoRotate: true, // 自动旋转
          },
        },
        series: series,
      };
      initChart(option);
    });
  };
  onMounted(() => {
    getData();
  });
</script>

<style scoped>
  .left_cont3 {
    position: relative;
    height: 185px;
  }

  #left_cont3 {
    width: 390px;
    height: 185px;
    position: absolute;
    left: 6px;
    top: -12px;
    z-index: 1000000000;
  }

  .dz {
    position: absolute;
    width: 223px;
    height: 86px;
    top: 62px;
    left: 105px;
  }
</style>
