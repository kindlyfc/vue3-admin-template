import { request } from '@/utils/request';

/**
 * @description 
 */
export function getWarningStatistics() {
  return request({
    url: '/v1/alert/preWarning/statistics',
    method: 'get',
  });
}
/**
 * @description 人员通行趋势
 */
export function humanTrafficTrend(params) {
  return request({
    url: '/v1/humanTraffic/trend',
    method: 'get',
    params
  });
}
/**
 * @description 人数统计
 */
export function humanTrafficStatistics(params) {
  return request({
    url: '/v1/humanTraffic/statistics',
    method: 'get',
    params
  });
}



/* ====================电监测一张图==================== */

/**
 * @description 当年数据总览
 */
export function overView() {
  return request({
    url: '/v1/oneMap/overView',
    method: 'get',
  });
}


/**
 * @description 终端设备统计
 */
export function deviceCount() {
  return request({
    url: '/v1/analysis/device/count',
    method: 'get',
  });
}


/**
 * @description 近7天告警排查
 */
export function alarmSeven() {
  return request({
    url: '/v1/analysis/alarm/7',
    method: 'get',
  });
}

/**
 * @description 近一个月告警趋势
 */
export function alarmThreetiy() {
  return request({
    url: '/v1/analysis/alarm/30',
    method: 'get',
  });
}
/**
 * @description 告警规则一览
 */
export function ruleLan() {
  return request({
    url: '/v1/analysis/alarm/rule',
    method: 'get',
  });
}
/**
 * @description 当月各分区告警占比
 */
export function alarmGrid() {
  return request({
    url: '/v1/analysis/alarm/grid',
    method: 'get',
  });
}
/**
 * @description 地图（最外层）
 */
export function mapCont1() {
  return request({
    url: '/v1/analysis/map/1',
    method: 'get',
  });
}
/**
 * @description 地图（最内层）
 */
export function mapCont2(id) {
  return request({
    url: `/v1/analysis/map/2?gridId=${id}`,
    method: 'get',
  });
}
/**
 * @description 地图（最底部）
 */
export function mapCont3() {
  return request({
    url: '/v1/analysis/map/bottom',
    method: 'get',
  });
}
/**
 * @description 当月工单处理top
 */
export function orderRank() {
  return request({
    url: '/v1/oneMap/orderRank',
    method: 'get',
  });
}

/**
 * @description 网格下的人员统计
 */
export function gridUserCount(data) {
  return request({
    url: '/v1/oneMap/gridUserCount',
    method: 'get',
    params: data
  });
}
/**
 * @description 网格下的人员列表
 */
export function gridUserList(data) {
  return request({
    url: '/v1/oneMap/gridUserList',
    method: 'get',
    params: data
  });
}
/* ====================电监测一张图==================== */
