/**
 * Owner: solar@kupotech.com
 */

// 处理account，在统一账户模式下，统一把TRADE处理成UNIFIED
export const genProcessAccount = (adaptUnified, isUnifiedMode) => (account) => {
  if (adaptUnified && isUnifiedMode && account === 'TRADE') {
    return 'UNIFIED';
  }
  return account;
};
