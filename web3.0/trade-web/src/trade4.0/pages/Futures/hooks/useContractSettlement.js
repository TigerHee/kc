/**
 * Owner: clyne@kupotech.com
 */
import { getSymbolInfo, useGetSymbolInfo } from '@/hooks/common/useSymbol';
import { FUTURES } from '@/meta/const';
import { SETTLE_CONTRACT } from '@/meta/futures';
import { useSelector } from 'dva';
import { getStore } from 'src/utils/createApp';
import { lessThanOrEqualTo, minus } from 'utils/operation';

const fiveD = 1000 * 60 * 60 * 24 * 5;

/**
 * @description 是否合约即将交割hooks
 * @param {string} string 交易对
 */

export const useContractSettlement = (symbol) => {
  const serverTime = useSelector((state) => state.server_time.serverTime);
  const { settleDate, type } = useGetSymbolInfo({ symbol, tradeType: FUTURES });
  const isSettleContract = SETTLE_CONTRACT === type;
  // settleData无值 || 交个合约不显示 || 服务时间获取不到
  if (!settleDate || isSettleContract || !serverTime || lessThanOrEqualTo(settleDate)(serverTime)) {
    return false;
  }

  return lessThanOrEqualTo(minus(settleDate)(serverTime))(fiveD);
};

/**
 * @description 是否合约即将交割
 * @param {string} string 交易对
 */

export const isContractSettlement = (symbol) => {
  const stateMap = getStore().getState();
  const { serverTime } = stateMap.server_time;
  const { settleDate, type } = getSymbolInfo({ symbol, tradeType: FUTURES });
  const isSettleContract = SETTLE_CONTRACT === type;
  // settleData无值 || 交个合约不显示 || 服务时间获取不到
  if (!settleDate || isSettleContract || !serverTime || lessThanOrEqualTo(settleDate)(serverTime)) {
    return false;
  }

  return lessThanOrEqualTo(minus(settleDate)(serverTime))(fiveD);
};
