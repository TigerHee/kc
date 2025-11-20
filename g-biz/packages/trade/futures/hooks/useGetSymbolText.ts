/*
 * @owner: Tank@kupotech.com
 */
// eslint-disable-next-line no-restricted-imports
import moment from 'moment';
import i18n from '@tools/i18n';
import { useFuturesSelector } from '../components/FuturesProvider';

import {
  SymbolInfo,
  Symbol,
  UseGetSymbolTextProps,
  UseGetSymbolTextResult,
} from '../types/contract';
import { SETTLE_CONTRACT, SUSTAIN_CONTRACT } from '../constant';

/**
 * 将XBT转换为BTC
 */
export const formatCurrency = (currency: string) => {
  if (currency === 'XBT') {
    return 'BTC';
  }
  return currency;
};

export const getSymbolText = (contract: SymbolInfo, isTag: boolean, fallback?: string) => {
  const symbolType = i18n.t('trade:perpetual.contract');

  const { baseCurrency, type, settleDate, quoteCurrency } = contract;
  const base = formatCurrency(baseCurrency); // 基准币种
  let symbolName = '';
  let tagName = '';

  const settleType = moment(settleDate).format('DDMMMYY');
  const settleTypeUpper = settleType.toUpperCase();
  switch (type) {
    // 交割合约
    case SETTLE_CONTRACT:
      symbolName = `${base}${quoteCurrency}-${settleTypeUpper}`;
      break;
    //  永续合约
    case SUSTAIN_CONTRACT:
      symbolName = isTag ? `${base}${quoteCurrency}` : `${base}${quoteCurrency} ${symbolType}`;
      tagName = symbolType;
      break;
    default:
  }

  return {
    base,
    quoteCurrency,
    symbolName: symbolName || fallback || '--',
    tagName,
    fallback,
  };
};

/**
 * 通过 symbol 获取交易对信息
 * @param {string} symbol
 */
export const useGetSymbolInfo = (symbol: Symbol) => {
  const state = useFuturesSelector();
  return state?.symbolsMap[symbol] || {};
};

export const useGetSymbolText = ({
  symbol,
  isTag,
  fallback,
}: UseGetSymbolTextProps): UseGetSymbolTextResult => {
  const contract = useGetSymbolInfo(symbol);

  const { base, quoteCurrency, symbolName, tagName } = getSymbolText(contract, isTag, fallback);

  return {
    base,
    quoteCurrency,
    symbolName,
    tagName,
    fallback,
  };
};
