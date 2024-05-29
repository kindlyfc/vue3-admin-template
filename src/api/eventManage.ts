import { request } from '@/utils/request';

/**
 * @description 获取事件分页列表（PC）
 */
export function eventReportPage(params: any) {
  return request({
    url: '/v1/eventReport/page',
    method: 'get',
    params,
  });
}

/**
 * @description 获取事件详情（PC）
 */
export function eventReportDetails(params: any) {
  return request({
    url: '/v1/eventReport/details',
    method: 'get',
    params,
  });
}

/**
 * @description 编辑事件（PC）
 */
export function eventReportModify(data: any) {
  return request({
    url: '/v1/eventReport/modify',
    method: 'PUT',
    data,
  });
}

/**
 * @description 编辑事件（PC）
 */
export function eventReportFinished(params: any) {
  return request({
    url: '/v1/eventReport/finished',
    method: 'get',
    params,
  });
}

/**
 * @description 根据机构id获取设备列表
 */
export function deviceList(orgIds: any) {
  return request({
    url: '/v1/device/list?orgIds=' + orgIds,
    method: 'get',
  });
}

/**
 * @description 根据机构ID获取摄像头列表
 */
export function eventReportCameras(params) {
  return request({
    url: '/v1/eventReport/cameras',
    method: 'get',
    params
  });
}

/**
 * @description 获取播放地址
 */
export function getURIByDeviceId(deviceId: any) {
  return request({
    url: '/v1/open/camera/getURIByDeviceId?deviceId=' + deviceId,
    method: 'get',
  });
}
