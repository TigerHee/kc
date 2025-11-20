/**
 * Owner: garuda@kupotech.com
 */

import React, { useCallback } from 'react';

import { map } from 'lodash';

import CalcResultBox from './CalcResultBox';
import CalcResultItem from './CalcResultItem';
import PlaceOrderButton from './PlaceOrderButton';

import { TO_CALC_ORDER, _t, lessThan, trackClick } from '../../../builtinCommon';

import { BTN_BUY, BUY, CALC_SENSORS_TYPE, SELL, TABS_LIQUIDATION } from '../../../config';
import {
  getCalculatorProps,
  useCalculatorOpen,
  useCalculatorStashCache,
  useCalculatorTabsActive,
} from '../../../hooks/useCalculatorProps';
import { useGetIsLogin, useGetSymbolInfo } from '../../../hooks/useGetData';
import useCalculatorEvent from '../useCalculatorEvent';

const CalcResult = () => {
  const { tabsActive } = useCalculatorTabsActive();
  const { symbolInfo } = useGetSymbolInfo();
  const { resultConfig, calcValue } = useCalculatorEvent();
  const onCalculatorVisible = useCalculatorOpen();
  const onCalculatorStashCache = useCalculatorStashCache();
  const isLogin = useGetIsLogin();
  const isCrossLiquld = tabsActive === TABS_LIQUIDATION;
  const handlePlaceOrder = useCallback(() => {
    const { btnType, leverage } = getCalculatorProps();
    // 赋值 side 参数
    const side = btnType === BTN_BUY ? BUY : SELL;
    const placeOrderMap = { side, leverage };

    // 如果有止盈止损价格，需要判断一下是止盈还是止损
    if (calcValue?.closePrice) {
      if (calcValue.profit && lessThan(calcValue.profit)(0)) {
        placeOrderMap.stopLossPrice = calcValue.closePrice;
      } else {
        placeOrderMap.stopProfitPrice = calcValue.closePrice;
      }
    }
    // 如果有开仓价格，则赋值
    if (calcValue?.openPrice) {
      placeOrderMap.price = calcValue.openPrice;
    }
    // 如果有size，则赋值
    if (calcValue?.openSize) {
      placeOrderMap.size = calcValue.openSize;
    }

    onCalculatorVisible(false);
    onCalculatorStashCache(placeOrderMap);

    // 埋点
    trackClick([TO_CALC_ORDER, '1'], { calculateType: CALC_SENSORS_TYPE[tabsActive] });
  }, [calcValue, onCalculatorStashCache, onCalculatorVisible, tabsActive]);

  return (
    <CalcResultBox>
      {map(resultConfig, ({ name, unit, unitKey, valueKey, colorSpec }) => {
        return (
          <CalcResultItem
            key={valueKey}
            name={_t(name)}
            unit={unit}
            unitKey={unitKey}
            value={calcValue?.[valueKey]}
            fixed={calcValue?.fixed}
            symbolInfo={symbolInfo}
            colorSpec={colorSpec}
          />
        );
      })}
      <PlaceOrderButton
        show={!isCrossLiquld && calcValue && isLogin}
        onPlaceOrder={handlePlaceOrder}
      />
    </CalcResultBox>
  );
};

export default React.memo(CalcResult);
