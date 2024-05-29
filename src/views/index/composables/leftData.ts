import { reactive, ref, nextTick } from 'vue'
import { getOrgpage } from '@/api/systemManagement';
import { getWarningStatistics, humanTrafficTrend, humanTrafficStatistics } from '@/api/statistics';
// import * as echarts from 'echarts';
import dayjs from 'dayjs';
import router from '@/router';
export default function useLeftData() {
  //上方组织筛选
  const orgList = ref<any>([]);
  const orgId = ref<string>('')
  const getOrgName = async (value?: string) => {
    const params: any = {
      current: 1,
      size: 50,
      name: value || '',
    };
    const res = await getOrgpage(params);
    orgList.value = res.records.map((v) => {
      return {
        value: v.id,
        label: v.name,
      };
    });
    orgId.value = res.records[0].id

    getHumanTrafficStatisticsData()
    initChart()
  };
  getOrgName()
  const orgChange = (value: string) => {
    getHumanTrafficStatisticsData()
    // initChart()
  };

  // 获取预警信息统计数据
  const warningData = reactive<any>({})
  const getWartningStatisticsData = async () => {
    const res = await getWarningStatistics()
    Object.assign(warningData, res)
  }
  getWartningStatisticsData()

  // 获取人流量统计数据
  const humanTrafficData = ref<any>({})
  const cameraGroups = ref<any[]>([])
  const getHumanTrafficStatisticsData = async () => {
    cameraGroups.value = []
    const res = await humanTrafficStatistics({ orgId: orgId.value, date: dayjs().format('YYYY-MM-DD') })
    // const res = {
    //   "realTime": 4,
    //   "total": 4,
    //   "cameraCounts": [...new Array(10)].map((_, index) => ({
    //     "count": index + 1,
    //     "name": "测试" + index,
    //     "id": index
    //   }))
    // }
    // 将res中的cameraCounts,按顺序8项为一组，放入cameraGroups中
    const cameraCounts = res.cameraCounts
    const len = cameraCounts.length
    const groupNum = Math.ceil(len / 8)
    for (let i = 0; i < groupNum; i++) {
      cameraGroups.value.push(cameraCounts.slice(i * 8, (i + 1) * 8))
    }
    humanTrafficData.value = res
  }

  // 折线图
  const initChart = () => {
    // nextTick(async () => {
    //   const chart = echarts.init(document.getElementById('lineChart') as any);
    //   chart.showLoading({ text: '加载中...' })

    //   const trendData = await humanTrafficTrend({ orgId: orgId.value, date: dayjs().format('YYYY-MM-DD') })
    //   const xData = trendData.map((v: any) => v.time)
    //   const yData = trendData.map((v: any) => v.count)

    //   const option = {
    //     xAxis: {
    //       type: 'category',
    //       boundaryGap: false,
    //       data: xData
    //     },
    //     grid: {
    //       left: '10%',
    //       top: '10%',
    //       bottom: '18%',
    //       right: '10%',
    //     },
    //     yAxis: {
    //       type: 'value'
    //     },
    //     tooltip: {
    //       trigger: 'axis'
    //     },
    //     series: [
    //       {
    //         data: yData,
    //         name: '人数',
    //         type: 'line',
    //         areaStyle: {
    //           color: '#92ACE44D'
    //         },
    //       }
    //     ]
    //   };

    //   chart.setOption(option);
    //   chart.hideLoading()
    // })
  }

  //预警跳转
  const goPage = (data: any) => {
    let detailNum
    switch (data.classes) {
      case 'RISK_PERSON'://风险人员
        detailNum = 1
        break;
      case 'PRACTITIONER'://从业规范
        detailNum = 2
        break;
      case 'PAPERS'://挂证预警
        detailNum = 3
        break;
      case 'FIRESAFE'://消防预警
        detailNum = 4
        break;
      default:
        break;
    }
    switch (data.classes) {
      case 'PATROL_TASK'://消防缺卡
        router.push(`/inspection/inspectionRecord`);
        break;

      default:
        router.push(`/practiceSandard/normotiveWarn?detailNum=${detailNum}&typeCode=${data.name}`);
        break;
    }
  }

  return {
    initChart,
    getOrgName,
    orgChange,
    goPage,
    orgList,
    orgId,
    warningData,
    humanTrafficData,
    cameraGroups,
  }
}