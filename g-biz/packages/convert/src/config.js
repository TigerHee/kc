/**
 * Owner: Borden@kupotech.com
 */
import { Trans } from '@tools/i18n';
import { createContext } from 'react';
import loadable from '@loadable/component';
import { keyframes, styled } from '@kux/mui';
import { getInnerUrl, list2map } from './utils/tools';

// 定义闪光动画
const shine = keyframes`
  0% {
    left: -100%;
  }
  20% {
    left: 100%;
  }
  100% {
    left: 100%;
  }
`;

const StyledUsddTabLabel = styled.span`
  display: flex;
  align-items: center;
  gap: 4px;
  .new {
    position: relative;
    height: 21px;
    display: inline-flex;
    padding: 2px 6px;
    justify-content: center;
    align-items: center;
    gap: 10px;
    border-radius: 6px;
    background: linear-gradient(276deg, #7ffca7 0.89%, #aaff8d 97.34%);
    color: ${(props) => props.theme.colors.text};
    font-size: 12px;
    font-weight: 700;
    line-height: 140%;
    overflow: hidden;
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 10.615px;
      height: 50.215px;
      transform: rotate(14.299deg);
      flex-shrink: 0;
      background: rgba(255, 255, 255, 0.4);
      animation: ${shine} 3s infinite;
    }
  }
`;

const MarketForm = loadable(() => import('./modules/MarketForm'));
// 因为页面初始化显示的100%是市价单，为保证SSG水合顺畅，市价单模块直接preload
MarketForm.preload();

export const NAMESPACE = 'gbiz_trading_convert';

// 基础数据Context
export const storeContext = createContext({});

export const BASE_CURRENCY = window._BASE_CURRENCY_ || 'USDT';

// 下单类型枚举
export const ORDER_TYPE_ENUM = {
  MARKET: 'MARKET',
  LIMIT: 'LIMIT',
  STAKING: 'STAKING',
  USDD: 'USDD',
};

// 下单类型
export const ORDER_TYPE = [
  {
    value: ORDER_TYPE_ENUM.MARKET,
    getConvertSymbolsEffectName: 'getConvertSymbols',
    confirmOrderEffectName: 'confirmMarketOrder',
    queryPriceEffectName: 'queryPriceForMarketOrder',
    triggerPollingEffectName: 'triggerMarketPolling',
    queryCurrencyListEffectName: 'queryCurrencyList',
    updateCurrencyEffectName: 'updateCurrency',
    pullPositionEffectName: 'pullPosition',
    fromCurrencyKeyName: 'fromCurrency',
    toCurrencyKeyName: 'toCurrency',
    priceSymbolKeyName: 'priceSymbol',
    loopDurationTimeKeyName: 'loopDurationTime',
    label: () => <Trans i18nKey="trade.order.market" ns="convert" />,
    Component: MarketForm,
    getNextSymbol: () => null,
  },
  {
    value: ORDER_TYPE_ENUM.LIMIT,
    getConvertSymbolsEffectName: 'getConvertSymbols',
    confirmOrderEffectName: 'confirmLimitOrder',
    queryPriceEffectName: 'queryPriceForLimitOrder',
    triggerPollingEffectName: 'triggerLimitPolling',
    queryCurrencyListEffectName: 'queryCurrencyList',
    updateCurrencyEffectName: 'updateCurrency',
    pullPositionEffectName: 'pullPosition',
    fromCurrencyKeyName: 'fromCurrency',
    toCurrencyKeyName: 'toCurrency',
    priceSymbolKeyName: 'priceSymbol',
    loopDurationTimeKeyName: 'loopDurationTime',
    label: () => <Trans i18nKey="trade.order.limit" ns="convert" />,
    Component: loadable(() => import('./modules/LimitForm')),
    getNextSymbol: ({ fromCurrency, toCurrency }) => {
      // 兑换币对包含USDT的，则支持限价
      if ([fromCurrency, toCurrency].includes('USDT')) return null;
      return { fromCurrency: 'BTC', toCurrency: 'USDT' };
    },
  },
  {
    value: ORDER_TYPE_ENUM.STAKING,
    getConvertSymbolsEffectName: 'getStakingConvertSymbols',
    confirmOrderEffectName: 'confirmStakingOrder',
    queryPriceEffectName: 'queryPriceForStakingOrder',
    triggerPollingEffectName: 'triggerStakingPolling',
    updateCurrencyEffectName: 'updateStakingCurrency',
    queryCurrencyListEffectName: 'queryStakingCurrencyList',
    pullPositionEffectName: 'pullStakingPosition',
    fromCurrencyKeyName: 'fromCurrencyStaking',
    toCurrencyKeyName: 'toCurrencyStaking',
    priceSymbolKeyName: 'priceSymbolStaking',
    loopDurationTimeKeyName: 'loopDurationTimeStaking',
    hideFundingAccount: true, // 不展示资金账户选择
    label: () => 'Staking',
    Component: loadable(() => import('./modules/StakingForm')),
    getNextSymbol: () => null,
  },
  {
    value: ORDER_TYPE_ENUM.USDD,
    getConvertSymbolsEffectName: 'getUsddConvertSymbols',
    confirmOrderEffectName: 'confirmUsddOrder',
    queryPriceEffectName: 'queryPriceForUsddOrder',
    triggerPollingEffectName: 'triggerUsddPolling',
    updateCurrencyEffectName: 'updateUsddCurrency',
    queryCurrencyListEffectName: null, // USDD不需要查询币种列表
    pullPositionEffectName: 'pullUsddPosition',
    fromCurrencyKeyName: 'fromCurrencyUSDD',
    toCurrencyKeyName: 'toCurrencyUSDD',
    priceSymbolKeyName: 'priceSymbolUSDD',
    loopDurationTimeKeyName: 'loopDurationTimeUSDD',
    label: () => (
      <StyledUsddTabLabel>
        <span className="usdd">USDD</span>
        <span className="new">Event</span>
      </StyledUsddTabLabel>
    ),
    Component: loadable(() => import('./modules/UsddForm')),
    getNextSymbol: () => null,
  },
];

export const ORDER_TYPE_MAP = list2map(ORDER_TYPE, 'value');

// 账户类型
export const ACCOUNT_TYPE_LIST = [
  {
    value: 'MAIN',
    accountTypes: ['MAIN'],
    initDict: [['TRADE'], ['MAIN']],
    label: () => <Trans i18nKey="convert.form.account.type.main" ns="convert" />,
  },
  {
    value: 'TRADE',
    accountTypes: ['TRADE'],
    initDict: [['MAIN'], ['TRADE']],
    label: () => <Trans i18nKey="convert.form.account.type.trade" ns="convert" />,
  },
  {
    value: 'BOTH',
    accountTypes: ['MAIN', 'TRADE'],
    initDict: [['MAIN'], ['TRADE']],
    label: () => <Trans i18nKey="o8Py8ie2wTUvz37UyVPCsD" ns="convert" />,
  },
];

// Staking 不支持选账户，单独定义
export const STAKING_ACCOUNT_TYPE = 'STAKING';

// 币种分类
export const CURRENCY_TYPE_ENUM = {
  STAKING: 'staking',
  SPOT: 'spot',
  ETF: 'etf',
  FLAT: 'flat',
};

// 账户类型map
export const ACCOUNT_TYPE_LIST_MAP = list2map(ACCOUNT_TYPE_LIST, 'value');

// 轮询最大次数
export const MAX_LOOP_COUNT = 40;
// 市价单询价过期时间(同步后端的)，留300ms buffer以抵消接口响应时间
export const MAX_PRICE_EXPIRE_TIME = 8 * 1000 - 300;

export const MARGIN_MARKS_TIPS = {
  LONG3: () => (
    <Trans i18nKey="4KNCpdzcdH8SrCdquHNtzc" ns="convert">
      3倍做多：代表锚定资产的3倍看涨代币，
      <a target="_blank" rel="noopener noreferrer" href={getInnerUrl('/support/900004692086')}>
        了解杠杆代币
      </a>
    </Trans>
  ),
  SHORT3: () => (
    <Trans i18nKey="4VkigTSasXxSHFetwC1Hte" ns="convert">
      3倍做空：代表锚定资产的3倍看跌代币，
      <a target="_blank" rel="noopener noreferrer" href={getInnerUrl('/support/900004692086')}>
        了解杠杆代币
      </a>
    </Trans>
  ),
  LONG2_4: () => (
    <Trans i18nKey="uB6ZyoQTT1ymMYvq3mDpsK" ns="convert">
      2-4倍做多：代表锚定资产的2-4倍看涨代币，
      <a target="_blank" rel="noopener noreferrer" href={getInnerUrl('/support/900004692086')}>
        了解杠杆代币
      </a>
    </Trans>
  ),
  SHORT2_4: () => (
    <Trans i18nKey="nFrq9byyeCuxv61qDo5VoF" ns="convert">
      2-4倍做空：代表锚定资产的2-4倍看跌代币，
      <a target="_blank" rel="noopener noreferrer" href={getInnerUrl('/support/900004692086')}>
        了解杠杆代币
      </a>
    </Trans>
  ),
};
