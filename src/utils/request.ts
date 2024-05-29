/* eslint-disable no-prototype-builtins */
import axios from 'axios';
import { message as $message, Modal } from 'ant-design-vue';
import type { AxiosRequestConfig } from 'axios';
import { ACCESS_TOKEN_KEY } from '@/enums/cacheEnum';
import { Storage } from '@/utils/Storage';
import { useUserStore } from '@/store/modules/user';
import { uniqueSlash } from '@/utils/urlUtils';

export interface RequestOptions {
  /** 当前接口权限, 不需要鉴权的接口请忽略， 格式：sys:user:add */
  permCode?: string;
  /** 是否直接获取data，而忽略message等 */
  isGetDataDirectly?: boolean;
  /** 请求成功是提示信息 */
  successMsg?: string;
  /** 请求失败是提示信息 */
  errorMsg?: string;
  /** 是否mock数据请求 */
  isMock?: boolean;
}

const UNKNOWN_ERROR = '未知错误，请重试';

//退出登录code
const errorCode = [401];

/** 真实请求的路径前缀 */
const baseApiUrl = import.meta.env.VITE_BASE_API;
/** mock请求路径前缀 */
const baseMockUrl = import.meta.env.VITE_MOCK_API;

const service = axios.create({
  // baseURL: baseApiUrl,
  timeout: 30000,
});

service.interceptors.request.use(
  (config) => {
    const token = Storage.get(ACCESS_TOKEN_KEY);
    if (token && config.headers) {
      // 请求头token信息，请根据实际情况进行修改
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    Promise.reject(error);
  },
);

/**
 * 检测是否需要重新登录
 * @param res
 */
function reloadCheck(res) {
  // Illegal token
  if (errorCode.includes(res.code)) {
    Modal.confirm({
      title: '警告',
      content: res.msg || '账号异常，您可以取消停留在该页上，或重新登录',
      okText: '重新登录',
      cancelText: '取消',
      onOk: () => {
        localStorage.clear();
        window.location.reload();
      },
    });
  } else {
    res.msg && $message.error(res.msg);
  }
}

service.interceptors.response.use(
  (response) => {
    const resHeaderContentType = response.headers['content-type'];
    // 文件导出
    if (
      resHeaderContentType?.includes('application/vnd.ms-excel;charset=UTF-8') ||
      resHeaderContentType?.includes('application/octet-stream')
    ) {
      const blob = new Blob([response.data], {
        type: 'application/octet-stream',
      });
      const linkNode = document.createElement('a');
      linkNode.style.display = 'none';
      linkNode.href = URL.createObjectURL(blob); // 生成一个Blob URL
      let filename = response.headers['content-disposition'] || '';
      filename = filename.split(/filename=|filename\*=utf-8''/)[1] || '系统导出文件.xlsx';
      linkNode.setAttribute('download', decodeURI(filename));
      document.body.appendChild(linkNode);
      linkNode.click(); // 模拟在按钮上的一次鼠标单击
      URL.revokeObjectURL(linkNode.href); // 释放URL 对象
      document.body.removeChild(linkNode);
      return response;
    }
    const res = response.data;

    if (res.hasOwnProperty('code') && res.code !== 200 && res.code !== 0) {
      if (res.code === 40014) return Promise.reject(res); //40014推流上线提示code

      // // $message.error(res.msg || UNKNOWN_ERROR);
      console.log(res, 8888);
      reloadCheck(res);

      // throw other
      const error = new Error(res.msg || UNKNOWN_ERROR) as Error & { code: any };
      error.code = res.code;
      return Promise.reject(error);
    } else {
      return res;
    }
  },
  (error) => {

    if (error?.response?.data?.code && error?.response?.data?.code == 401) {
      // $message.error('该账号在另一设备登录');
      localStorage.clear();
      window.location.reload();
      return Promise.reject('该账号在另一设备登录');
    }

    // 处理 422 或者 500 的错误异常提示
    const errMsg = error?.response?.data?.message ?? UNKNOWN_ERROR;
    // // $message.error(errMsg);
    error.message = errMsg;
    reloadCheck(error?.response?.data);
    return Promise.reject(error);
  },
);

export type Response<T = any> = {
  code: number;
  message: string;
  data: T;
};

export type BaseResponse<T = any> = Promise<Response<T>>;

/**
 *
 * @param method - request methods
 * @param url - request url
 * @param data - request data or params
 */
export const request = async <T = any>(
  config: AxiosRequestConfig,
  options: RequestOptions = {},
): Promise<T> => {
  try {
    const { successMsg, errorMsg, permCode, isMock, isGetDataDirectly = true } = options;
    // 如果当前是需要鉴权的接口 并且没有权限的话 则终止请求发起
    if (permCode && !useUserStore().perms.includes(permCode)) {
      // return $message.error('你没有访问该接口的权限，请联系管理员！');
      return Promise.reject('你没有访问该接口的权限，请联系管理员!');
    }
    const fullUrl = `${(isMock ? baseMockUrl : baseApiUrl) + config.url}`;
    config.url = uniqueSlash(fullUrl);

    const res = await service.request(config);
    successMsg && $message.success(successMsg);
    // errorMsg && $message.error(errorMsg)$message.error;
    return isGetDataDirectly ? res.data : res;
  } catch (error: any) {
    return Promise.reject(error);
  }
};
