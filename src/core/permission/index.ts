/**
 * example
 * path -> ./modules/user
 * <a-button v-if="$auth('user.add')">Button</a-button>
 * path -> ./modules/sys/user
 * <a-button v-if="$auth('sysUser.add')">Button</a-button>
 */
// import type { DataNode } from 'rc-tree-select/es/interface'

import { permissions } from './modules/';
import type { TreeSelectProps } from 'ant-design-vue';
import type { App } from 'vue';
import type { PermissionType } from './modules/types';
import { USER_MENUARR } from '@/enums/cacheEnum';
import { Storage } from '@/utils/Storage';
type DataNode = NonNullable<TreeSelectProps['treeData']>[number];
import { request } from '@/utils/request';

/**
 * @description 将权限列表转成级联选择器要求的数据格式
 */
export const formarPermsToCascader = () => {
  return Object.keys(permissions).reduce<DataNode[]>((prev, moduleKey) => {
    const module = permissions[moduleKey];
    Object.keys(module).forEach((key) => {
      module[key].split(':').reduce((p, k, currentIndex, arr) => {
        const value = arr.slice(0, currentIndex + 1).join(':');
        const index = p.findIndex((item) => item?.value === value);
        if (Number.isInteger(index) && index !== -1) {
          return p[index].children;
        } else {
          const item: DataNode = {
            // key: k,
            title: k,
            label: k,
            value,
            children: [],
          };
          p.push(item);
          return item.children!;
        }
      }, prev);
    });
    return prev;
  }, []);
};

/**
 * 验证权限
 * @param {PermissionType} perm  权限码
 * @returns {boolean} true | false
 */
export const verifyAuth = (perm: PermissionType) => {
  const permCode = perm.replace(/\s*/g, '');
  const permissionList = Storage.get(USER_MENUARR);

  return permissionList.some((n) => n === permCode);
};

// 人员类型map用于列表显示
export const personTypeMap: Record<string, string> = {
  RISK: "风险人员",
  SANITARY: "卫检报警人员",
  HEALTH: "健康检报警人员",
  LUGGAGE: "行李检报警人员",
  FREQUENT: "频繁往返人员",
};

// 人员类型options用于下拉列表使用
export const personTypeOptions: { label: string, value: string }[] = [
  // { label: "风险人员", value: "RISK" },
  // { label: "卫检报警人员", value: "SANITARY" },
  // { label: "健康检报警人员", value: "HEALTH" },
  // { label: "行李检报警人员", value: "LUGGAGE" },
  // { label: "频繁往返人员", value: "FREQUENT" },
  { label: "风险人员", value: "风险人员" },
  { label: "卫检报警人员", value: "卫检报警人员" },
  { label: "健康检报警人员", value: "健康检报警人员" },
  { label: "行李检报警人员", value: "行李检报警人员" },
  { label: "频繁往返人员", value: "频繁往返人员" },
];

// 风险等级options
export const riskLevelOptions = [
  { value: 1, label: '一级' },
  { value: 2, label: '二级' },
  { value: 3, label: '三级' },
  { value: 4, label: '四级' },
]

// 年龄段选项
export const ageOptions = [
  { value: '儿童', label: '儿童' },
  { value: '少年', label: '少年' },
  { value: '青年', label: '青年' },
  { value: '中年', label: '中年' },
  { value: '老年', label: '老年' },
]

// 证件类型选项
export const idCardTypeOptions = [
  { value: 1, label: '身份证' },
  { value: 2, label: '护照' },
  { value: 3, label: '军人证' },
  { value: 4, label: '学生证' },
  { value: 5, label: '其它' },
];

export const idCardTypeMap = {
  1: '身份证',
  2: '护照',
  3: '军人证',
  4: '学生证',
  5: '其它',
}


/**
 * 判断是否是 Base64 编码
 * @param str
 * @returns
 */
export function isBase64(str) {
  // 使用正则表达式检查字符串是否符合 Base64 编码格式
  const base64Regex = /^[A-Za-z0-9+/]+={0,2}$/;
  return base64Regex.test(str);
}

/**
 * 获取图片地址
 * @param str
 * @returns
 */
export function getImgAdress(str) {
  if (isBase64(str)) {
    // 如果不是 Base64 编码，添加 data: 头部
    return `data:image/jpeg;base64,${str}`;
  }
  return str; // 如果不是 Base64 编码，直接返回
}


export default {
  install(app: App) {
    app.config.globalProperties.$auth = verifyAuth;
    app.config.globalProperties.$personTypeMap = personTypeMap;
    app.config.globalProperties.$personTypeOptions = personTypeOptions;
    app.config.globalProperties.$riskLevelOptions = riskLevelOptions;
    app.config.globalProperties.$ageOptions = ageOptions;
    app.config.globalProperties.$idCardTypeOptions = idCardTypeOptions;
    app.config.globalProperties.$idCardTypeMap = idCardTypeMap;
    app.config.globalProperties.$getImgAdress = getImgAdress;
  },
};
