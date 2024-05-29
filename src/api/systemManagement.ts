import { request } from '@/utils/request';

/**
 * @description 获取用户分页列表
 */
export function getUserpage(query: any) {
  return request({
    url: '/v1/sys/user',
    method: 'get',
    params: query,
  });
}

/**
 * @description 创建用户
 */
export function creatUser(data: any) {
  return request({
    url: '/v1/sys/user',
    method: 'post',
    data,
  });
}
/**
 * @description 更新用户信息
 */
export function updateUser(data: any) {
  return request({
    url: '/v1/sys/user',
    method: 'put',
    data,
  });
}
/**
 * @description 删除用户
 */
export function deletUser(data: any) {
  return request({
    url: '/v1/sys/user',
    method: 'DELETE',
    params: data,
  });
}
/**
 * @description 重置密码
 */
export function resetPPwd(data: any) {
  return request({
    url: '/v1/sys/user/resetPwd',
    method: 'put',
    data,
  });
}

/* ========组织机构============  */
/**
 * @description 获取组织机构分页列表
 */
export function getOrgpage(query: any) {
  return request({
    url: '/v1/sys/org/page',
    method: 'get',
    params: query,
  });
}

/**
 * @description 获取组织机构树
 */
export function getOrg(query: any) {
  return request({
    url: '/v1//sys/org',
    method: 'get',
    params: query,
  });
}

/**
 * @description 获取当前用户的机构列表
 */
export function getUserOrgpage() {
  return request({
    url: '/v1/user/orgs',
    method: 'get',
  });
}
/**
 * @description 获取用户角色列表
 */
export function getUserRoles(id?) {
  return request({
    url: `/v1/sys/user/roles?uid=${id}`,
    method: 'get',
  });
}
/**
 * @description 获取用户数据权限
 */
export function getUserOrgs(id) {
  return request({
    url: `/v1/sys/user/orgs?uid=${id}`,
    method: 'get',
  });
}
/**
 * @description 创建机构
 */
export function creatOrg(data: any) {
  return request({
    url: '/v1/sys/org',
    method: 'post',
    data,
  });
}

/**
 * @description 更新机构信息
 */
export function updateOrg(data: any) {
  return request({
    url: '/v1/sys/org',
    method: 'put',
    data,
  });
}
/**
 * @description 删除机构
 */
export function deletOrg(data: any) {
  return request({
    url: '/v1/sys/org',
    method: 'DELETE',
    params: data,
  });
}
/**
 * @description 获取根节点列表
 */
export function getRoots() {
  return request({
    url: '/v1/sys/org/roots',
    method: 'get',
  });
}

/**
 * @description 获取某个用户的权限树
 */
export function getuserPerms(query) {
  return request({
    url: '/v1/sys/user/perms',
    method: 'get',
    params: query,
  });
}

/**
 * @description 获取播放地址
 */
export function chcekMonitor(deviceUuid) {
  return request({
    url: `/v1/open/camera/getURIByDeviceId?deviceId=${deviceUuid}`,
    method: 'get',
  });
}
/**
 * @description 获取播放地址加观看人数
 */
export function chcekMonitorNum(deviceUuid) {
  return request({
    url: `/v1/device/camera/getURIByDeviceId?deviceId=${deviceUuid}`,
    method: 'get',
  });
}


//==========角色管理===========
/**
 * @description 获取角色管理
 */
export function getRoles(data) {
  return request({
    url: '/v1/sys/role',
    method: 'get',
    params: data
  });
}
/**
 * @description 创建角色
 */
export function creatRoles(data) {
  return request({
    url: '/v1/sys/role',
    method: 'post',
    data
  });
}
/**
 * @description 更新角色
 */
export function updateRoles(data) {
  return request({
    url: '/v1/sys/role',
    method: 'put',
    data
  });
}
/**
 * @description 删除角色
 */
export function deleteRoles(data?) {
  return request({
    url: '/v1/sys/role',
    method: 'delete',
    params: data
  });
}
/**
 * @description 获取当前用户权限树
 */
export function treePerms() {
  return request({
    url: '/v1/user/perms',
    method: 'get',
  });
}

//=======菜单管理========
/**
 * @description 获取菜单管理
 */
export function getMenu(data) {
  return request({
    url: '/v1/sys/perm',
    method: 'get',
    params: data
  });
}
/**
 * @description 创建菜单
 */
export function creatMenu(data) {
  return request({
    url: '/v1/sys/perm',
    method: 'post',
    data
  });
}
/**
 * @description 更新菜单
 */
export function updateMenu(data) {
  return request({
    url: '/v1/sys/perm',
    method: 'put',
    data
  });
}
/**
 * @description 删除菜单
 */
export function deleteMenu(data?) {
  return request({
    url: '/v1/sys/perm',
    method: 'delete',
    params: data
  });
}

/**
 * @description  获取菜单字典数据
 */
export function getMenuDict(params) {
  return request({
    url: `/v1/sys/perm/dict`,
    method: 'get',
    params
  });
}
//=======菜单管理========



//======设备管理=========
/**
 * @description 新增摄像头
 */
export function deviceAdd(data) {
  return request({
    url: `/v1/sys/camera`,
    method: 'post',
    data,
  });
}
/**
 * @description 编辑摄像头
 */
export function deviceUpdate(data) {
  return request({
    url: `/v1/sys/camera`,
    method: 'put',
    data,
  });
}
/**
 * @description 获取摄像头列表
 */
export function deviceList(data) {
  return request({
    url: `/v1/sys/camera`,
    method: 'get',
    params: data,
  });
}

/**
 * @description 删除摄像头
 */
export function deletDevice(id) {
  return request({
    url: `/v1/sys/camera`,
    method: 'DELETE',
    params: { id }
  });
}

/**
 * @description 发现摄像头
 */
export function discovery() {
  return request({
    url: `/v1/sys/camera/discovery`,
    method: 'get',
  });
}

/**
 * @description 获取摄像头参数
 */
export function getConfig() {
  return request({
    url: `/v1/sys/camera/config`,
    method: 'get',
  });
}
/**
 * @description  设置摄像头参数
 */
export function setConfig(data) {
  return request({
    url: `/v1/sys/camera/config`,
    method: 'post',
    data
  });
}

/**
 * 获取报警数据推送地址
 * @returns 
 */
export function getAlarmPushUrl() {
  return request({
    url: `/v1/sys/camera/push/path`,
    method: 'get',
  });
}

/**
 * 修改报警数据推送地址
 * @param params 
 * @returns 
 */
export function setAlarmPushUrl(params) {
  return request({
    url: `/v1/sys/camera/push/path`,
    method: 'put',
    params,
  });
}


//=======任务管理=======

/**
 * 获取任务列表
 * @param params 
 * @returns 
 */
export function getTaskList(params) {
  return request({
    url: `/v1/monitor/task`,
    method: 'get',
    params,
  });
}

/**
 * 新增任务
 * @param data 
 * @returns 
 */
export function addTask(data) {

  return request({
    url: `/v1/monitor/task`,
    method: 'post',
    data,
  });
}

/**
 * 编辑任务
 * @param data 
 * @returns 
 */
export function editTask(data) {
  return request({
    url: `/v1/monitor/task`,
    method: 'put',
    data,
  });
}

/**
 * 删除任务
 * @param id 
 * @returns 
 */
export function deleteTask(id: string) {
  return request({
    url: `/v1/monitor/task?taskId=${id}`,
    method: 'DELETE',
  });
}

/**
 * @description 开启任务
 * @param id 
 * @returns 
 */
export function startTask(id: string) {
  return request({
    url: `/v1/monitor/task/start?taskId=${id}`,
    method: 'put',
  });
}

/**
 * @description 关闭任务
 * @param id 
 * @returns 
 */
export function stopTask(id: string) {
  return request({
    url: `/v1/monitor/task/stop?taskId=${id}`,
    method: 'put',
  });
}

/**
 * 获取摄像头列表
 * @returns 
 */
export function getCameraList() {
  return request({
    url: `/v1/monitor/task/cameras`,
    method: 'get',
  });
}

/**
 * 获取人员库列表
 */
export function getPersonList() {
  return request({
    url: `/v1/monitor/task/libs`,
    method: 'get',
  });
}

/**
 * @description 下载导入模板
 */
export function downtemplate() {
  return request({
    url: '/v1/sys/user/import/template',
    method: 'get',
    responseType: 'blob',
  });
}
/**
 * @description 导入用户
 */
export function importFile(data: any) {
  return request({
    url: '/v1/sys/user/import',
    method: 'post',
    responseType: 'blob',
    data,
  });
}

/**
 * @description 所有区域数据
 */
export function gridDownList() {
  return request({
    url: '/v1/grid/gridDownList',
    method: 'get',
  });
}

/**
 * @description 所有区域数据
 */
export function userGrid() {
  return request({
    url: '/v1/grid/userGrid',
    method: 'get',
  });
}

/**
 * @description 修改密码
 */
export function resetPwd(data) {
  return request({
    url: '/v1/sys/user/resetPwd',
    method: 'put',
    data
  });
}


/**
 * @description 获取用户区域列表
 */
export function getGrids(data) {
  return request({
    url: '/v1/sys/user/grids',
    method: 'get',
    params: data
  });
}