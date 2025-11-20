/**
 * Owner: borden@kupotech.com
 */
import { pull, post } from 'utils/request';

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
// 获取所有逐仓杠杆币种配置(需要登录)
export async function getAllSymbolConfigsByUser(params = {}) {
  return pull(`${marginConfigPrefix}/v2/margin-isolated-position-cfg/symbols`, params);
}
// 获取标记价格
 export async function getTargetPrice() {
  return pull('/kucoin-web-front/margin/mark-prices/last-records');
}
// 修改逐仓杠杆倍数
export async function setUserLeverage(params = {}) {
  return post(`${prefix}/position/update-user-leverage`, params);
}
// 借入资金
export async function postBorrow(params = {}) {
  return post(`${prefix}/borrow/loan`, params);
}
// 借入资金
export async function postRepay(params = {}) {
  return post(`${prefix}/borrow/repay`, params);
}
// 设置自动还款开关
export async function updateAutoRepay(params = {}) {
  return post(`${prefix}/position/update-auto-repay-switch`, params);
}
// 逐仓仓位列表
export async function getIsolatedAssetsList(params = {}) {
  return pull(`${prefix}/position/current-and-has-asset`, params);
}
// 一键平仓
export async function oneClickLiquidation(params = {}) {
  return post(`${prefix}/position/one-click-liquidation`, params);
}

// 取消一键平仓
export async function cancelOneClickLiquidation(params = {}) {
  return post(`${prefix}/position/one-click-liquidation/cancel`, params);
}
// 获取一键平仓BS点位数据
export async function getIsolatedLiquidationBSPoints(params = {}) {
  return pull(`${prefix}/position/bs/data`, params);
}
