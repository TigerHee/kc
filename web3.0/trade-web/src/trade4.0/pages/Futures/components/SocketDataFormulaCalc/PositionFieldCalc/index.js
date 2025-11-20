/**
 * Owner: garuda@kupotech.com
 * 需要前端计算的 Position 字段
 */
import React, { useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { throttle } from 'lodash';

import { FUTURES } from '@/meta/const';
import { evtEmitter } from 'helper';
import { abs } from 'utils/operation';

import { getPosition } from '@/hooks/futures/useGetFuturesPositionsInfo';
import { getPositionCalcData } from '@/hooks/futures/useCalcData';
import { getSymbolInfo } from '@/hooks/common/useSymbol';
import { getMarkPrice } from '@/hooks/futures/useMarket';

import {
  calcPosIsolatedROE,
  calcPosIsolatedRealLeverage,
  calcPosIsolatedTotalMargin,
  calcPosIsolatedUnPnl,
  orderValue,
} from '../formula';

const event = evtEmitter.getEvt('futures-socket-position');

const PositionFieldCalc = () => {
  const dispatch = useDispatch();

  // 每 s 只调用一次，不超过一次
  const startPositionCalc = useCallback(
    throttle(
      (markPriceMap) => {
        // 取之前的计算值
        const updateCalcData = getPositionCalcData();

        // 是否需要更新
        let isUpdate = false;
        // 遍历计算一遍自有资金的仓位值
        getPosition({
          condition: ({
            isOpen,
            symbol: itemSymbol,
            isTrialFunds,
            currentQty,
            posInit,
            posMargin,
            posComm,
            posCost,
            maintMargin,
            markPrice: posMarkPrice,
          }) => {
            // 获取合约交易对
            const contract = getSymbolInfo({ symbol: itemSymbol, tradeType: FUTURES });
            // 增加极限场景兼容，markPrice 一直无法收到
            const markPrice = markPriceMap[itemSymbol] || getMarkPrice(itemSymbol) || posMarkPrice;
            // 自有资金仓位，并且此次更新的markPrice值，在仓位中有对应的symbol
            if (isOpen && !isTrialFunds) {
              isUpdate = true;
              const unPnl = calcPosIsolatedUnPnl({
                contract,
                markPrice,
                currentQty,
                posCost,
              });
              const totalMargin =
                calcPosIsolatedTotalMargin({ positionMargin: posMargin, unPnl }) || maintMargin;
              const ROE = calcPosIsolatedROE({ positionInitMargin: posInit, unPnl });
              const markValue = orderValue({
                contract,
                price: markPrice,
                size: abs(currentQty),
              });
              const realLeverage = calcPosIsolatedRealLeverage({
                markValue,
                positionTotalMargin: totalMargin,
                bankruptFee: posComm,
              });
              updateCalcData[itemSymbol] = {
                ...updateCalcData[itemSymbol],
                markValue,
                totalMargin,
                unPnl,
                ROE,
                realLeverage,
              };
              return true;
            }
            return false;
          },
        });

        if (isUpdate) {
          dispatch({
            type: 'futures_calc_data/update',
            payload: {
              positionCalcData: updateCalcData,
            },
          });
        }
      },
      1000,
      { trailing: false },
    ),
    [],
  );

  // 监听是否开启一次计算
  useEffect(() => {
    event.on('futures_start_position_calc', startPositionCalc);
    return () => {
      event.off('futures_start_position_calc', startPositionCalc);
    };
  }, [startPositionCalc]);
  return null;
};

export default React.memo(PositionFieldCalc);
