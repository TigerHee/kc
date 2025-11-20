/*
 * @Owner: gannicus.zhou@kupotech.com
 * @Date: 2024-02-27 13:34:19
 * @LastEditors: gannicus Gannicus.Zhou@kupotech.com
 * @LastEditTime: 2024-04-05 14:53:21
 * @FilePath: /trade-web/src/trade4.0/pages/OrderForm/hooks/useFee.js
 * @Description:
 */
/*
 * @owner: borden@kupotech.com
 */
import { useMemo } from 'react';
import { useSelector } from 'dva';
import { getStateFromStore } from '@/utils/stateGetter';
import {
  useGetCurrentSymbol,
  getCurrentSymbol,
} from '@/hooks/common/useSymbol';
import { add } from 'src/helper';

const plainObj = {};

export default function useFee(symbol) {
  const _symbol = useGetCurrentSymbol();

  if (!symbol) {
    symbol = _symbol;
  }
  const feeInfo =
    useSelector((state) => state.tradeForm.feeInfoMap?.[symbol]) || plainObj;

  return useMemo(() => {
    const { takerFeeRate = 0, makerFeeRate = 0, buyTaxRate = 0 } = feeInfo;
    const feeRateForCalc = add(Math.max(+takerFeeRate, +makerFeeRate), +buyTaxRate); // 印度合规额外代扣代缴1%交易金额作为税费
    return { ...feeInfo, feeRateForCalc };
  }, [feeInfo]);
}
/**
 *
 * @param {*} symbol 默认当前交易对
 * @returns
 */
export function getFee(symbol) {
  if (!symbol) {
    symbol = getCurrentSymbol();
  }
  const feeInfo =
    getStateFromStore((state) => state.tradeForm.feeInfoMap?.[symbol]) ||
    plainObj;

  const { takerFeeRate = 0, makerFeeRate = 0, buyTaxRate = 0 } = feeInfo;
  const feeRateForCalc = add(Math.max(+takerFeeRate, +makerFeeRate), +buyTaxRate); // 印度合规额外代扣代缴1%交易金额作为税费
  return { ...feeInfo, feeRateForCalc };
}
