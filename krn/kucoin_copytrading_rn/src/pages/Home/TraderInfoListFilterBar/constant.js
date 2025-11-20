// 按照收益额排序  收益率：totalPnlRatio，收益额：pnl，

import {useMemo} from 'react';
import {getBaseCurrency} from 'site/tenant';

import useLang from 'hooks/useLang';

// 综合排序：ranking_score ,带单规模：leadAmount，跟单者受益：followerPnl，当前跟单人数：currentCopyUserCount
export const useMakeRankListSortOptions = () => {
  const {_t} = useLang();
  return [
    {
      label: _t('71a5a94cc9854000ab65'),
      value: 'ranking_score',
    },
    {
      label: _t('35ab2ab6ea154000aab7'),
      value: 'thirty_day_pnl_ratio', // 收益率：totalPnlRatio
    },
    {
      label: _t('93b66918b8694000ad0a'),
      value: 'thirty_day_pnl', // 收益额：pnl
    },
    {
      label: _t('e461001a08094000a254'),
      value: 'lead_amount', // 带单规模：leadAmount
    },
    {
      label: _t('1357e085a5c94000a18e'),

      value: 'follower_pnl', // 跟单者收益：followerPnl
    },
    {
      label: _t('63864d9fe0904000ae98'),
      value: 'current_copy_user_count', // 当前跟单人数：currentCopyUserCount
    },
  ];
};

export const RANK_LIST_SORT_DESC_TYPE = {
  DESC: 'DESC', // 倒序排列（从大到小）
  ASC: 'ASC',
};

export const SLIDE_ALLOW_UPPER_LIMIT_KEYS = {
  principal: 'lead_principal',
  assetManagement: 'lead_amount',
  income: 'thirty_day_pnl',
  profitRate: 'thirty_day_pnl_ratio',
};

export const SLIDE_UPPER_LIMIT_MAPS = {
  principal: 50000,
  assetManagement: 500000,
  income: 5000,
  profitRate: 500,
};
export const useMakeConditionSlideGroupConfigs = () => {
  const {_t} = useLang();

  const configs = useMemo(
    () => [
      [
        {
          label: _t('102402363bc34000ab7f', {symbol: getBaseCurrency()}),
          maximumValue: SLIDE_UPPER_LIMIT_MAPS.principal,
          allowUpperLimit: true, // 表示允许超过上限
          minimumValue: 0,
          key: SLIDE_ALLOW_UPPER_LIMIT_KEYS.principal,
          stepGap: 10,
        },
        {
          label: _t('8d73446ded454000ae7b', {symbol: getBaseCurrency()}),
          maximumValue: SLIDE_UPPER_LIMIT_MAPS.assetManagement,
          allowUpperLimit: true,
          minimumValue: 0,
          key: SLIDE_ALLOW_UPPER_LIMIT_KEYS.assetManagement,
          stepGap: 10,
        },
      ],
      [
        {
          label: _t('67549728b6184000aa39', {symbol: getBaseCurrency()}),
          maximumValue: SLIDE_UPPER_LIMIT_MAPS.income,
          allowUpperLimit: true,
          minimumValue: 0,
          key: SLIDE_ALLOW_UPPER_LIMIT_KEYS.income,
          stepGap: 10,
        },
        {
          label: _t('f3c52c8343604000ad7d'),
          maximumValue: SLIDE_UPPER_LIMIT_MAPS.profitRate,
          allowUpperLimit: true,
          minimumValue: 0,
          key: SLIDE_ALLOW_UPPER_LIMIT_KEYS.profitRate,
          stepGap: 20,
        },
      ],
    ],
    [_t],
  );
  return configs;
};

export const OutSelectValue2TrackIdMap = {
  thirty_day_pnl_ratio: 'tabRoi',
  thirty_day_pnl: 'tabProfit', // 收益额：pnl
  lead_amount: 'tabAum', // 带单规模：leadAmount
  follower_pnl: 'tabCopyProfit', // 跟单者收益：followerPnl
  current_copy_user_count: 'tabCopyNum', // 当前跟单人数：currentCopyUserCount
};
