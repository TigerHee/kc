/**
 * Owner: garuda@kupotech.com
 */

export const maintenanceText = {
  CANCELONLY: 'stop.trade.cancelonly',
  PAUSED: 'stop.trade',
  //
  PREPARESETTLED: 'stop.trade',
  BEINGSETTLED: 'stop.trade',
  SETTLED: 'stop.trade',
  CLOSED: 'stop.trade',
};

// 交易密码安全验证type
export const PASSWORD_SECURITY_TYPE = 'WITHDRAW_PASSWORD';

export const getText = (type, _t) => {
  // 只撤单 暂停显示维护中
  if (type === 'CancelOnly' || type === 'Paused') {
    return _t('under.maintenance');
    // 预结算，结算中，显示合约交割中
  } else if (type === 'PrepareSettled' || type === 'BeingSettled') {
    return _t('contract.settling');
  }
};
