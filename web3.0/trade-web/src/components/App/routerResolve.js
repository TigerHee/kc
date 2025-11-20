/**
 * Owner: borden@kupotech.com
 */

/*
 * @Author: Borden.Lan
 * @Date: 2021-05-20 11:20:09
 * @Description: 初始化tradeType处理
 */
import { useEffect, useCallback } from 'react';
import { pathToRegexp } from 'path-to-regexp';
import storage from 'utils/storage';
import { routerRedux } from 'dva/router';
import { concatPath } from 'helper';
import { TRADE_TYPES_CONFIG, TYPE_FOR_STORAGE } from 'utils/hooks/useTradeTypes';
import { TRADEMODE_META, isBotTradeByPathname } from '@/meta/tradeTypes';
import { getTradeTypeByBotPathname } from 'Bot/config';

// 路由和类型一一对应
const matchPath = (targetPath = '', pathname) => {
  const pathRe = pathToRegexp('/:type/(.*)?');
  const execResult = pathRe.exec(pathname);
  // 路由‘/’代表 spot类型
  if (targetPath === '/') {
    if (execResult && execResult[1] && !execResult[2]) {
      const symbol = execResult[1];
      // FIXME: 后续优化该规则 匹配合约的 symbol 格式
      if (symbol.match('XBT') || symbol.match(/(USDTM|USDCM|USDM)/)) return true;
      return /^.*-.*$/.test(symbol);
    }
  }
  if (execResult && execResult[1]) {
    const type = execResult[1];
    const targetPathType = targetPath.substring(1);
    return targetPathType === type;
  }
  return false;
};

const RouteResolve = (props) => {
  const { location, dispatch } = props;
  const { pathname } = location || {};
  const updateTradeType = useCallback(
    (tradeType) => {
      dispatch({
        type: 'trade/update_trade_type',
        payload: {
          tradeType,
        },
      });
    },
    [dispatch],
  );

  useEffect(() => {
    const isBotTrade = isBotTradeByPathname(pathname);
    dispatch({
      type: 'trade/update',
      payload: {
        tradeMode: isBotTrade ? TRADEMODE_META.keys.BOTTRADE : TRADEMODE_META.keys.MANUAL,
      },
    });
    const initTradeTypeFromStorage = storage.getItem(TYPE_FOR_STORAGE);
    const tradeType = TRADE_TYPES_CONFIG[initTradeTypeFromStorage];
    if (!isBotTrade) {
      /** 下面是路径的处理 */
      const pathsConfig = Object.values(TRADE_TYPES_CONFIG);
      for (let i = 0, len = pathsConfig.length; i < len; i++) {
        const item = pathsConfig[i];
        if (matchPath(item.path, pathname)) {
          updateTradeType(item.key);
          return;
        }
      }
      const initSymbolFromStorage = storage.getItem('trade_current_symbol') || 'BTC-USDT';
      const typePath = tradeType ? tradeType.path : '';
      const nextRoute = concatPath(typePath, initSymbolFromStorage);
      dispatch(routerRedux.replace(nextRoute));
    } else {
      // 兜底到合约， useInitCurrentSymbol那里会判断策略模式下， 没有交易对 视为合约类型
      const fallbackType = tradeType?.key || TRADE_TYPES_CONFIG.FUTURES.key;
      // 策略模式下, 从路径上获取tradeType
      updateTradeType(getTradeTypeByBotPathname(pathname) || fallbackType);
    }
  }, [dispatch, pathname, updateTradeType]);

  return null;
};

export default RouteResolve;
