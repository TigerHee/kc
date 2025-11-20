/*
 * owner: solar@kupotech.com
 */
import Dialog from '@mui/Dialog';

import React from 'react';
import { showDateTimeByZone } from 'helper';
import ToolTip from '@mui/Tooltip';
import Empty from '@mui/Empty';
import { _t, _tHTML } from 'src/utils/lang';
import { styled, css } from '@/style/emotion';
import { intlFormatNumber, intlFormatDate } from '@/hooks/common/useIntlFormat';
import { formatNumber } from '@/utils/format';
import { useSelector } from 'dva';
import DarkBg from '@/assets/coupon/spot-dark-bg.svg';
import LightBg from '@/assets/coupon/spot-light-bg.svg';
import useIsH5 from 'src/trade4.0/hooks/useIsH5';

const Ellipsis = css`
  text-overflow: ellipsis;
  overflow: hidden;
  width: 100%;
  white-space: nowrap;
`;
const StyledDialog = styled(Dialog)`
  .coupons-container {
    max-height: ${props => (props.isH5 ? 'none' : '390px')};
    overflow-y: scroll;
  }
  &.KuxDialog-root {
    z-index: 1700 !important;
  }
  &.KuxDrawer-mask {
    z-index: 1700 !important;
  }
  .KuxMDialog-content {
    position: relative;
  }
  .empty-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 233px;
  }
  .confirm-button {
    position: absolute;
    bottom: 34px;
    left: 16px;
    right: 16px;
  }
`;
const StyledCoupon = styled.div`
  height: 148px;
  display: flex;
  border-radius: 8px;
  justify-content: center;
  align-items: center;
  width: 100%;
  &:not(:last-of-type) {
    margin-bottom: 16px;
  }
  .coupon-left {
    width: 96px;
    height: 100%;
    color: #7780df;
    font-family: Roboto;
    background-repeat: no-repeat;
    background-image: ${(props) =>
    (props.theme.currentTheme === 'dark' ? `url(${DarkBg})` : `url(${LightBg})`)};
    position: relative;
    [dir='rtl'] & {
      transform: rotateY(180deg);
    }
    .coupon-left-content {
      display: flex;
      flex-direction: column;
      justify-content: center;
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      [dir='rtl'] & {
        transform: rotateY(180deg);
      }
      .available {
        font-style: normal;
        font-weight: 600;
        font-size: 36px;
        line-height: 130%;
        text-align: center;
        transform: translateX(-5px);
        word-break: break-all;
      }
      .currency {
        font-style: normal;
        font-weight: 500;
        font-size: 12px;
        line-height: 130%;
        text-align: center;
        transform: translateX(-5px);
      }
    }
  }
  .coupon-right {
    ${(props) =>
      (props.theme.currentTheme === 'dark'
        ? css`
            border: 0.5px solid #303643;
            background-color: #16181d;
          `
        : css`
            border: 0.5px solid #ebeced;
            background-color: #fff;
          `)};
    height: 100%;
    font-style: normal;
    width: calc(100% - 96px);
    padding-top: 16px;
    padding-left: 10px;
    padding-right: 10px;
    border-top-right-radius: 8px;
    border-bottom-right-radius: 8px;
    border-left: 0;
    position: relative;
    .title {
      font-weight: 500;
      ${(props) => props.theme.fonts.size.xl}
      width: 100%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      cursor: pointer;
      color: ${(props) => props.theme.colors.text};
    }
    .desc {
      margin-top: 8px;
      font-weight: 400;
      ${(props) => props.theme.fonts.size.md}
      ${Ellipsis}
    }
    .time {
      display: flex;
      ${(props) => props.theme.fonts.size.md}
      align-items: center;
      position: absolute;
      bottom: 16px;
      left: 9px;
      .tag {
        height: 18px;
        border: 0.5px solid ${(props) => props.theme.colors.cover12};
        color: ${(props) => props.theme.colors.text60};
        background-color: ${(props) => props.theme.colors.cover4};
        border-radius: 2px;
        margin-right: 8px;
        padding: 0 2px;
        display: inline;
      }
      .utcTime {
        font-weight: 400;
        flex: 1;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }
    }
  }
`;
function Coupon(props) {
  const couponName = _t('86JnPWgqHWkaXT5c9cmqxr');
  const { amount, available, currency, deductRatio, expireTime, key } = props;
  return (
    <StyledCoupon key={key}>
      <div className="coupon-left">
        <div className="coupon-left-content">
          <div className="available">{formatNumber(available, {
          fixed: 2,
        })}</div>
          <div className="currency">{currency}</div>
        </div>
      </div>
      <div className="coupon-right">
        <ToolTip title={couponName} placement="top">
          <div className="title">{couponName}</div>
        </ToolTip>
        <div className="desc">
          {_tHTML('6iwcNmC9Nc6gVubsMTiTYx', {
            num: amount,
            coin: currency,
            ratio: intlFormatNumber({
              options: { style: 'percent' },
              number: deductRatio,
            }),
          })}
        </div>
        <div className="time">
          <div className="tag">{_t('r1pExPBTKXiYz571cu5Lw5')}</div>
          <div className="utcTime">
            {_t('mHToKi7vyU4njWAGkNjtUz', {
              time: `${intlFormatDate({
                date: expireTime,
                options: { timeZone: 'UTC', second: undefined },
              })} (UTC)`,
            })}
          </div>
        </div>
      </div>
    </StyledCoupon>
  );
}
export default function CouponDialog({ open, setDialogClose }) {
  const isH5 = useIsH5();
  const usableCouponList = useSelector(
    (state) => state.coupon.usableCouponList,
  );
  return (
    <StyledDialog
      title={_t('5Lbgtjk9hVFuLzksrjx2B6')}
      cancelText=""
      okText={_t('confirm')}
      open={open}
      height="90%"
      contentPadding="16px 16px"
      onOk={setDialogClose}
      onCancel={setDialogClose}
      size="medium"
      isH5={isH5}
    >
      <div className="coupons-container">
        {usableCouponList.map((coupon, index) => (
          <Coupon {...{ ...coupon, key: index }} />
        ))}
        {usableCouponList.length === 0 && (
          <div className="empty-container">
            <Empty size="small" />
          </div>
        )}
      </div>
    </StyledDialog>
  );
}
