import systemManage from './systemManage'; //系统管理
import analyticalModel from './analyticalModel'; // 分析模型
import listBaseManage from './listBaseManage'; //名单库管理

export default [
  ...analyticalModel,
  ...listBaseManage,
  ...systemManage,
];
