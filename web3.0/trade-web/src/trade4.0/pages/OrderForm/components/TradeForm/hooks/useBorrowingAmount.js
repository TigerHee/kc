/*
 * @owner: borden@kupotech.com
 * @desc:
 *     1、买(非市价)： 成交需借 = 成交额 - 可用
 *     2、卖： 成交需借 = 数量 - base币种可用数量
 */
import { useMemo } from 'react';
import { isNil } from 'lodash';
import useMarginModel from '@/hooks/useMarginModel';
import useAvailableBalance from '@/hooks/useAvailableBalance';
import useFee from '../../../hooks/useFee';
import useSide from '../../../hooks/useSide';
import useOrderType from '../../../hooks/useOrderType';
import useOrderCurrency from '../../../hooks/useOrderCurrency';
import { TRADE_SIDE_MAP } from '../../../config';
import { add, sub, multiply, formatNumberByStep } from 'src/helper';

export default function useBorrowingAmount({ price, amount }) {
  const { side } = useSide();
  const { isMarket } = useOrderType();
  const { feeRateForCalc } = useFee();
  const { currency } = useOrderCurrency({ side });
  const { coinsConfig } = useMarginModel(['coinsConfig']);
  const { isCanBorrow, availableBalance } = useAvailableBalance({ currency });

  const isBuy = side === TRADE_SIDE_MAP.buy.value;

  const {
    borrowMinAmount, // 币种借入最小金额范围
    currencyLoanMinUnit, // 币种最小借出单位
  } = coinsConfig[currency] || {};

  return useMemo(() => {
    let borrowSize = 0;
    const result = { borrowingAmount: null };
    if (isCanBorrow) {
      result.borrowingAmount = 0;
      try {
        // 买入手续费是外扣，所以计算需借需要加上手续费
        if (isBuy) {
          if (isMarket) {
            if (!isNil(amount)) {
              borrowSize = +add(
                sub(amount, availableBalance),
                multiply(amount, feeRateForCalc),
              );
            }
          } else if ([price, amount].every((v) => !isNil(v))) {
            const volume = multiply(amount, price);
            borrowSize = +add(
              sub(volume, availableBalance),
              multiply(volume, feeRateForCalc),
            );
          }
        } else if (!isNil(amount)) {
          borrowSize = +sub(amount, availableBalance);
        }
      } catch (e) {
        result.borrowingAmount = null;
      }
      if (borrowSize > 0) {
        if (borrowMinAmount && borrowSize < +borrowMinAmount) {
          result.borrowingAmount = +borrowMinAmount;
        } else if (currencyLoanMinUnit) {
          result.borrowingAmount = +formatNumberByStep(
            borrowSize,
            currencyLoanMinUnit,
            'UP',
          );
        }
      }
    }
    result.showBorrowingInfo = Boolean(
      result.borrowingAmount && borrowSize !== result.borrowingAmount,
    );
    return result;
  }, [
    isBuy,
    price,
    amount,
    isMarket,
    isCanBorrow,
    feeRateForCalc,
    borrowMinAmount,
    availableBalance,
    currencyLoanMinUnit,
  ]);
}
