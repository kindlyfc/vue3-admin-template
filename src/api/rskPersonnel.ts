import { request } from '@/utils/request';

//=========工单管理==========
/**
 * @description 下发运维人员列表
 */
export function operationsUserList(data) {
  return request({
    url: '/v1/workOrder/operationsUserList',
    method: 'get',
    params: data
  });
}
/**
 * @description 下发运维人员列表级联
 */
export function operaUserList() {
  return request({
    url: '/v1//msg/choose',
    method: 'get',
  });
}

/**
 * @description 告警列表
 */
export function warnList(data) {
  return request({
    url: '/v1/workOrder/warnList',
    method: 'get',
    params: data
  });
}

/**
 * @description 工单分页
 */
export function pageList(data) {
  return request({
    url: '/v1/workOrder/page',
    method: 'get',
    params: data
  });
}

/**
 * @description 工单下发
 */
export function downSend(data) {
  return request({
    url: '/v1/workOrder/downSend',
    method: 'post',
    data
  });
}

/**
 * @description 新增工单
 */
export function addWorkOder(data) {
  return request({
    url: '/v1/workOrder/add',
    method: 'post',
    data
  });
}
/**
 * @description 工单详情
 */
export function workDetail(id) {
  return request({
    url: `/v1/workOrder/workOrder/${id}`,
    method: 'get',
  });
}

/**
 * @description 工单删除
 */
export function workDelet(id) {
  return request({
    url: `/v1/workOrder/${id}`,
    method: 'DELETE',
  });
}


/**
 * @description 工单编辑
 */
export function workUpdate(data) {
  return request({
    url: `/v1/workOrder/update`,
    method: 'put',
    data
  });
}

//=========工单管理==========





//=========区域管理==========

/**
 * @description 区域分页
 */
export function gridList(data) {
  return request({
    url: '/v1/grid/page',
    method: 'get',
    params: data
  });
}


/**
 * @description 新增区域
 */
export function gridAdd(data) {
  return request({
    url: '/v1/grid/add',
    method: 'post',
    data
  });
}

/**
 * @description 编辑区域
 */
export function gridupdate(data) {
  return request({
    url: '/v1/grid/update',
    method: 'put',
    data
  });
}

/**
 * @description 详情区域
 */
export function detailGrid(id) {
  return request({
    url: `/v1/grid/${id}`,
    method: 'get',
  });
}
/**
 * @description 详情删除
 */
export function deletGrid(id) {
  return request({
    url: `/v1/grid/${id}`,
    method: 'post',
  });
}


/**
 * @description 区域人员
 */
export function bindOperationsUserList(data) {
  return request({
    url: `/v1/workOrder/bindOperationsUserList`,
    method: 'get',
    params: data
  });
}


/**
 * @description 人员绑定
 */
export function bindUser(data) {
  return request({
    url: `/v1/grid/bindUser`,
    method: 'put',
    data
  });
}



/**
 * @description 设备下列表
 */
export function deviceList(data) {
  return request({
    url: `/v1/grid/deviceList`,
    method: 'get',
    params: data
  });
}


/**
 * @description 设备绑定
 */
export function bindDevice(data) {
  return request({
    url: `/v1/grid/bindDevice`,
    method: 'put',
    data
  });
}
/**
 * @description 区域总览
 */
export function allGridData() {
  return request({
    url: `/v1/grid/overview`,
    method: 'get',
  });
}
//=========区域管理==========
