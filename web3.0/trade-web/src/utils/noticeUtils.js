/**
 * Owner: borden@kupotech.com
 */
// 现货停服（部分/全部交易对）方案设计 https://wiki.kupotech.com/pages/viewpage.action?pageId=63779121

import { includes } from 'lodash';
import { MaintenanceCode } from './constants';

/**
 * 是否停机范围
 * @param {Record<any, any>} maintenanceStatus
 */
export const isMaintenanceScope = (maintenanceStatus) => {
  if (!maintenanceStatus) return false;
  return includes(maintenanceStatus.pcNoticeLocation, MaintenanceCode);
};

/**
 * 当前交易对是否停机撤单
 * @param {Record<any, any>} maintenanceStatus
 * @param { string } [symbolCode]
 */
export const isSymbolMaintenance = (maintenanceStatus, symbolCode) => {
  if (!maintenanceStatus) return false;
  const { maintenanceScope, symbolList, maintenance } = maintenanceStatus;
  // 停机状态
  if (!maintenance) return false;
  // maintenanceScope 停机范围，1：部分交易对停机时
  if (maintenanceScope === 1) {
    return !symbolCode ? false : (symbolList || []).includes(symbolCode);
  }
  return true;
};

/**
 * 系统是否停机
 * @param {Record<any, any>} maintenanceStatus
 * @param {string} [symbolCode]
 */
export const isSystemMaintenance = (maintenanceStatus, symbolCode) => {
  if (!maintenanceStatus) return false;
  return isMaintenanceScope(maintenanceStatus)
    && isSymbolMaintenance(maintenanceStatus, symbolCode);
};

export const isPathFitWithMaintenance = (pathname) => {
  return !includes(pathname, '404');
};

/**
 * 是否停机维护
 * maintenanceScope（停服范围参数，0：全部交易对，1：部分交易对）
 * @param {string} pathname
 * @param {Record<any, any>} maintenanceStatus
 * @param {string} [symbolCode]
 */
export const isShowMaintenanceNotice = (pathname, maintenanceStatus, symbolCode) => {
  if (!isPathFitWithMaintenance(pathname)) return false;
  return isSystemMaintenance(maintenanceStatus, symbolCode);
};

/**
 * 是否禁止撤单
 * @param {*} maintenanceStatus
 * @returns { (symbolCode: string) => boolean}
 */
export const isDisableCancelOrder = maintenanceStatus => (symbolCode) => {
  if (!maintenanceStatus) return false;
  return !maintenanceStatus.allowCancelOrder && isSymbolMaintenance(maintenanceStatus, symbolCode);
};
