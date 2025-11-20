/**
 * Owner: odan.ou@kupotech.com
 */
import React, { memo, useMemo } from 'react';
import { _t } from 'tools/i18n';
import { divide, subAndFixed } from 'helper';
import { styled } from '@kux/mui/emotion';
import NumberFormat from 'components/common/NumberFormat';
import { getLabel, DayTimeFormatOptions, DateTimeFormat } from '../utils';

const getTheme = (props, colorKey) => {
  return props?.theme?.colors?.[colorKey];
};

const eTheme = (colorKey) => (props) => {
  return getTheme(props, colorKey);
};

const StateCardWrap = styled.div`
  margin-top: 20px;
  padding: 16px;
  display: flex;
  font-size: 14px;
  flex-wrap: wrap;
  border-radius: 16px;
  background: ${(props) => props.theme.colors.cover2};
`;

const StateCard = styled.div`
  width: 14.28%;
  /* height: 44px; */
  font-weight: 400;
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  ${({ theme }) => theme.breakpoints.down('lg')} {
    width: 25%;
    &:not(:nth-of-type(-n + 4)) {
      margin-top: 10px;
    }
  }
  ${({ theme }) => theme.breakpoints.down('sm')} {
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
    &:first-of-type {
      margin-top: 0px;
    }
    &:not(:first-of-type) {
      margin-top: 8px;
    }
  }
`;

const StateCardTitle = styled.div`
  font-size: 13px;
  line-height: 130%;
  color: ${(props) => props.theme.colors.text40};
`;

const StateCardVal = styled.div`
  font-size: 14px;
  font-weight: 500;
  line-height: 130%;
  margin-top: 2px;
  color: ${(props) => props.theme.colors.text};
`;

const StateLabel = styled.span`
  color: ${(props) => (props.isUsing ? props.theme.colors.primary : 'unset')};
`;

const StateCardList = (props) => {
  const { data } = props;
  const list = useMemo(() => {
    return [
      {
        title: _t('br1q2AUiUv5vwuZPwpwjfL'), // '状态',
        id: 'state',
        render(val) {
          const { title, isUsing } = getLabel(val);
          return <StateLabel isUsing={isUsing}>{title}</StateLabel>;
        },
      },
      {
        title: _t('assets.margin.bonus.detail.discount.rate'), // '折扣比例',
        id: 'discount',
        render(discount) {
          if (!discount) return '';
          return (
            <NumberFormat options={{ style: 'percent' }}>{divide(discount, 100, 2)}</NumberFormat>
          );
        },
      },
      {
        title: _t('earn.account.coupons.list.validTime'), // '有效期'
        id: 'deadline',
        render(val) {
          if (!val) return '';
          return `${val} ${_t('assets.bonus.day')}`;
        },
      },
      {
        title: _t('assets.margin.bonus.detail.discount.max'), // '最多折扣',
        id: 'couponQuota',
        render(val, { currencyName }) {
          if (!val) return '';
          return `${val} ${currencyName}`;
        },
      },
      {
        title: _t('assets.margin.bonus.detail.discount.used'), // '已抵扣',
        id: 'discountedAmount',
        render(val, { currencyName }) {
          if (!val) return '';
          return `${val} ${currencyName}`;
        },
      },
      {
        title: _t('otc.ads.tableHead.balance'), // '剩余'
        id: '_',
        render(_, { discountedAmount, couponQuota, currencyName }) {
          if (!couponQuota || !couponQuota) return '';
          return `${subAndFixed(couponQuota, discountedAmount)} ${currencyName}`;
        },
      },
      {
        title: _t('assets.margin.bonus.detail.failure.time'), // 失效时间
        id: 'expiredDate',
        render(time) {
          if (!time) return '';
          return <DateTimeFormat options={DayTimeFormatOptions}>{time}</DateTimeFormat>;
        },
      },
    ];
  }, [data]);
  return (
    <StateCardWrap>
      {list.map(({ id, title, render }) => {
        const val = data?.[id];
        return (
          <StateCard>
            <StateCardTitle>{title}</StateCardTitle>
            <StateCardVal>
              {(typeof render === 'function' ? render(val, data) : val) || '--'}
            </StateCardVal>
          </StateCard>
        );
      })}
    </StateCardWrap>
  );
};

export default memo(StateCardList);
