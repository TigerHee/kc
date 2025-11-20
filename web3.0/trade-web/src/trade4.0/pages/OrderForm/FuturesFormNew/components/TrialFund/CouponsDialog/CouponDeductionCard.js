/**
 * Owner: garuda@kupotech.com
 */

import React, { useCallback, useMemo } from 'react';

import { useTheme } from '@kux/mui/hooks';

import Card from './Card';

import { CouponsTitle, CouponsAmount } from './style';

import { _t, _tHTML, styled } from '../../../builtinCommon';

import { useCurrentCoupon, useCouponRuleDialog, useSwitchTrialFund } from '../../../builtinHooks';

const ProgressWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  font-size: 12px;
  line-height: 1.3;
  color: ${(props) => props.theme.colors.text60};
  > span > span {
    font-weight: 500;
    margin: 0 0 2px;
    color: ${(props) => props.theme.colors.text};
  }
`;

const ProgressBar = styled.div`
  margin-top: 4px;
  height: 8px;
  max-width: 260px;
  position: relative;
  border-radius: 36px;
  display: flex;
  align-items: center;
  background-color: ${(props) => props.theme.colors.cover8};
  &::after {
    content: ' ';
    position: absolute;
    top: 1px;
    left: 1px;
    width: ${(props) => props.barWidth};
    height: 6px;
    background-color: ${(props) =>
      (props.isLight ? props.theme.colors.text : props.theme.colors.primary)};
    border-radius: 36px;
  }
`;

const CouponDeductionCard = ({ className }) => {
  const { switchTrialFund } = useSwitchTrialFund();
  const currentCoupon = useCurrentCoupon(switchTrialFund);
  const { showModal } = useCouponRuleDialog();
  const { currentTheme: theme } = useTheme();

  const handleGoRules = useCallback(() => {
    showModal({ detail: currentCoupon });
  }, [currentCoupon, showModal]);

  const isLight = useMemo(() => theme === 'light', [theme]);

  const barWidth = useMemo(() => {
    if (!currentCoupon) return 0;
    if (!+currentCoupon.deductedAmount || !+currentCoupon.faceValue) return 0;
    const radio = currentCoupon.deductedAmount / currentCoupon.faceValue;
    if (radio > 0.1) {
      return `${radio * 260}px`;
    }
    return '10px';
  }, [currentCoupon]);

  if (!currentCoupon?.remainValidDays) return null;

  return (
    <Card
      className={className}
      type="COUPON"
      time={currentCoupon?.validPeriod}
      title={<CouponsTitle>{`${_t('welfare.gift.coupon')} (1)`}</CouponsTitle>}
      amount={
        <CouponsAmount className="COUPON">
          <div className="amount">
            {_t('trial2.discount.percent', { num: currentCoupon?.deductionRatio })}
          </div>
          <div className="unit">{_t('trial2.rulemodal.coupon.ratio')}</div>
        </CouponsAmount>
      }
      headerContent={
        <>
          <h3>{_t('welfare.gift.coupon')}</h3>
          <div className="explain">
            {currentCoupon?.deductedAmount ? (
              <ProgressWrapper>
                {_tHTML('trial2.coupon.discounted', {
                  value: currentCoupon?.deductedAmount,
                  amount: currentCoupon?.faceValue,
                  currency: currentCoupon?.currency,
                })}
                <ProgressBar isLight={isLight} barWidth={barWidth} />
              </ProgressWrapper>
            ) : (
              _tHTML('trial2.coupon.discount.max', {
                value: `${currentCoupon?.faceValue} ${currentCoupon?.currency}`,
              })
            )}
          </div>
        </>
      }
      showCheckbox
      checkDisabled
      checked
      onRules={handleGoRules}
    />
  );
};

export default React.memo(CouponDeductionCard);
