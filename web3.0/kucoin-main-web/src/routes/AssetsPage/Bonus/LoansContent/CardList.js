/**
 * Owner: odan.ou@kupotech.com
 */
import React, { useCallback } from 'react';
import { map } from 'lodash';
import { useLocale } from '@kucoin-base/i18n';
import { styled, Button, useTheme } from '@kux/mui';
import { _t } from 'tools/i18n';
import usedImg from 'static/margin-v2/used.svg';
import expiredImg from 'static/margin-v2/expired.svg';
import { couponUse } from 'src/services/bonus';
import { useFetchHandle } from 'hooks';
import { push } from 'utils/router';
import { divide } from 'helper';
import { Link } from 'components/Router';
import NumberFormat from 'components/common/NumberFormat';
import { DayTimeFormatOptions, formatDateTime } from './utils';

import discountExpiredDark from 'static/margin-v2/discount-expired-dark.svg';
import discountExpiredLight from 'static/margin-v2/discount-expired-light.svg';
import discountUseDark from 'static/margin-v2/discount-use-dark.svg';
import discountUseLight from 'static/margin-v2/discount-use-light.svg';
import leverageUseImg from 'static/margin-v2/leverage-use.svg';
import leverageExpiredImg from 'static/margin-v2/leverage-expired.svg';

const getDiscountBg = (theme, canUse) => {
  if (theme === 'dark') {
    return canUse ? discountUseDark : discountExpiredDark;
  }
  return canUse ? discountUseLight : discountExpiredLight;
};

const CardContentLeftWidth = '88px';

const Container = styled.section`
  /* margin-top: 24px; */
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    margin-bottom: 40px;
  }
  /* justify-content: space-between; */
`;

const CardWrap = styled.div`
  position: relative;
  border-radius: 8px;
  background: ${(props) => props.theme.colors.overlay};
  border: 1px solid ${(props) => props.theme.colors.divider8};
  ${({ theme }) => theme.breakpoints.up('lg')} {
    width: calc((100% - 80px) / 3);
    margin-top: 40px;
    &:nth-of-type(-n + 3) {
      margin-top: 24px;
    }
    &:not(:nth-of-type(3n + 1)) {
      margin-left: 40px;
    }
  }
  ${({ theme }) => theme.breakpoints.down('lg')} {
    width: calc((100% - 16px) / 2);
    margin-top: 16px;
    &:nth-of-type(-n + 2) {
      margin-top: 24px;
    }
    &:not(:nth-of-type(2n + 1)) {
      margin-left: 16px;
    }
  }
  ${({ theme }) => theme.breakpoints.down('sm')} {
    width: 100%;
    margin-top: 16px !important;
    margin-left: 0 !important;
    &:first-of-type {
      margin-top: 24px !important;
    }
  }
`;

const CardContent = styled.div`
  width: 100%;
  height: 150px;
  display: flex;
`;

const CardContentLeft = styled.div`
  width: ${CardContentLeftWidth};
  height: 100%;
  flex-shrink: 0;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  &:before {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 0;
    width: 100%;
    height: 100%;
    background-image: url(${(props) => getDiscountBg(props.currentTheme, props.canUse)});
    background-position: center;
    background-size: cover;
    transform: scaleX(${(props) => (props.isRTL ? -1 : 1)});
    content: '';
  }
  > div {
    position: absolute;
    top: 0;
    left: -2px;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    color: ${(props) => (props.canUse ? '#7780df' : props.theme.colors.text40)};
    .coupon_discount_rate {
      font-weight: 600;
      font-size: 32px;
    }
    .coupon_discount_label {
      font-weight: 500;
      font-size: 14px;
    }
  }
`;

const CardContentRight = styled.div`
  height: 100%;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 16px;
  font-size: 12px;
  font-weight: 400;
  color: ${(props) => props.theme.colors.text40};
`;

const CardContentRightTitle = styled.div`
  font-size: 16px;
  font-weight: 500;
  color: ${(props) => (props.canUse ? props.theme.colors.text : props.theme.colors.text40)};
  margin-bottom: 4px;
`;

const CardContentRightDay = styled.div`
  border-radius: 2px;
  padding: 1px 4px;
  font-size: 12px;
  font-weight: 500;
  margin-top: 8px;
  border: 0.5px solid ${(props) => props.theme.colors.cover12};
  background: ${(props) => props.theme.colors.cover4};
  color: ${(props) => props.theme.colors.text60};
  display: inline-block;
`;

const CardTagTitle = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  padding: 2px 8px 2px 12px;
  font-size: 12px;
  font-weight: 500;
  border-radius: 0px 7px 0px 8px;
  ${(props) => {
    if (props.partUsed) {
      return `
        background: rgba(248, 178, 0, 0.12);
        color: #f8b200;
        color: ${props.theme.colors.complementary};
        background: ${props.theme.colors.complementary12};
      `;
    }
    return `
      color: ${props.theme.colors.primary};
      background: ${props.theme.colors.primary12};
    `;
  }}
`;

const CardTagImg = styled.img`
  position: absolute;
  bottom: 0;
  right: 0;
  width: 77px;
  height: 70px;
`;

const ButtonWrap = styled(Link)`
  flex-shrink: 0;
  margin-left: 8px;
`;

const CircleTop = styled.div`
  position: absolute;
  width: 14px;
  height: 7px;
  border-bottom-right-radius: 7px;
  border-bottom-left-radius: 7px;
  left: calc(${CardContentLeftWidth} - 11px);
  background: ${(props) => props.theme.colors.overlay};
  border: 1px solid ${(props) => props.theme.colors.divider8};
  box-sizing: content-box;
  border-top: none;
  top: -1px;
`;

const CircleBtoom = styled.div`
  position: absolute;
  width: 14px;
  height: 7px;
  border-top-right-radius: 7px;
  border-top-left-radius: 7px;
  left: calc(${CardContentLeftWidth} - 11px);
  background: ${(props) => props.theme.colors.overlay};
  border: 1px solid ${(props) => props.theme.colors.divider8};
  border-bottom: none;
  box-sizing: content-box;
  bottom: -1px;
`;

const BottomInfoBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const LeverageImg = styled.img`
  position: absolute;
  left: 50%;
  bottom: 0;
  transform: translateX(-50%);
`;

const Card = (props) => {
  const { currentTheme } = useTheme();
  const { currentLang, isRTL } = useLocale();
  const { data, onRefresh, userId } = props;

  const {
    currency,
    discount,
    currencyName,
    couponQuota,
    deadline,
    expiredDate,
    activityId,
    couponId,
    state,
    discountedAmount,
    id,
  } = data;

  // INIT: 未领取
  // UNUSE: 未使用
  // USING: 使用中
  // EXPIRED: 过期
  // FINISH: 已使用完
  const isUnuse = state === 'UNUSE' || state === 'INIT';
  const isUsing = state === 'USING';
  const partUsed = isUnuse && discountedAmount !== couponQuota && Number(discountedAmount) !== 0;
  const isFinished = state === 'FINISH';
  const isExpired = state === 'EXPIRED' || state === 'INVALID';
  const canUse = !isExpired && !isFinished;
  const time = expiredDate
    ? formatDateTime({
        currentLang,
        time: expiredDate,
        options: DayTimeFormatOptions,
      })
    : '--';

  const { fetchHandle, loading } = useFetchHandle();
  const onClick = useCallback(
    (e) => {
      e.stopPropagation();
      fetchHandle(
        couponUse({
          activityId,
          userId,
          couponId,
        }),
        {
          onOk() {
            onRefresh();
            return _t('assets.margin.bonus.detail.use.ok');
          },
        },
      );
    },
    [userId, activityId, couponId],
  );

  const showDetail = useCallback(() => {
    if (!id) return;
    push(`/assets/bonus/loans/${id}`);
  }, [id]);

  return (
    <CardWrap onClick={showDetail} className="pointer">
      {(isUsing || partUsed) && (
        <CardTagTitle partUsed={partUsed}>
          {partUsed ? _t('assets.margin.bonus.inuse.part') : _t('assets.margin.bonus.inuse')}
        </CardTagTitle>
      )}
      {!!(isFinished || isExpired) && <CardTagImg src={isExpired ? expiredImg : usedImg} />}
      <CircleTop />
      <CircleBtoom />
      <CardContent>
        <CardContentLeft canUse={canUse} currentTheme={currentTheme} isRTL={isRTL}>
          <LeverageImg src={canUse ? leverageUseImg : leverageExpiredImg} alt="leverage" />
          <div>
            <div className="coupon_discount_rate">
              <NumberFormat options={{ style: 'percent' }}>{divide(discount, 100, 2)}</NumberFormat>
            </div>
            <div className="coupon_discount_label">{_t('assets.margin.bonus.discount.title')}</div>
          </div>
        </CardContentLeft>
        <CardContentRight>
          <div>
            <CardContentRightTitle canUse={canUse}>
              {_t('assets.bonus.loans')}
            </CardContentRightTitle>
            <div>
              {_t('assets.margin.bonus.reduction.des', { n: couponQuota, c: currencyName })}
            </div>
            {!!deadline && (
              <CardContentRightDay>
                {deadline}
                {_t('vJ4PsAteE4AVabdNsxebt6')}
              </CardContentRightDay>
            )}
          </div>
          <BottomInfoBar>
            <div style={{ lineHeight: '130%' }}>
              {state === 'INIT'
                ? _t('ntAcVp6wDWin4H8biJcohT', { time })
                : _t('jDEhNXugdmGHkPNuwDZhpE', { time })}
            </div>
            {isUnuse && (
              <ButtonWrap
                onClick={(e) => e.stopPropagation()}
                to={`/trade/margin/${currency === 'USDT' ? 'BTC-USDT' : `${currency}-USDT`}`}
              >
                <Button size="small">{_t('trade')}</Button>
              </ButtonWrap>
            )}
          </BottomInfoBar>
        </CardContentRight>
      </CardContent>
    </CardWrap>
  );
};

const CardList = (props) => {
  const { list, ...others } = props;
  return (
    <Container>
      {map(list, (item) => (
        <Card key={item.id} {...others} data={item} />
      ))}
    </Container>
  );
};

export default CardList;
