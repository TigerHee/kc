/*
 * owner: Borden@kupotech.com
 */
import { split } from 'lodash';
import Decimal from 'decimal.js';
import { useResponsive } from '@kux/mui';
import { formatNumber, formatNumberKMB } from '@/utils/format';
import { useGetCurrentSymbolInfo } from '@/hooks/common/useSymbol';
import marketSnapshotStore from 'src/pages/Trade3.0/stores/store.marketSnapshot';
import { _t } from 'src/utils/lang';

const placeholder = '--';

export default function useRealTimeMarketInfo() {
  const { sm } = useResponsive();
  const currentSymbolInfo = useGetCurrentSymbolInfo();
  const { symbol, symbolCode, pricePrecision } = currentSymbolInfo;
  const [baseName, quoteName] = split(symbol, '-');

  const realTimeMarketInfo = marketSnapshotStore.useSelector(
    (state) => state.marketSnapshot[symbolCode],
  );

  const {
    low,
    high,
    vol = 0,
    volValue = 0,
    changeRate = 0,
    changePrice = 0,
    lastTradedPrice = 0,
  } = realTimeMarketInfo || {};

  // 这里不对changePrice和最新价做千分位处理，是因为要用以判断涨跌，在涨跌显示组件里去做的
  const commonFormatConfig = {
    dropZ: !sm, // h5全部执行去0操作，非h5都保留0
    fixed: pricePrecision,
    round: Decimal.ROUND_DOWN,
    pointed: false,
  };

  return {
    changeRate: changeRate || 0,
    changePrice: formatNumber(changePrice, { ...commonFormatConfig }) || 0,
    lastDealPrice:
      formatNumber(lastTradedPrice, { ...commonFormatConfig }) || placeholder,
    low: {
      label: _t('ticks.24h.low'),
      value:
        formatNumber(low, { ...commonFormatConfig, pointed: true }) ||
        placeholder,
    },
    high: {
      label: _t('ticks.24h.high'),
      value:
        formatNumber(high, { ...commonFormatConfig, pointed: true }) ||
        placeholder,
    },
    vol: {
      label: `${_t('ticks.24h.volValue')} (${baseName})`,
      value:
      formatNumberKMB(vol, { fixed: pricePrecision, showMinStep: false }) ||
        placeholder,
    },
    volValue: {
      label: `${_t('ticks.24h.vol')} (${quoteName})`,
      value:
      formatNumberKMB(volValue, { fixed: pricePrecision, showMinStep: false }) ||
        placeholder,
    },
  };
}
