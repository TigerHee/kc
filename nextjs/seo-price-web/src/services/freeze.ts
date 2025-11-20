/**
 * Owner: willen@kupotech.com
 */
import { pull, postJson } from 'gbiz-next/request';

const prefix = '/ucenter';

// 查询用户冻结状态
export const checkFrozen = (params) => {
  return pull(`${prefix}/is-frozen`, params);
};
// 查询用户申请状态
export const pullApplyStatus = () => {
  return pull(`${prefix}/unforbidden/info`);
};
