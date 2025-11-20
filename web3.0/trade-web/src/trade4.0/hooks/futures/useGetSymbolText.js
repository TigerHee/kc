/**
 * Owner: charles.yang@kupotech.com
 */
import { useGetSymbolInfo } from '@/hooks/common/useSymbol';
import { FUTURES } from '@/meta/const';
import { formatCurrency } from '@/utils/futures/formatCurrency';
import moment from 'moment';
import { _t } from 'utils/lang';

export const SETTLE_CONTRACT = 'FFICSX';
export const SUSTAIN_CONTRACT = 'FFWCSX';

export const getSymbolText = (contract) => {
  if (!contract) {
    return '';
  }

  const { baseCurrency, type, settleDate, quoteCurrency } = contract;
  const base = formatCurrency(baseCurrency); // 基准币种

  switch (type) {
    case SETTLE_CONTRACT:
      return {
        base,
        type: _t('symbol.settle'),
        settle: moment.utc(settleDate).utcOffset(8).format('MMDD'),
      };
    case SUSTAIN_CONTRACT:
      return {
        base,
        type: _t('contract.detail.perpetual'),
        settle: quoteCurrency,
      };
    default:
      return '';
  }
};

export const symbolToText = (contract) => {
  const { base, type, settle } = getSymbolText(contract);
  return `${base}/${settle} ${type}`;
};

const useGetSymbolText = (symbol) => {
  const contract = useGetSymbolInfo({ symbol, tradeType: FUTURES });
  if (!contract) {
    return symbol;
  }

  const { base, type, settle } = getSymbolText(contract);

  return {
    name: `${base}/${settle}`,
    type,
    base,
    settle,
  };
};

export const useSymbolCellNeedInfo = (symbol) => {
  const { name, type, base, settle } = useGetSymbolText(symbol);

  return {
    symbolTextInfo: { name, type, base, settle },
  };
};
