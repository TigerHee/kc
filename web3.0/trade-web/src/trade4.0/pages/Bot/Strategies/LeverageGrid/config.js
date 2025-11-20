/**
 * Owner: mike@kupotech.com
 */
import React from 'react';
// import { formatNumber, toCableCase, getAvailLang } from 'Bot/helper';
import { _t, _tHTML } from 'Bot/utils/lang';
import { siteCfg } from 'config';
import { Text } from 'Bot/components/Widgets';
import { floatToPercent, times100 } from '../../helper';
import styled from '@emotion/styled';
import { Divider } from '@kux/mui';
import { addDeposit } from 'LeverageGrid/services';

const { KUCOIN_HOST } = siteCfg;

export const DEFAULTSYMBOL = 'BTC/USDT';

// 提交数据格式
export const submitData = options => ({
  params: [
    {
      code: 'down',
      value: Number(options.down),
    },
    {
      code: 'up',
      value: Number(options.up),
    },
    {
      code: 'symbol',
      value: options.symbol,
    },
    {
      code: 'depth',
      value: Number(options.gridNum) + 1,
    },
    {
      code: 'limitAsset',
      value: Number(options.limitAsset),
    },
    {
      code: 'stopLossPrice',
      value: Number(options.stopLossPrice ?? 0),
    },
    {
      code: 'stopProfitPrice',
      value: Number(options.stopProfitPrice ?? 0),
    },
    {
      code: 'openUnitPrice',
      value: Number(options.openUnitPrice || 0),
    },
    {
      code: 'direction',
      value: options.direction,
    },
    {
      code: 'leverage',
      value: options.leverage,
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
  templateId: options.templateId,
  couponId: options.coupon?.id,
  prizeId: options.goldCoupon?.id,
  useBaseCurrency: false,
});

// 使用教程跳转地址
export const toturial = {
  en_US: `${KUCOIN_HOST}/support/20915718363417`,
  zh_CN: `${KUCOIN_HOST}/support/20915718363417`,
};

// 爆仓使用教程跳转地址
const liquidation = {
  en_US: `${KUCOIN_HOST}/support/900002181946`,
  zh_CN: `${KUCOIN_HOST}/zh-hant/support/900002181946`,
};
//
// export const jumpLiquidationDetails = () => {
//   const lang = getAvailLang();
//   jump(liquidation[lang]);
// };

// 方向 ==> 国际化key
export const directionLangCfg = {
  long: 'zuoduo',
  short: 'zuokong',
};
// 方向 ==> 显示文本的颜色
export const diectionColorCfg = {
  long: 'color-primary',
  short: 'color-secondary',
};

// 合约网格交易对的的图标地址
// https://assets3.staticimg.com/futures/ALICE.png

// 网格配置页面的说明文字
export const tipConfig = () => ({
  pricerange: {
    title: _t('futrgrid.pricerange'),
    content: _t('marginGrid.futurerangehint'),
    okText: _t('gridform24'),
  },
  3: {
    title: _t('gridform15'),
    content: _t('gridformTip6'),
    okText: _t('gridform24'),
  },
  4: {
    title: _t('gridform29'),
    content: _t('gridformTip7'),
    okText: _t('gridform24'),
  },
  stoppricelong: {
    title: _t('gridform21'),
    content: _t('futrgrid.stoppricehintlong'),
    okText: _t('gridform24'),
  },
  stoppriceshort: {
    title: _t('gridform21'),
    content: _t('futrgrid.stoppricehintshort'),
    okText: _t('gridform24'),
  },
  6: {
    title: _t('openprice'),
    content: _t('gridformTip9'),
    okText: _t('gridform24'),
  },
  stopprofitpricelong: {
    title: _t('stopprofit'),
    content: _t('stopprofitpricehintlong'),
    okText: _t('gridform24'),
  },
  stopprofitpriceshort: {
    title: _t('stopprofit'),
    content: _t('stopprofitpricehintshort'),
    okText: _t('gridform24'),
  },
  openpricelong: {
    title: _t('openprice'),
    content: _t('futrgrid.openpricelong'),
    okText: _t('gridform24'),
  },
  openpriceshort: {
    title: _t('openprice'),
    content: _t('futrgrid.openpriceshort'),
    okText: _t('gridform24'),
  },
  // 网格利润
  gridprofit: {
    title: _t('card8'),
    content: _t('futrgrid.classgridprofit'),
    okText: _t('gridform24'),
    cancelText: null,
  },
  // 浮动盈亏
  float: {
    title: _t('card9'),
    content: _t('futrgrid.floathint'),
    okText: _t('gridform24'),
    cancelText: null,
  },
  // 负债率
  debtrate: {
    title: _t('debtrate'),
    content: _t('futrgrid.fundingfeehint'),
    okText: _t('clsgrid.btchintcancel'),
    cancelText: _t('gridform24'),
    moreLinks: {
      en_US: `${KUCOIN_HOST}/support/900005080563-Futures-Encyclopedia-01-What-is-a-Funding-Rate-`,
      zh_CN: `${KUCOIN_HOST}/zh-hans/support/900005080563-%E4%B8%80%E6%96%87%E6%90%9E%E6%87%82%E8%B5%84%E9%87%91%E8%B4%B9%E7%8E%87`,
    },
  },
  // 超出区间提示
  priceoutrange: {
    title: _t('goodhint'),
    content: _tHTML('futrgrid.priceoutrange'),
    okText: _t('gridform24'),
    cancelText: null,
  },
  noticeOutbound: {
    title: _t('outrangehint'),
    content: _t('outrangecontent'),
    okText: _t('gridform24'),
    cancelText: null,
  },
  risknoticecontent: {
    title: _t('futrgrid.riskhint'),
    content: _t('risknoticecontent'),
    okText: _t('gridform24'),
    cancelText: null,
  },
});

/**
 * @description: 展示负债率
 * @param {*} debtRate
 * @return {*}
 */
export const DebtRate = ({ debtRate }) => {
  if (!debtRate) return '--';
  const { langKey, color } = getDebtRateCfg(debtRate);
  return (
    <Text color={color} fs={12}>
      {floatToPercent(debtRate)}({_t(langKey)})
    </Text>
  );
};

// 负债率文本颜色配置
export const getDebtRateCfg = (debtRate) => {
  debtRate = times100(debtRate, 2);
  let meta = {};
  if (debtRate < 80) {
    meta = {
      langKey: 'futrgrid.lowrisk',
      noticeKey: null,
      isShowNotice: false,
      color: 'primary',
    };
  } else if (debtRate >= 80 && debtRate < 90) {
    meta = {
      langKey: 'futrgrid.midrisk',
      noticeKey: 'liquidationhint1',
      isShowNotice: true,
      color: 'complementary',
    };
  } else {
    meta = {
      langKey: 'futrgrid.highrisk',
      noticeKey: 'liquidationhint2',
      isShowNotice: true,
      color: 'secondary',
    };
  }
  return meta;
};

const Content = styled.div`
  br {
    margin-bottom: 12px;
  }
`;

export const DebtRateTip = ({ debtRate }) => {
  const { color } = getDebtRateCfg(debtRate);

  return (
    <Content>
      <div className="Flex vc sb">
        <Text color="text60">{_t('debtrate')}</Text>
        <Text color={debtRate ? color : 'text60'} fs={18}>
          {debtRate ? floatToPercent(debtRate) : '--'}
        </Text>
      </div>
      <Divider />
      <Text as="div" fs={14} color="text60">
        {_tHTML('debtratedescription')}
      </Text>
    </Content>
  );
};


/**
 * @description: 追加保证金弹窗的接口配置
 */
export const addMarginApiConfig = {
  submit: addDeposit,
};
