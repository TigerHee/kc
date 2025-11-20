/**
 * Owner: garuda@kupotech.com
 */

import React, { useMemo, useCallback, memo } from 'react';

import { RightOutlined } from '@kux/icons';

import {
  NOT_ACTIVATE,
  NOT_ALL,
  ONLY_COUPON,
  ONLY_TRIAL_FUND,
  SHOW_DIALOG_KEYS,
  TRIAL_COUPON_BOTH,
} from './config';

import { siteCfg, _t, addLangToPath, styled, formatCurrency } from '../../builtinCommon';

import {
  useIsRTL,
  useCurrentCoupon,
  useSwitchTrialFund,
  useTrialFundDetail,
  useTrialFundDialog,
  useWatchHidden,
  useSymbolSupportTrialFund,
  useGetUserOpenFutures,
} from '../../builtinHooks';
import { useGetSymbolInfo } from '../../hooks/useGetData';

const CouponWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const CouponLabel = styled.div`
  display: flex;
  white-space: nowrap;
  margin-right: 8px;
  font-size: 12px;
  font-weight: 500;
  line-height: 1.3;
  color: ${(props) => props.theme.colors.text40};
`;

const CouponTextBox = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: flex-end;
  text-align: right;
  cursor: pointer;
  span {
    font-size: 12px;
    font-weight: 500;
    line-height: 1.3;
    color: ${(props) => props.theme.colors.primary};
  }
  svg {
    font-size: 12px;
    width: 12px;
    height: 12px;
    color: ${(props) => props.theme.colors.icon60};
    transform: ${(props) => (props.isRtl ? 'scaleX(-1)' : 'initial')};
  }
`;

const Coupons = ({ className = '' }) => {
  const { isHasTrialFund, isAvailableTrialFund, switchTrialFund } = useSwitchTrialFund();
  const currentCoupon = useCurrentCoupon(switchTrialFund);
  const { onTrialFundDialog } = useTrialFundDialog();

  const trialFundDetail = useTrialFundDetail();
  const watchHidden = useWatchHidden();
  const isOpen = useGetUserOpenFutures();
  const isRtl = useIsRTL();

  const { symbol } = useGetSymbolInfo();
  const isSupportCurrentSymbol = useSymbolSupportTrialFund(symbol);

  // 体验金跟隐藏单是一个互斥关系, 并且需要判断当前合约是否支持
  const isTrialFundExist = useMemo(() => isHasTrialFund && !watchHidden && isSupportCurrentSymbol, [
    isHasTrialFund,
    watchHidden,
    isSupportCurrentSymbol,
  ]);

  const couponStatus = useMemo(() => {
    // 如果不存在体验金，只存在抵扣券
    if (!isTrialFundExist) {
      if (currentCoupon && currentCoupon.remainValidDays) {
        return ONLY_COUPON;
      }
      return NOT_ALL;
    }
    // 判断是否有待激活的体验金
    if (isTrialFundExist && !isAvailableTrialFund) {
      return NOT_ACTIVATE;
    }
    // 判断是否同时有抵扣券跟体验金
    if (isTrialFundExist && (!currentCoupon || !currentCoupon.remainValidDays)) {
      return ONLY_TRIAL_FUND;
    }
    if (isTrialFundExist && currentCoupon.remainValidDays) {
      return TRIAL_COUPON_BOTH;
    }
    return NOT_ALL;
  }, [currentCoupon, isAvailableTrialFund, isTrialFundExist]);

  const showCouponText = useMemo(() => {
    switch (couponStatus) {
      case NOT_ALL:
        return null;
      case NOT_ACTIVATE:
        return _t('trialFund.goActivate');
      case ONLY_COUPON:
        return _t('coupons.discount', {
          amount: currentCoupon?.deductionRatio,
        });
      case ONLY_TRIAL_FUND:
        return switchTrialFund
          ? _t('trialFund.faceValue', {
              amount: trialFundDetail.faceValue,
              currency: formatCurrency(trialFundDetail.currency),
            })
          : _t('coupons.available', { num: 1 });
      case TRIAL_COUPON_BOTH:
        return switchTrialFund
          ? // _t('coupons.selected', { num: 1 })
            _t('trialFund.faceValue', {
              amount: trialFundDetail.faceValue,
              currency: formatCurrency(trialFundDetail.currency),
            })
          : _t('coupons.available', { num: 2 });
      default:
        return null;
    }
  }, [couponStatus, currentCoupon, switchTrialFund, trialFundDetail]);

  const handleCoupons = useCallback(() => {
    if (couponStatus === NOT_ALL) return;
    // 如果未激活，跳转到福利页面
    if (couponStatus === NOT_ACTIVATE) {
      window.location.href = addLangToPath(`${siteCfg.KUMEX_HOST}/bonus`);
      return;
    }
    // 如果有抵扣券或者体验金，打开优惠券弹框
    if (SHOW_DIALOG_KEYS.includes(couponStatus)) {
      onTrialFundDialog(true);
    }
  }, [couponStatus, onTrialFundDialog]);

  if (!showCouponText || !isOpen) return null;

  return (
    <CouponWrapper className={className}>
      <CouponLabel>{_t('coupons')}</CouponLabel>
      <CouponTextBox onClick={handleCoupons} isRtl={isRtl}>
        <span>{showCouponText}</span>
        <RightOutlined className="coupons_arrow" />
      </CouponTextBox>
    </CouponWrapper>
  );
};

export default memo(Coupons);
