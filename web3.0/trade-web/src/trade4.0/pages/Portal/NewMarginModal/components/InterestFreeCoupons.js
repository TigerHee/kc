/*
 * owner: borden@kupotech.com
 */
import React, { useState, useCallback } from 'react';
import styled from '@emotion/styled';
import { map } from 'lodash';
import { useTheme } from '@emotion/react';
import { useSnackbar } from '@kux/mui/hooks';
import { ICArrowRightOutlined } from '@kux/icons';
import Button from '@mui/Button';
import Spin from '@mui/Spin';
import TooltipOver from '@/components/TooltipOver';
import useRequest from '@/hooks/common/useRequest';
import { useIsRTL } from '@/hooks/common/useLang';
import { _t } from 'src/utils/lang';
import { showDatetime, floadToPercent } from 'src/helper';
import {
  toUseCoupon,
  getCouponsView,
  getUsableCoupons,
} from 'src/services/bonus';
import { StyledDialog } from '../style';
import { PositionRow, PositionLabel } from './InfoPanel';
import couponDark from '@/assets/margin/coupon-dark.png';
import couponLight from '@/assets/margin/coupon-light.png';
import couponRtlDark from '@/assets/margin/coupon-rtl-dark.png';
import couponRtlLight from '@/assets/margin/coupon-rtl-light.png';

const getBgImages = (isRTL) =>
  (isRTL
    ? {
        dark: couponRtlDark,
        light: couponRtlLight,
      }
    : {
        dark: couponDark,
        light: couponLight,
      });

/** 样式开始 */
const StyledButton = styled(Button)`
  margin-top: 5px;
  margin-left: 4px;
`;
const InterestFreeCouponButton = styled.span`
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 14px;
  color: ${(props) => props.theme.colors.primary};
  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 12px;
  }
`;
const List = styled.div`
  height: 436px;
  padding: 0 32px;
  overflow-y: auto;
  ${(props) => props.theme.breakpoints.down('sm')} {
    height: auto;
    padding: 0;
    overflow-y: unset;
  }
`;
const Item = styled.div`
  display: flex;
  overflow: hidden;
  margin-top: 24px;
  position: relative;
  &:not(:first-of-type) {
    margin-top: 16px;
  }
  &:last-of-type {
    margin-bottom: 24px;
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    margin-top: 0;
    &:last-of-type {
      margin-bottom: 0;
    }
  }
`;
const LeftBox = styled.div`
  width: 100px;
  min-width: 100px;
  border-radius: 8px;
  background: url(${(props) => props.bg}) no-repeat 0 0;
  background-size: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #7780df;
`;
const RightBox = styled.div`
  flex: 1;
  overflow: hidden;
  min-height: 125px;
  border: 1px solid ${(props) => props.theme.colors.divider8};
  border-left-width: 0;
  border-radius: 8px;
  padding: 20px 16px 0 24px;
`;
const Circle = styled.div`
  position: absolute;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: ${(props) => props.theme.colors.layer};
  border: 1px solid ${(props) => props.theme.colors.divider8};
  left: 90px;
  ${(props) => {
    return `
      ${props.placement}: -10px;
    `;
  }}
`;
const DiscountRate = styled.div`
  font-size: 36px;
  font-weight: 700;
  line-height: 130%;
`;
const DiscountLabel = styled.div`
  font-weight: 500;
  font-size: 12px;
  line-height: 130%;
`;
const Title = styled.div`
  font-size: 16px;
  font-weight: 500;
  line-height: 130%;
  color: ${(props) => props.theme.colors.text};
`;
const Describe = styled.div`
  font-size: 12px;
  margin-top: 4px;
  line-height: 130%;
  color: ${(props) => props.theme.colors.text40};
`;
const Footer = styled.div`
  display: flex;
  margin-top: 11px;
`;
const LeftInfo = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  flex: 1;
  overflow: hidden;
`;
const ExpirationDate = styled.div`
  border-radius: 2px;
  font-size: 12px;
  font-weight: 500;
  height: 18px;
  line-height: 18px;
  padding: 0 4px;
  margin-right: 8px;
  margin-top: 5px;
  white-space: nowrap;
  color: ${(props) => props.theme.colors.text60};
  border: 1px solid ${(props) => props.theme.colors.cover12};
  background: ${(props) => props.theme.colors.cover4};
`;
const Expired = styled.div`
  margin-top: 8px;
  font-size: 12px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: ${(props) => props.theme.colors.text40};
  ${(props) => props.theme.breakpoints.up('sm')} {
    line-height: 130%;
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    margin-top: 6px;
  }
`;
const StatusFlag = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  height: 20px;
  padding: 0 8px;
  font-size: 12px;
  font-weight: 500;
  line-height: 20px;
  border-radius: 0 8px 0 8px;
  ${(props) => {
    if (props.partUsed) {
      return `
        color: ${props.theme.colors.complementary};
        background-color: ${props.theme.colors.complementary8};
      `;
    }
    return `
      color: ${props.theme.colors.primary};
      background-color: ${props.theme.colors.primary8};
    `;
  }}
`;
/** 样式结束 */

// 单独一张免息券
const InterestFreeCoupon = React.memo((props) => {
  const isRTL = useIsRTL();
  const { message } = useSnackbar();
  const { currentTheme } = useTheme();
  const {
    state,
    onCancel,
    deadline,
    couponId,
    discount,
    activityId,
    couponQuota,
    currencyName,
    expiredDate,
    discountedAmount,
  } = props;

  const { run, loading: confirmLoading } = useRequest(
    () => toUseCoupon({ couponId, activityId }),
    {
      manual: true,
      onSuccess: (res) => {
        if (res.success) {
          message.success(_t('operation.succeed'));
          if (onCancel) onCancel(res.success);
        }
      },
    },
  );

  const isUsing = state === 'USING';
  const isUnuse = ['UNUSE', 'INIT'].includes(state);
  const partUsed =
    isUnuse &&
    discountedAmount !== couponQuota &&
    Number(discountedAmount) !== 0;
  const time = expiredDate
    ? showDatetime(expiredDate, 'YYYY/MM/DD HH:mm')
    : '--';

  return (
    <Item>
      <Circle placement="top" />
      <Circle placement="bottom" />
      <LeftBox bg={getBgImages(isRTL)[currentTheme] || getBgImages(isRTL).dark}>
        <div className="text-center">
          <DiscountRate>{floadToPercent(discount / 100)}</DiscountRate>
          <DiscountLabel>
            {_t('assets.margin.bonus.discount.title')}
          </DiscountLabel>
        </div>
      </LeftBox>
      <RightBox>
        <Title>{_t('assets.bonus.loans')}</Title>
        <Describe>
          {_t('assets.margin.bonus.reduction.des', {
            n: couponQuota,
            c: currencyName,
          })}
        </Describe>
        <Footer>
          <LeftInfo>
            {Boolean(deadline) && (
              <ExpirationDate>
                {deadline}
                {_t('vJ4PsAteE4AVabdNsxebt6')}
              </ExpirationDate>
            )}
            <Expired>
              <TooltipOver placement="top">
                {state === 'INIT'
                  ? _t('ntAcVp6wDWin4H8biJcohT', { time })
                  : _t('jDEhNXugdmGHkPNuwDZhpE', { time })}
              </TooltipOver>
            </Expired>
          </LeftInfo>
          {/* 防止loading前后卡券UI的跳动 */}
          {!confirmLoading && <div style={{ width: 18 }} />}
          {isUnuse && (
            <StyledButton size="mini" onClick={run} loading={confirmLoading}>
              {_t('uv6fEnuzWhHUWFmVbGiJge')}
            </StyledButton>
          )}
        </Footer>
      </RightBox>
      {(isUsing || partUsed) && (
        <StatusFlag partUsed={partUsed}>
          {partUsed
            ? _t('assets.margin.bonus.inuse.part')
            : _t('assets.margin.bonus.inuse')}
        </StatusFlag>
      )}
    </Item>
  );
});
// 免息券选择
const InterestFreeCoupons = React.memo(({ currency }) => {
  const { colors } = useTheme();

  const { data: couponsView, refresh } = useRequest(
    () => getCouponsView({ currency }),
    {
      refreshDeps: [currency],
      ready: Boolean(currency),
      formatResult: (v) => v?.data,
      cacheKey: `couponsView_${currency}`,
    },
  );
  const { loading, run: pullUsableCoupons, data: coupons } = useRequest(
    () => getUsableCoupons({ currency }),
    {
      manual: true,
      ready: Boolean(currency),
      formatResult: (v) => v?.data,
      cacheKey: `usableCoupons_${currency}`,
    },
  );

  const [open, setOpen] = useState(false);

  const handleClick = useCallback(() => {
    setOpen(true);
    pullUsableCoupons();
  }, []);

  const handleCancel = useCallback((success) => {
    setOpen(false);
    if (success === true) {
      refresh();
    }
  }, []);

  if (!couponsView?.couponNotUseNum && !couponsView?.usingCoupon) return null;

  return (
    <PositionRow>
      <PositionLabel>{_t('iZEfyAb6Ae2JYg38o4Rspd')}</PositionLabel>
      <InterestFreeCouponButton onClick={handleClick}>
        {couponsView?.usingCoupon
          ? _t('pGuDQG55HbnF3QptGuw4qX', {
              a: couponsView.usingCoupon.discount,
            })
          : _t('g81XK7rPfEBJweqwxiUpmm', { a: couponsView.couponNotUseNum })}
        <ICArrowRightOutlined
          size={16}
          color={colors.icon}
          className="horizontal-flip-in-arabic"
        />
      </InterestFreeCouponButton>
      <StyledDialog
        isScroll
        open={open}
        height="90%"
        footer={null}
        size="medium"
        onCancel={handleCancel}
        headerProps={{ border: true }}
        title={_t('iZEfyAb6Ae2JYg38o4Rspd')}
      >
        <Spin spinning={loading}>
          <List>
            {map(coupons, (item) => {
              const { couponId } = item;
              return (
                <InterestFreeCoupon
                  key={couponId}
                  {...item}
                  onCancel={handleCancel}
                />
              );
            })}
          </List>
        </Spin>
      </StyledDialog>
    </PositionRow>
  );
});

export default InterestFreeCoupons;
