/*
 * @owner: borden@kupotech.com
 */
import { useContext, useMemo, useCallback } from 'react';
import { filter } from 'lodash';
import { useDispatch } from 'dva';
import { routerRedux } from 'dva/router';
import storage from 'src/utils/storage';
import useTradeTypes from '@/hooks/common/useTradeTypes';
import { useTradeType } from '@/hooks/common/useTradeType';
import useSensorFunc from '@/hooks/useSensorFunc';
import { checkIsMargin, TRADE_TYPES_CONFIG, MARGIN_TYPE_FOR_STORAGE } from '@/meta/tradeTypes';
import { useGetCurrentSymbol } from '@/hooks/common/useSymbol';
import { WrapperContext } from '../../config';
import useOrderState from '../../hooks/useOrderState';
import { getSymbolPath } from 'src/trade4.0/utils/path';
import { isFuturesNew } from 'src/trade4.0/meta/const';
import { isDisplayMargin } from '@/meta/multiTenantSetting';

const FOLD_KEY = 'FOLD_SELECT';

const genTabConfig = (value) => ({
  value,
  path: getSymbolPath(value),
  label: TRADE_TYPES_CONFIG[value].label1(),
});

export default function useTradeTypeTabs() {
  const dispatch = useDispatch();
  const { showAuction } = useOrderState();
  const screen = useContext(WrapperContext);
  const tradeType = useTradeType();
  const tradeTypes = useTradeTypes();
  const symbol = useGetCurrentSymbol();
  const sensorFunc = useSensorFunc();
  // md下可以展开杠杆的tab
  const isMd = screen === 'md';

  const marginTradeTypes = useMemo(() => {
    return filter(tradeTypes, checkIsMargin).map((v) => {
      return genTabConfig(v);
    });
  }, [tradeTypes]);

  const tabs = useMemo(() => {
    const result = [genTabConfig(TRADE_TYPES_CONFIG.TRADE.key)];
    // 集合竞价只显示币币
    if (showAuction) {
      return result;
    }

    if (isDisplayMargin()) {
    const needFoldMargin = !isMd;
    if (needFoldMargin) {
      result.push({
        value: FOLD_KEY,
        children: marginTradeTypes,
      });
    } else {
      result.push(...marginTradeTypes);
    }
  }
    // 如果开启合约
    if (isFuturesNew()) {
      result.push(genTabConfig(TRADE_TYPES_CONFIG.FUTURES.key));
    }
    return result;
  }, [marginTradeTypes, isMd, showAuction]);

  const foldAciveTab = useMemo(() => {
    if (checkIsMargin(tradeType)) {
      return tradeType;
    }
    const valueFromStorage = storage.getItem(MARGIN_TYPE_FOR_STORAGE);
    if (checkIsMargin(valueFromStorage)) {
      return valueFromStorage;
    }
    // 默认逐仓
    return TRADE_TYPES_CONFIG.MARGIN_ISOLATED_TRADE.key;
  }, [tradeType]);

  const activeTab = useMemo(() => {
    if (isDisplayMargin()) {
    const needFoldMargin = !isMd;
    if (needFoldMargin && checkIsMargin(tradeType)) {
      return FOLD_KEY;
    }
  }
    return tradeType;
  }, [tradeType, isMd]);

  const onChange = useCallback(
    (e, v) => {
      const { path } = getSymbolPath(v, symbol);
      if (path) {
        if (v !== FOLD_KEY) {
          sensorFunc(['trading', 'tab'], v);
        }
        dispatch(routerRedux.push(path));
      }
    },
    [dispatch, sensorFunc, symbol],
  );
  return {
    tabs,
    onChange,
    activeTab,
    foldAciveTab,
    realActiveTab: tradeType,
  };
}
