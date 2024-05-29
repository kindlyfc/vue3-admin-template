/**
 * @description 获取告警分页列表
 */

import { request } from '@/utils/request';

export function getAlarmRuleList(params) {
  return request({
    url: '/v1/device/alarm/page',
    method: 'get',
    params,
  });
}
/**
 * @description 告警转无线效
 */
export function invalid(ids) {
  return request({
    url: `/v1/device/alarm/invalid?ids=${ids.join(',')}`,
    method: 'get',
  });
}


/**
 * @description 设备分页
 */
export function devicePage(data) {
  return request({
    url: `/v1/device/page`,
    method: 'get',
    params: data
  });
}

/**
 * @description 分页查询告警规则
 */
export function rulesPage(data) {
  return request({
    url: `/v1/device/alarm/rule/page`,
    method: 'get',
    params: data
  });
}
/**
 * @description 获取告警规则设置详情
 */
export function deviceRule(data) {
  return request({
    url: `/v1/device/alarm/rule/settings`,
    method: 'get',
    params: data
  });
}


/**
 * @description 设置告警规则
 */
export function setRules(data) {
  return request({
    url: `/v1/device/alarm/rule`,
    method: 'post',
    data
  });
}
/**
 * @description 批量删除告警规则
 */
export function deleteRules(data) {
  return request({
    url: `/v1/device/alarm/rule`,
    method: 'DELETE',
    data
  });
}

/**
 * @description 开启或关闭规则
 */
export function OCRules(data) {
  return request({
    url: `/v1/device/alarm/rule`,
    method: 'put',
    data
  });
}


/**
 * @description 获取规则条件列表
 */
export function conditions() {
  return request({
    url: `/v1/device/alarm/rule/conditions`,
    method: 'get',
  });
}

/**
 * @description 取连接条件列表
 */
export function joinConds() {
  return request({
    url: `/v1/device/alarm/rule/joinConds`,
    method: 'get',
  });
}


/**
 * @description 获取UPS告警时的数据
 */
export function condData(data) {
  return request({
    url: `/v1/device/alarm/ups/data`,
    method: 'get',
    params: data
  });
}

/**
 * @description 获取可配置规则的设备列表
 */
export function availableDevices() {
  return request({
    url: `/v1/device/alarm/rule/availableDevices`,
    method: 'get',
  });
}

/**
 * @description 获取可配置规则的设备列表
 */
export function ruleDetail(data) {
  return request({
    url: `/v1/device/alarm/rule/settings`,
    method: 'get',
    params: data
  });
}
//==========设备/数据配置=========
/**
 * @description 获取数据配置分页列表
 */
export function dataConfigPage(data) {
  return request({
    url: `/v1/device/ups/config/page`,
    method: 'get',
    params: data
  });
}
/**
 * @description 获取UPS数据配置参数列表
 */
export function configParams(data) {
  return request({
    url: `/v1/device/ups/config/params`,
    method: 'get',
    params: data
  });
}
/**
 * @description 添加设备
 */
export function addDevice(data) {
  return request({
    url: `/v1/device`,
    method: 'post',
    data
  });
}
/**
 * @description 删除设备
 */
export function deleteDevice(data) {
  return request({
    url: `/v1/device`,
    method: 'DELETE',
    data
  });
}
/**
 * @description 编辑设备
 */
export function upodateDevice(data) {
  return request({
    url: `/v1/device`,
    method: 'PUT',
    data
  });
}

/**
 * @description 新增UPS配置
 */
export function addConfig(data) {
  return request({
    url: `/v1/device/ups/config`,
    method: 'post',
    data
  });
}
/**
 * @description 修改配置
 */
export function updDataConfig(data) {
  return request({
    url: `/v1/device/ups/config`,
    method: 'put',
    data
  });
}

/**
 * @description 指令下发
 */
export function ConfigCmd(data) {
  return request({
    url: `/v1/device/ups/cmd`,
    method: 'post',
    data
  });
}

/**
 * @description 获取参数类型
 */
export function ConfigTypes() {
  return request({
    url: `/v1/device/ups/config/params/types`,
    method: 'get',
  });
}

/**
 * @description 新增UPS配置
 */
export function configUPS(data) {
  return request({
    url: `/v1/device/ups/config`,
    method: 'post',
    data
  });
}
/**
 * @description 修改UPS数据配置
 */
export function upDateconfigUPS(data) {
  return request({
    url: `/v1/device/ups/config`,
    method: 'put',
    data
  });
}
/**
 * @description 删除数据配置
 */
export function deleteconfigUPS(data) {
  return request({
    url: `/v1/device/ups/config/params`,
    method: 'DELETE',
    data
  });
}
/**
 * @description 获取UPS数据配置参数列表
 */
export function getParams(data) {
  return request({
    url: `/v1/device/ups/config/params`,
    method: 'get',
    params: data
  });
}

/**
 * @description 下发
 */
export function sendCmd(data) {
  return request({
    url: `/v1/device/ups/cmd`,
    method: 'post',
    data
  });
}

/**
 * @description 批量新增数据配置参数
 */
export function addParams(data) {
  return request({
    url: `/v1/device/ups/config/params`,
    method: 'post',
    data
  });
}

/**
 * @description 获取告警等级
 */
export function getlevels() {
  return request({
    url: `/v1/device/alarm/rule/levels`,
    method: 'get',
  })
}


//==========设备/数据配置=========



//=========点位管理===========
/**
 * @description 点位分页
 */
export function pointerPage(data) {
  return request({
    url: `/v1/position/page`,
    method: 'get',
    params: data
  });
}
/**
 * @description 点位新增
 */
export function addPointer(data) {
  return request({
    url: `/v1/position/add`,
    method: 'post',
    data
  });
}

/**
 * @description 点位编辑
 */
export function updatePointer(data) {
  return request({
    url: `/v1/position/update`,
    method: 'put',
    data
  });
}

/**
 * @description 点位删除
 */
export function detailPointer(id) {
  return request({
    url: `/v1/position/${id}`,
    method: 'delete',
  });
}

/**
 * @description 点位绑定设备
 */
export function pointerBindDevice(data) {
  return request({
    url: `/v1/position/bindDevice`,
    method: 'post',
    data
  });
}

/**
 * @description 点位设备分页
 */
export function pointerDevice(data) {
  return request({
    url: `/v1/position/downDeviceList`,
    method: 'get',
    params: data
  });
}

/**
 * @description 区域点位下拉列表
 */
export function downPositionList(data) {
  return request({
    url: `/v1/grid/downPositionList`,
    method: 'get',
    params: data
  });
}
/**
 * @description 区域绑定点位
 */
export function bindPosition(data) {
  return request({
    url: `/v1/grid/bindPosition`,
    method: 'put',
    data
  });
}
//==========点位管理==========