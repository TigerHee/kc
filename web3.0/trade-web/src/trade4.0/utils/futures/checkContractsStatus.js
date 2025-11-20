/**
 * Owner: garuda@kupotech.com
 */

// check 合约状态 合约不存在/合约已下线 返回false 否则true
export const checkContractsStatus = ({ symbol, contracts }) => {
  if (!contracts || !contracts[symbol]) return false;
  const state = contracts[symbol].status;
  if (state === 'Open' || state === 'CancelOnly' || state === 'Paused') return true;
  return false;
};
