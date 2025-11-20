/**
 * Owner: willen@kupotech.com
 */
/*
 * @Author: Chrise
 * @Date: 2021-05-14 20:22:45
 * @FilePath: /kucoin-main-web/src/services/isolated.js
 */
import { pull, post } from 'tools/request';

const prefix = '/margin-isolated-position';
const marginConfigPrefix = '/margin-config';

// 获取逐仓交易对
export async function getIsolatedTags(params = {}) {
  return pull(`${prefix}/position/tags`, params);
}
// 查询用户指定仓位的仓位信息
export async function getIsolatedAppoint(params = {}) {
  return pull(`${prefix}/position/position-by-tag`, params);
}
// 获取所有逐仓杠杆币种配置
export async function getAllSymbolConfigs(params = {}) {
  return pull(`${marginConfigPrefix}/margin-isolated-position-cfg/symbols`, params);
}
// 获取标记价格
export async function getTargetPrice() {
  return pull('/kucoin-web-front/margin/mark-prices/last-records');
}
// 设置自动还款开关
export async function updateAutoRepay(params = {}) {
  return post(`${prefix}/position/update-auto-repay-switch`, params);
}
// 修改逐仓杠杆倍数
export async function setUserLeverage(params = {}) {
  return post(`${prefix}/position/update-user-leverage`, params);
}
