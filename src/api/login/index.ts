// import type { BaseResponse } from '@/utils/request';
import { request } from '@/utils/request';

/**
 * @description 登录
 * @param {LoginParams} data
 * @returns
 */
export function login(data: API.LoginParams, token: string) {
  return request(
    {
      url: '/v1/auth/login',
      method: 'post',
      data,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
    {
      isGetDataDirectly: false,
    },
  );
}
/**
 * @description 获取验证码
 */
export function getImageCaptcha(token: string) {
  return request(
    {
      url: '/v1/auth/captcha',
      method: 'get',
      responseType: 'blob',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
    {
      isGetDataDirectly: false,
    },
  );
}
/**
 * @description 未登录用户可以获取有效期1分钟的临时token，仅用于调用登录接口
 */
export function getToken() {
  return request({
    url: '/v1/auth/token',
    method: 'get',
  });
}

/**
 * @description 退出登录
 * @param {LoginParams} data
 * @returns
 */
export function loginOut() {
  return request({
    url: '/v1/auth/logout',
    method: 'get',
  });
}

/**
 * @description 获取当前登录用户信息
 * @param {LoginParams} data
 * @returns
 */
export function loginInfo() {
  return request({
    url: '/v1/user/info',
    method: 'get',
  });
}
