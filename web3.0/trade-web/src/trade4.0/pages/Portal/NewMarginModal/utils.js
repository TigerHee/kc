/*
 * @owner: borden@kupotech.com
 */
import { split, findLast } from 'lodash';
import { _t } from 'src/utils/lang';
import { getStore } from 'src/utils/createApp';
import { ACCOUNT_TYPE_MAP } from './config';

export const validateNoop = () => Promise.resolve();
// 空校验
export const validateEmpty = (_, value) => {
  if (!value) {
    return Promise.reject(_t('trans.amount.num.err'));
  }
  return Promise.resolve();
};
/**
 * @returns 检查币种是否支持全仓借贷
 */
export const checkCurrencyIsSupportCrossLoan = (currency) => {
  const state = getStore().getState();
  const loanCurrenciesMap = state.marginMeta.loanCurrenciesMap;

  return Boolean(loanCurrenciesMap[currency]?.marginBorrowEnabled);
};
/**
 * @returns 检查币种是否支持逐仓借贷
 */
export const checkCurrencyIsSupportIsolatedLoan = (currency, tag) => {
  const state = getStore().getState();
  const pair = split(tag, '-');
  const [base] = pair;
  const isolatedSymbolsMap = state.symbols.isolatedSymbolsMap;

  if (!pair.includes(currency)) return false;

  const enabledKey = currency === base ? 'baseBorrowEnable' : 'quoteBorrowEnable';
  return Boolean(isolatedSymbolsMap[tag]?.[enabledKey]);
};
/**
 * @returns 获取借/还的默认币种
 */
export const getLoanCurrencyFromSymbol = (accountType, symbol) => {
  const { checkCurrencyIsSupportLoan } = ACCOUNT_TYPE_MAP[accountType] || {};
  const pair = split(symbol, '-');
  if (!checkCurrencyIsSupportLoan) return undefined;
  return findLast(pair, v => checkCurrencyIsSupportLoan(v, symbol));
};
