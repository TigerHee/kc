/**
 * Owner: willen@kupotech.com
 */
import { pull, post } from 'tools/request';

/**
 * 获取操作记录
 * @param params 查询参数
 */
export function getOperationRecord(params) {
  return pull('/promotion/reward/operation-records', params);
}
/**
 * 获取空投记录
 * @param params 查询参数
 */
export function getRewardRecord(params) {
  return pull('/promotion/reward/reward-records', params);
}
/**
 * 获取所有存入余额
 * @param params 查询参数
 */
export function getTotalDeposit() {
  return pull('/promotion/reward/total-deposit', {});
}

/**
 * 存入
 * @amount {*} amount
 */
export function deposit(params) {
  return post('/promotion/reward/deposit', params);
}

/**
 * 签署协议
 * @param {*} campaignId
 */
export function withdraw(params) {
  return post('/promotion/reward/withdraw', params);
}
