/**
 * Owner: mike@kupotech.com
 */
import React from 'react';
// import { formatNumber, toCableCase, getAvailLang } from 'Bot/helper';
import { _t, _tHTML } from 'Bot/utils/lang';
import { siteCfg } from 'config';
import { Text, Flex } from 'Bot/components/Widgets';

const { KUCOIN_HOST } = siteCfg;

export const DEFAULTSYMBOL = 'BTC/USDT';

const templateId = 11;
// 提交数据格式
export const submitData = options => ({
  params: [
    {
      code: 'symbol',
      value: options.symbol,
    },
    {
      code: 'limitAsset',
      value: Number(options.limitAsset),
    },
    {
      code: 'createEntrance',
      value: options.createEntrance || 'otherCreate',
    },
    {
      code: 'createWay',
      value: options.createWay,
    },
  ],
  templateId,
  couponId: options.coupon?.id,
  prizeId: options.goldCoupon?.id,
  useBaseCurrency: false,
});

// 使用教程跳转地址
export const toturial = {
  en_US: `${KUCOIN_HOST}/support/24145619159577`,
  zh_CN: `${KUCOIN_HOST}/support/24145619159577`,
};

// 网格配置页面的说明文字
export const tipConfig = () => ({
  realizedProfit: {
    // 实现盈亏
    title: _t('realizedProfit'),
    content: _t('realizedProfitContent'),
    okText: _t('gridform24'),
  },
  float: {
    // 浮动赢亏
    title: _t('floatTitle'),
    content: _t('futrgrid.floathint'),
    okText: _t('gridform24'),
  },
  'futurecta.float': {
    // 浮动赢亏
    title: _t('floatTitle'),
    content: _t('futurecta.float'),
    okText: _t('gridform24'),
  },
  shorttimetrend: {
    // 短期趋势
    title: _t('shorttimetrend'),
    content: _t('shorttimetrend.hint'),
    okText: _t('gridform24'),
  },
  currentcost: {
    // 持仓成本
    title: _t('currentcost'),
    content: _t('positionsavg.hint'),
    okText: _t('gridform24'),
  },
  tendsize: {
    // 趋势强度
    title: _t('tendsize'),
    content: _t('tendsize.hint'),
    okText: _t('gridform24'),
  },
  direction: {
    // 持仓方向
    // 合约CTA用
    title: _t('positiondirection'),
    content: _t('positiondirection.hint'),
    okText: _t('gridform24'),
  },
  bearmaxback: {
    // 可承受回撤
    // 合约CTA用
    title: _t('bearmaxback'),
    content: _t('bearmaxback.note'),
    okText: _t('gridform24'),
  },
  lot: {
    // 张
    // 合约CTA用
    title: _t('futrgrid.chichangnum'),
    content: _t('nSb7K5Muxan1E2pmv1zENR'),
    okText: _t('gridform24'),
  },
});

export const getTrendText = trend => {
  if (trend === 'up') {
  return <Text color="primary">{_t('up')}</Text>;
  }
  if (trend === 'down') {
    return <Text color="secondary">{_t('down')}</Text>;
  }
  return '--';
};
