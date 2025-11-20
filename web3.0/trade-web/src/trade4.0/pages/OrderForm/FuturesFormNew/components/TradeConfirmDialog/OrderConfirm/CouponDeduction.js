/**
 * Owner: garuda@kupotech.com
 */
import React from 'react';

import InfoRow from './InfoRow';

import {
  _t,
  styled,
  max,
  min,
  multiply,
  dividedBy,
  minus,
  lessThanOrEqualTo,
} from '../../../builtinCommon';
import { PrettyCurrency } from '../../../builtinComponents';
import { useSwitchTrialFund, useCurrentCoupon } from '../../../builtinHooks';

import { CALC_LIMIT, CALC_MARKET } from '../../../config';
import { useGetBBO, useGetSymbolInfo } from '../../../hooks/useGetData';

const CouponBox = styled.div`
  div {
    margin: 0;
    font-size: 13px;
    font-style: normal;
    font-weight: 400;
    line-height: 130%;
    color: ${(props) => props.theme.colors.text40};
  }
  .KuxRow-row {
    margin-top: 4px;
  }
`;

const CouponDeduction = ({ currentCoupon, orderType, orderValue, price, isBuy }) => {
  const { symbolInfo } = useGetSymbolInfo();
  const { bid1, ask1 } = useGetBBO();

  const { isInverse, maxPrice, takerFeeRate } = symbolInfo || {};

  const dealPrice = React.useMemo(() => {
    if (CALC_LIMIT.includes(orderType)) {
      return min(maxPrice, price || 0).toNumber();
    } else if (CALC_MARKET.includes(orderType)) {
      return isBuy ? bid1 : ask1;
    }
    return 0;
  }, [orderType, maxPrice, price, isBuy, bid1, ask1]);

  const couponDeduction = React.useMemo(() => {
    if (!orderValue || Number.isNaN(orderValue)) {
      return 0;
    }
    const deductedFee = max(
      0,
      multiply(multiply(orderValue)(minus(takerFeeRate)(0.00025)))(
        dividedBy(currentCoupon.deductionRatio)(100),
      ),
    );
    let couponAmount = currentCoupon.remainAmount;
    // 反向合约需要转换一下抵扣券的价值
    if (isInverse) {
      couponAmount = dividedBy(couponAmount)(dealPrice);
    }
    return min(couponAmount, deductedFee);
  }, [
    currentCoupon.deductionRatio,
    currentCoupon.remainAmount,
    isInverse,
    orderValue,
    dealPrice,
    takerFeeRate,
  ]);

  if (!couponDeduction || lessThanOrEqualTo(couponDeduction)(0)) return null;

  return (
    <CouponBox>
      <InfoRow
        title={_t('use.coupon.deduction.fee.title')}
        data={couponDeduction}
        render={(value) => (
          <PrettyCurrency value={value} currency={symbolInfo?.settleCurrency} isShort />
        )}
      />
    </CouponBox>
  );
};

const CouponDetail = ({ cost, ...other }) => {
  const { switchTrialFund } = useSwitchTrialFund();
  const currentCoupon = useCurrentCoupon(switchTrialFund);

  if (!currentCoupon || lessThanOrEqualTo(cost)(0)) return null;

  return <CouponDeduction currentCoupon={currentCoupon} {...other} />;
};

export default React.memo(CouponDetail);
