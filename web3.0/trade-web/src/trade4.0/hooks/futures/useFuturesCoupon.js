/**
 * Owner: garuda@kupotech.com
 */
import { useMemo, useCallback } from 'react';
import { isEqual } from 'lodash';
import { useSelector, useDispatch } from 'react-redux';
import { max, min, multiply, dividedBy, minus } from 'utils/operation';

// 返回当前可用的抵扣券
export const useCurrentCoupon = (isTrialFunds) => {
  const currentCoupon = useSelector((state) => state.futuresTrialFund.currentCoupon, isEqual);

  // 如果传入开启体验金，则屏蔽抵扣券
  if (isTrialFunds) return null;
  return currentCoupon;
};

// 计算抵扣券的抵扣比例
export const useCouponDeduction = ({
  currentCoupon,
  takerFeeRate,
  orderValue,
  isInverse,
  dealPrice,
}) => {
  const couponDeduction = useMemo(() => {
    if (!currentCoupon || !currentCoupon.deductionRatio) return 0;
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
  }, [currentCoupon, isInverse, orderValue, dealPrice, takerFeeRate]);

  if (!couponDeduction || couponDeduction.valueOf() <= 0) return null;

  return couponDeduction;
};

const emptyObject = {};
// 返回抵扣券详情 data
export const useCouponRuleInfo = () => {
  const detailData =
    useSelector((states) => states.futuresTrialFund.couponModalData) || emptyObject;
  const modalState = useSelector((states) => states.futuresTrialFund.couponModalState);

  return {
    detailData,
    modalState,
  };
};

// 抵扣券规则 dialog
// 抵扣券没有单独查询接口，需要传详情
export const useCouponRuleDialog = () => {
  const dispatch = useDispatch();

  const showModal = useCallback(
    ({ detail }) => {
      dispatch({
        type: 'futuresTrialFund/update',
        payload: {
          couponModalData: { ...detail },
          couponModalState: true,
        },
      });
    },
    [dispatch],
  );

  const closeModal = useCallback(() => {
    dispatch({
      type: 'futuresTrialFund/update',
      payload: {
        couponModalData: {},
        couponModalState: false,
      },
    });
  }, [dispatch]);

  return {
    showModal,
    closeModal,
  };
};
