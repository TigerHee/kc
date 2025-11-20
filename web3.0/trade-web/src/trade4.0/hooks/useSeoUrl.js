/*
 * @owner: borden@kupotech.com
 * @desc: 根据交易对和交易类型生成跳转链接
 */
import { useMemo } from 'react';
import { useSelector } from 'dva';
import { concatPath } from 'src/helper';
import { addLangToPath } from 'src/utils/lang';
import { TRADE_TYPES_CONFIG, TRADEMODE_META } from '@/meta/tradeTypes';
import { useIsTradingBot } from '@/hooks/common/useTradeMode';
import { useTradeType, getSymbolIsSupportTradeType } from '@/hooks/common/useTradeType';
import { createPathByLocation } from 'Bot/config';

export default function useSeoUrl({ symbol, tradeType, needCheckMarginTab }) {
  const currentTradeType = useTradeType();
  const isTradingBot = useIsTradingBot();

  const { area } = useSelector((state) => state.tradeMarkets.filters);
  const marginTab = useSelector((state) => state.tradeMarkets.marginTab);
  const marginSymbolsMap = useSelector((state) => state.symbols.marginSymbolsMap);

  if (!tradeType) {
    tradeType = currentTradeType;
  }

  const _marginTab = needCheckMarginTab ? marginTab : '';
  const { pathname } = window.location;
  const rowUrl = useMemo(() => {
    let tradeTypeConfig;
    const { isMarginEnabled } = marginSymbolsMap[symbol] || {};
    const { fallbackType } = TRADE_TYPES_CONFIG[tradeType] || {};
    if (isTradingBot) {
      // 策略交易无论什么交易对，都维持
      tradeTypeConfig = {
        path: createPathByLocation({ pathname }) || TRADEMODE_META.botTradeMeta.path,
      };
    } else if (area === 'MARGIN' && _marginTab) {
      // 杠杆交易对，判断是在全部Tab下，则优先取全仓，不支持则跳逐仓；不在全部Tab下，按Tab取
      tradeTypeConfig =
        TRADE_TYPES_CONFIG[_marginTab] ||
        (isMarginEnabled
          ? TRADE_TYPES_CONFIG.MARGIN_TRADE
          : TRADE_TYPES_CONFIG.MARGIN_ISOLATED_TRADE);
    } else if (getSymbolIsSupportTradeType({ symbol, marginSymbolsMap, tradeType })) {
      // 其他情况，判断是否支持当前tradetype，支持则维持当前tradeType
      tradeTypeConfig = TRADE_TYPES_CONFIG[tradeType];
    } else if (getSymbolIsSupportTradeType({ symbol, marginSymbolsMap, tradeType: fallbackType })) {
      // 存在备用交易类型，且交易对支持，则跳备用
      tradeTypeConfig = TRADE_TYPES_CONFIG[fallbackType];
    } else {
      // 不支持则跳现货
      tradeTypeConfig = TRADE_TYPES_CONFIG.TRADE;
    }
    // const symbolRoute = `/${symbol}${window.location.search}`;
    const symbolRoute = `/${symbol}`;
    return addLangToPath(concatPath(`/trade${tradeTypeConfig.path}`, symbolRoute));
  }, [pathname, area, symbol, tradeType, _marginTab, isTradingBot, marginSymbolsMap]);

  return rowUrl;
}
