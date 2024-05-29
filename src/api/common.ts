import { request } from '@/utils/request';

/**
 * @description 获取当前用户的权限树

 */
export function getPerms() {
  return request({
    url: '/v1/user/perms',
    method: 'get',
  });
}

/**
 * @description 获取当前用户的机构列表

 */
export function getUserOrgs(name) {
  return request({
    url: '/v1/media/treeList',
    method: 'get',
    params: { name }
  });
}
/**
 * @description 根据机构id获取设备播放地址
 */
export function getDivceUrl(id: any) {
  return request({
    url: `/v1/media/openLive?id=${id}`,
    method: 'get',
  });
}

/**
 * @description 根据机构id获取设备列表
 */
export function deviceList(orgIds: any, name) {
  return request({
    url: `/v1/device/list?orgIds=${orgIds}&name=${name}`,
    method: 'get',
  });
}

/**
 * @description 摄像头断流
 */
export function cameraClose(id) {
  return request({
    url: `/v1/device/camera/close`,
    method: 'put',
    data: { id }
  });
}

/**
 * @description 导出数据用公共接口
 * @param {string} url 导出数据接口地址
 * @param {Object} params 导出数据接口参数
 * @returns
 */
export function exportData({ url, params, method }) {
  // 将method数据转为小写
  method = method ? method.toLowerCase() : 'get';

  return new Promise((resolve, reject) => {
    request({
      url,
      method,
      params: method !== 'get' ? undefined : params,
      data: method !== 'get' ? params : undefined,
      responseType: 'blob',
    })
      .then((result) => {
        // message.success('导出成功');
        console.log(result, 11111);

        resolve(result);
      })
      .catch((err) => {
        // // message.error('导出失败');

        reject(err);
      });
  });
}


/**
 * @description 根据证件号获取识别记录
 */
export function getAlertRecord(id: number) {
  return request({
    url: `/v1/alert/today?idNumber=${id}`,
    method: 'get',
  });
}


