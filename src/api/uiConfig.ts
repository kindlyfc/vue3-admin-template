import { request } from '@/utils/request'
/**
 * @description 上传文件
 */
export function upDateFile(data) {
  return request({
    url: `/v1/common/upload`,
    method: 'post',
    // 数据格式 formData
    headers: { 'Content-Type': 'multipart/form-data' },
    data
  })
}
/**
 * @description 名称列表
 */
export function nameList() {
  return request({
    url: `/v1/sys/config/nameTitle/list`,
    method: 'get',
  })
}
/**
 * @description LOGO&&背景图列表
 */
export function imgList() {
  return request({
    url: `/v1/sys/config/image/list`,
    method: 'get',
  })
}

/**
 * @description 名称编辑
 */
export function editName(data) {
  return request({
    url: `/v1/sys/config/nameTitle/modify`,
    method: 'post',
    data
  })
}
/**
 * @description logo背景图编辑
 */
export function editLogo(data) {
  return request({
    url: `/v1/sys/config/image/modify`,
    method: 'post',
    data
  })
}

/**
 * @description 模块配置获取
 */
export function getModule() {
  return request({
    url: `/v1/sys/config/module`,
    method: 'get',
  })
}


/**
 * @description 左侧模块自定义编辑
 */
export function editModule(data) {
  return request({
    url: `/v1/sys/config/module/modify`,
    method: 'post',
    data
  })
}


/**
 * @description 获取主题配置
 */
export function itemList() {
  return request({
    url: `/v1/sys/item/itemList`,
    method: 'get',
  })
}


/**
 * @description 主题配置修改
 */
export function itemModify(data) {
  return request({
    url: `/v1/sys/item/item/modify`,
    method: 'post',
    data
  })
}


/**
 * @description 获取颜色自定义配置
 */
export function colorConfigList() {
  return request({
    url: `/v1/sys/item/colorConfigList`,
    method: 'get',
  })
}


/**
 * @description 颜色自定义配置修改
 */
export function colorConfigModify(data) {
  return request({
    url: `/v1/sys/item/colorConfig/modify`,
    method: 'post',
    data
  })
}