/**
 * Owner: willen@kupotech.com
 */
import { pull, post } from 'tools/request';

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
  return pull(`${prefix}/unforbidden/info`);
};

// 提交身份验证
export const authSubmit = (data) => {
  return post(`${prefix}/unforbidden/apply`, data);
};
