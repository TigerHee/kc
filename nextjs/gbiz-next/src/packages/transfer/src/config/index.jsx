/**
 * Owner: solar@kupotech.com
 */
import {
  ICFundAccountOutlined,
  ICTradingOutlined,
  ICMarginOutlined,
  ICFuturesOutlined,
  ICOptionsOutlined,
  ICFinanceOutlined,
} from '@kux/icons';
import { useTheme } from '@kux/mui';
import { MultiTransferIcon } from '@kux/iconpack';
import { Trans } from 'tools/i18n';
import reduce from 'lodash-es/reduce';
import { bootConfig } from 'kc-next/boot';
import { StyledIsolatedLabel } from './style';
import { transformTag } from '../utils/tag';

const base = {
  getOptions: ({ oppositeAccount, supportOptions, direction = 'pay' }) => {
    let options = supportOptions;
    // 组合划转不支持作为接收方
    if (direction === 'rec') {
      options = options.filter((item) => item.value !== 'MULTI');
    }
    // 逐仓可以双向选择
    if (oppositeAccount === 'ISOLATED') {
      return options;
    }

    return options.filter((item) => item.value !== oppositeAccount);
  },
  // 获取currencies
  getCurrencies: async (
    { payAccountType, recAccountType, baseLegalCurrency, payTag, recTag, multiAccounts },
    { dispatchTransfer },
  ) => {
    return dispatchTransfer({
      type: 'pullCurrencies',
      payload: {
        payAccountType,
        recAccountType,
        baseLegalCurrency,
        payTag,
        recTag,
        multiAccounts,
      },
    });
  },
  // 获取total
  getAvaliable: async (
    { payAccountType, recAccountType, currency, payTag, recTag },
    { dispatchTransfer },
  ) => {
    dispatchTransfer({
      type: 'queryTransferAvailable',
      payload: {
        currency,
        accountType: payAccountType,
        toAccountType: recAccountType,
        tag: payTag,
        toAccountTag: recTag,
      },
    });
  },
  getSelectedLabel() {
    return this.getLabel();
  },
  getSupportBatch({ payAccountType, recAccountType }, { dispatchTransfer }) {
    return dispatchTransfer({
      type: 'querySupportBatch',
      payload: {
        payAccountType,
        recAccountType,
      },
    });
  },
  // 获取二级tag
  getTags: null,
  // 是否支持该账户
  isSupport: () => true,
  // 账户icon
  icon: () => <span>i</span>,
};

function genRenderIcon(Comp) {
  return () => {
    const theme = useTheme();
    return <Comp size={20} color={theme.colors.icon60} />;
  };
}

// 前两个账户默认为该用户开通的。
export const config = [
  // 对面账户的filter，当选中时，会对对面可选账户做限制
  {
    ...base,
    // 资金账户
    account: 'MAIN',
    getLabel: () => <Trans i18nKey="main.account" ns="transfer" />,
    i18nKey: 'main.account',
    icon: genRenderIcon(ICFundAccountOutlined),
    priority: () => Infinity,
  },
  {
    ...base,
    // 币币账户
    account: 'TRADE',
    getLabel: () => <Trans i18nKey="trade.account" ns="transfer" />,
    i18nKey: 'trade.account',
    icon: genRenderIcon(ICTradingOutlined),
    priority: () => 100,
  },
  {
    ...base,
    // 合约账户
    account: 'CONTRACT',
    isSupport: () => bootConfig._SITE_CONFIG_.functions.futures,
    i18nKey: 'margin.account',
    getLabel: () => <Trans i18nKey="margin.account" ns="transfer" />,
    icon: genRenderIcon(ICFuturesOutlined),
    priority: () => 100,
  },
  {
    ...base,
    // 全仓账户
    account: 'MARGIN',
    isSupport: () => bootConfig._SITE_CONFIG_.functions.margin,
    i18nKey: 'crossMargin.account',
    getLabel: () => <Trans i18nKey="crossMargin.account" ns="transfer" />,
    icon: genRenderIcon(ICMarginOutlined),
    priority: () => 10,
  },
  // 逐仓账户
  {
    ...base,
    // 逐仓杠杆账户
    account: 'ISOLATED',
    isSupport: () => bootConfig._SITE_CONFIG_.functions.margin,
    i18nKey: 'isolatedMargin.account',
    getLabel: () => <Trans i18nKey="isolatedMargin.account" ns="transfer" />,
    icon: genRenderIcon(ICMarginOutlined),
    async getTags(
      { oppositeAccount, oppositeTag, updateSubOptionsKey, baseLegalCurrency },
      { dispatchTransfer },
    ) {
      return dispatchTransfer({
        type: 'queryIsolateTag',
        payload: {
          baseLegalCurrency,
          updateSubOptionsKey,
          oppositeTag,
        },
      });
    },
    priority: () => 10,
    getSelectedLabel({ tag }) {
      return (
        <StyledIsolatedLabel>
          <div className="main-title">
            <Trans i18nKey="isolatedMargin.account" ns="transfer" />
          </div>
          <div className="sub-title">{transformTag(tag)}</div>
        </StyledIsolatedLabel>
      );
    },
  },
  {
    ...base,
    account: 'OPTION',
    isSupport: () => bootConfig._SITE_CONFIG_.functions.option,
    i18nKey: '12fd427d3b4d4000a156',
    getLabel: () => <Trans i18nKey="12fd427d3b4d4000a156" ns="transfer" />,
    icon: genRenderIcon(ICOptionsOutlined),
    priority: () => 10,
  },
  {
    ...base,
    account: 'SAVINGS',
    isSupport: () => bootConfig._SITE_CONFIG_.functions.financing,
    i18nKey: 'kc_transferpro_earn_account',
    getLabel: () => <Trans i18nKey="kc_transferpro_earn_account" ns="transfer" />,
    icon: genRenderIcon(ICFinanceOutlined),
    priority: () => 10,
  },
  {
    ...base,
    account: 'MULTI',
    isSupport: () => true,
    i18nKey: 'kc_transferpro_multi_account',
    getLabel: () => <Trans i18nKey="kc_transferpro_multi_account" ns="transfer" />,
    icon: genRenderIcon(MultiTransferIcon),
    priority: () => 10,
  },
];

export const configMap = reduce(
  config,
  (acu, item) => {
    return {
      ...acu,
      [item.account]: item,
    };
  },
  {},
);
