/**
 * Owner: willen@kupotech.com
 */
import { post, pull } from 'tools/request';

const prefix = '/ucenter';
// 用户确定冻结
export const confirmFreeze = (data) => {
  return post(`${prefix}/freeze-user`, data);
};
// 查询用户冻结状态
export const checkFrozen = (params) => {
  return pull(`${prefix}/is-frozen`, params);
};
// 查询用户申请状态
export const pullApplyStatus = () => {
  return pull(`${prefix}/v2/unforbidden/info`);
};

// 提交身份验证
export const authSubmit = (data) => {
  return post(`${prefix}/unforbidden/apply`, data);
};

// 查询是否存在普通子账号
export const hasSubUser = (data) => {
  return pull(`${prefix}/hasSubUser`, data);
};

// 获取合约&杠杆仓位信息
export const getPositionInfo = (data) => {
  return pull('/user-biz-front/position/info', data);
};

// 用户确定冻结new
export const confirmFreezeNew = (data) => {
  return pull('/user-biz-front/v2/freeze-user', data);
};

// 是否有冻结子账号
export const hasFreezeSub = (data) => {
  return pull(`${prefix}/has-freeze-sub`, data);
};
