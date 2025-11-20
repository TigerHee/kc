/**
 * Owner: garuda@kupotech.com
 */

import React, { useCallback, useMemo } from 'react';

import { RightOutlined } from '@kux/icons';

import { Checkbox as KuxCheckbox } from '@kux/mui';
import { useTheme } from '@kux/mui/hooks';

import { ReactComponent as CardNumIcon } from '@/assets/trialFund/card_number.svg';
import { ReactComponent as CouponDarkIcon } from '@/assets/trialFund/coupon_dark.svg';
import { ReactComponent as CouponLightIcon } from '@/assets/trialFund/coupon_light.svg';
import { ReactComponent as NormalDarkIcon } from '@/assets/trialFund/normal_dark.svg';
import { ReactComponent as NormalLightIcon } from '@/assets/trialFund/normal_light.svg';
import { ReactComponent as VipDarkIcon } from '@/assets/trialFund/vip_dark.svg';
import { ReactComponent as VipLightIcon } from '@/assets/trialFund/vip_light.svg';
// import { ReactComponent as BorderTopIcon } from '@/assets/welfare2.0/border_top.svg';

import ExpiredTime from './ExpiredTime';
import { CouponsWrapper, CouponsBox, CouponsLeft, CouponsRight } from './style';

import { _t } from '../../../builtinCommon';
import { useIsRTL } from '../../../builtinHooks';

// 图片映射
const CardImgMap = {
  VIP_light_false: VipLightIcon,
  VIP_dark_false: VipDarkIcon,
  COUPON_light_false: CouponLightIcon,
  COUPON_dark_false: CouponDarkIcon,
  NORMAL_light_false: NormalLightIcon,
  NORMAL_dark_false: NormalDarkIcon,
};

const CouponDeductionCard = ({
  title,
  amount,
  time,
  headerContent,
  type = 'NORMAL',
  checked,
  onRules,
  onChange = () => {},
  showCheckbox = true,
  checkDisabled = false,
  className = '',
}) => {
  const { currentTheme: theme } = useTheme();
  const isRtl = useIsRTL();

  const isLight = useMemo(() => theme === 'light', [theme]);

  const showCardNum = useMemo(() => {
    return type !== 'VIP';
  }, [type]);

  const CardLeftImage = useMemo(() => {
    const mapKey = `${type}_${theme}_false`;
    if (CardImgMap[mapKey]) return CardImgMap[mapKey];
    return isLight ? NormalLightIcon : NormalDarkIcon;
  }, [isLight, theme, type]);

  const handleCheckbox = useCallback(
    (e) => {
      const value = e.target.checked;
      onChange && onChange(value);
    },
    [onChange],
  );

  return (
    <CouponsWrapper className={className}>
      {title}
      <CouponsBox>
        <CouponsLeft isLight={isLight} isRtl={isRtl}>
          {<CardLeftImage className="cardLeftImage" />}
          {amount}
          {showCardNum ? <CardNumIcon className="cardIcon" isNormal={type === 'NORMAL'} /> : null}
        </CouponsLeft>
        <CouponsRight isRtl={isRtl} isLight={isLight} isChecked={checked}>
          {headerContent}
          <div className="tools">
            <ExpiredTime time={time} />
            {showCheckbox ? (
              <KuxCheckbox
                checkOptions={{
                  type: 1, // 1黑色 2 灰色
                  checkedType: 1, // 1黑色 2 绿色
                }}
                size="large"
                checked={checked}
                onChange={handleCheckbox}
                disabled={checkDisabled}
              />
            ) : null}
          </div>
          <div className="rules" onClick={onRules}>
            <span>{_t('trial2.rule.use')}</span>
            <RightOutlined />
          </div>
        </CouponsRight>
      </CouponsBox>
    </CouponsWrapper>
  );
};

export default React.memo(CouponDeductionCard);
