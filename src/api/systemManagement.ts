import { request } from '@/utils/request';

// /**
//  * @description 获取用户分页列表
//  */
// export function getUserpage(query: any) {
//   return request({
//     url: '/v1/sys/user',
//     method: 'get',
//     params: query,
//   });
// }
/**
 * @description 查询组织机构
 */
export function getOrg({ name, enabled }) {
  return request({
    url: `/v2/org`,
    method: 'get',
    params: { name, enabled },
  });
}
/**
 * @description 新增组织机构
 */
export function addOrg({ name, remark, enabled, parentCode, type }) {
  return request({
    url: `/v2/org`,
    method: 'post',
    data: { name, remark, enabled, parentCode, type },
  });
}
/**
 * @description 编辑组织机构
 */
export function editOrg({ name, remark, enabled, code, type }) {
  return request({
    url: `/v2/org`,
    method: 'put',
    data: { name, remark, enabled, code, type },
  });
}
/**
 * @description 删除组织机构
 */
export function deleteOrg(code: string | number) {
  return request({
    url: `/v2/org/${code}`,
    method: 'delete',
  });
}
