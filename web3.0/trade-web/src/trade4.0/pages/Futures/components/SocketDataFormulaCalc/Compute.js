/**
 * Owner: garuda@kupotech.com
 * 需要前端计算的字段
 */
import React, { useCallback, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';

import { forEach, forIn, isEqual } from 'lodash';

import { abs, multiply, plus } from 'utils/operation';

import { getFuturesCrossConfigForSymbol } from '@/hooks/common/useSymbol';
import { getPositionCalcData } from '@/hooks/futures/useCalcData';
import { getLeverage } from '@/hooks/futures/useLeverage';
import { getMarkPrice } from '@/hooks/futures/useMarket';
import { getPosition } from '@/hooks/futures/usePosition';
import { getWalletList } from '@/hooks/futures/useWallet';
import { MARGIN_MODE_CROSS, MARGIN_MODE_ISOLATED } from '@/meta/futures';
import {
  calcAMR,
  calcCrossCloseFee,
  calcCrossLiquidPrice,
  calcCrossOpenFee,
  calcCrossPositionOrderMargin,
  calcCrossPosMargin,
  calcCrossPosOrderMM,
  calcCrossRiskRate,
  calcIMR,
  calcIsolatedRiskRate,
  calcMMR,
  calcPosIsolatedRealLeverage,
  calcPosIsolatedTotalMargin,
  calcPosOrderQty,
  calcPosROE,
  calcUnPNL,
  calcValue,
} from '@/pages/Futures/calc';

import { eventEmmiter, formatCurrency, FUTURES, getSymbolInfo } from '@/pages/Futures/import';

import { RAFTaskFallback } from 'src/trade4.0/hooks/common/usePageExpire';
import { makeCalcOrder } from './makeCalcOrder';
import { makeCalcWallet, makePositionWallet } from './makeCalcWallet';
import { getFormatPosData } from './posCalc';

import { getFuturesTakerFee } from '@/hooks/futures/useFuturesTakerFee';

const event = eventEmmiter.getEvt('futures-socket-calc');
const Compute = () => {
  const lockUpdate = useRef();
  const dispatch = useDispatch();

  // 每 1.5s 只调用一次，不超过一次
  const startCalc = useCallback(() => {
    // 如果更新被锁住，直接返回
    if (lockUpdate.current) return;
    console.time('====calc time');
    // 取之前的计算值
    const updateCalcData = {};

    // 是否需要更新
    let needUpdate = false;

    let posOrderMap = {}; // 需要计算的 持仓-订单-symbol
    const positionMap = {}; // 仓位的 map
    const posOrderMarginCurrency = {}; // 持仓订单对冲占用
    const posOrderMarginSymbol = {}; // 持仓订单对冲占用
    const positionWalletMap = {}; // 资产需要的值

    const accountTotalMargin = {}; // 全仓账务总保证金
    const posOrderMM = {};
    const closeFee = {};
    const openFee = {};
    const crossRiskRate = {};
    const AMRMap = {};
    const { allPosValueMap } = getFormatPosData({ positionMap, posOrderMap });

    const { orderSizeMap, orderMarginMap, isolatedOrderMarginMap, orderSymbolMap } =
      makeCalcOrder();

    posOrderMap = { ...posOrderMap, ...orderSymbolMap };

    // posOrderMap 只会在两个位置赋值，全仓订单跟非体验金持有仓位里
    forEach(posOrderMap, (_, symbol) => {
      const position = positionMap[symbol] || {};
      const {
        avgEntryPrice,
        symbol: itemSymbol,
        currentQty,
        posInit,
        posMargin,
        posComm,
        posMaint,
        marginMode,
        leverage: _lev,
        markPrice: MP,
        settleCurrency: _settleCurrency,
        liquidationPrice: liqPrice,
        delevPercentage,
        unrealisedPnl,
        isTrialFunds,
        maintMargin,
        posFunding,
      } = position;

      needUpdate = true;

      const markPrice = getMarkPrice(symbol) || MP;

      const symbolInfo = getSymbolInfo({ symbol, tradeType: FUTURES });
      // 没拉到合约配置
      if (!symbolInfo.symbol) {
        return;
      }

      const { takerFeeRate } = symbolInfo;
      const takerFeeTax = getFuturesTakerFee({ symbol });

      const settleCurrency =
        formatCurrency(symbolInfo?.settleCurrency) || formatCurrency(_settleCurrency);

      const { f, m, mmrLimit, mmrLevConstant } = getFuturesCrossConfigForSymbol({
        symbol,
      });

      let crossPosMargin; // 全仓仓位占用
      let MMR; // 维持保证金率
      let IMR; // 初始保证金率
      let posOrderQty; // 合约订单持仓对冲数量
      let totalMargin; // 逐仓仓位保证金
      let initialMargin; // 全仓初始保证金
      let ROE; // roe
      let isolatedRiskRate; // 逐仓风险率
      // 逐仓先拿接口的数据
      const liquidationPrice = liqPrice;
      let realLeverage; // 真实杠杆（逐仓目前使用的真实杠杆值）
      const adl = delevPercentage;

      // 后续的 itemSymbol 的判断，都是判断是否存在仓位
      // 全仓，逐仓用一个公式
      const unPnl = itemSymbol ? calcUnPNL({ position, symbolInfo, markPrice }) : 0;
      // 标记价值
      const markValue = itemSymbol
        ? calcValue({
            symbolInfo,
            qty: currentQty,
            price: markPrice,
          })
        : 0;

      const isCross = marginMode === MARGIN_MODE_CROSS;
      const isIsolated = marginMode === MARGIN_MODE_ISOLATED || !marginMode;

      if (isIsolated && itemSymbol) {
        // 逐仓总保证金
        totalMargin = calcPosIsolatedTotalMargin({ positionMargin: posMargin, unPnl });
        realLeverage = calcPosIsolatedRealLeverage({
          markValue,
          positionTotalMargin: totalMargin,
          bankruptFee: posComm,
        });
        // 全仓初始保证金
        initialMargin = posInit;
        ROE = calcPosROE({ margin: initialMargin, unPnl });
        // 逐仓维持保证金
        isolatedRiskRate = calcIsolatedRiskRate({
          isolatedTotalMargin: totalMargin,
          isolatedMM: posMaint,
        });
      } else {
        const leverage =
          getLeverage({
            symbol,
            marginMode: MARGIN_MODE_CROSS,
            needDefault: false,
          }) || _lev;
        // 获取持仓挂单对冲数量
        posOrderQty = calcPosOrderQty({ position, symbolInfo, orderMap: orderSizeMap });
        // 全仓MMR
        MMR = calcMMR({ maxLev: mmrLevConstant, m, mmrLimit, posOrderQty });
        // 全仓IMR
        IMR = calcIMR({ leverage, f, MMR });

        // 全仓，有仓位
        if (isCross && itemSymbol) {
          realLeverage = leverage;
          // 全仓占用保证金
          crossPosMargin = calcCrossPosMargin({ symbolInfo, position, IMR, markPrice });
          // 开仓价值
          const openValue = calcValue({ symbolInfo, qty: currentQty, price: avgEntryPrice });
          const crossInitialMargin = abs(multiply(openValue)(IMR));
          ROE = calcPosROE({ margin: crossInitialMargin, unPnl });
          // 累加posOrderMM，用于全仓riskRate计算
          posOrderMM[settleCurrency] = plus(posOrderMM[settleCurrency] || '0')(
            calcCrossPosOrderMM({ symbolInfo, position, posOrderQty, MMR, markPrice }),
          ).toString();

          // 累加closeFee，用于全仓riskRate计算
          closeFee[settleCurrency] = plus(closeFee[settleCurrency] || '0')(
            calcCrossCloseFee({ symbolInfo, position, markPrice, posOrderQty, takerFeeRate }),
          ).toString();
          // 累加openFee，用于全仓riskRate计算
          openFee[settleCurrency] = plus(openFee[settleCurrency] || '0')(
            calcCrossOpenFee({
              position,
              symbolInfo,
              markPrice,
              takerFeeRate: takerFeeTax,
              orderMap: orderSizeMap,
            }),
          ).toString();
        }
      }

      // TIPS: 该更新值不止仓位用到，其它部分也会使用
      updateCalcData[symbol] = {
        IMR,
        MMR,
        markValue: abs(markValue).toString(),
        originMarkValue: markValue,
        totalMargin: totalMargin || crossPosMargin,
        crossPosMargin,
        unPnl,
        ROE,
        realLeverage,
        isolatedRiskRate,
        posOrderQty,
        liquidationPrice,
        currentQty,
        isCross,
        settleCurrency,
        adl,
      };

      // 计算账务仓位值， 有仓位
      if (itemSymbol) {
        makePositionWallet({
          positionWalletMap,
          totalMargin,
          unPnl,
          currency: settleCurrency,
          marginMode,
          posMargin,
          unrealisedPnl,
          isTrialFunds,
          maintMargin,
          posFunding,
        });
      }

      // 全仓持仓订单占用当前 symbol
      const posOrderMargin = calcCrossPositionOrderMargin({
        symbolInfo,
        currentQty,
        positionMargin: crossPosMargin,
        orderMarginMap,
      });
      if (!posOrderMarginCurrency[settleCurrency]) {
        posOrderMarginCurrency[settleCurrency] = posOrderMargin;
      } else {
        posOrderMarginCurrency[settleCurrency] = plus(posOrderMarginCurrency[settleCurrency])(
          posOrderMargin,
        );
      }
      posOrderMarginSymbol[symbol] = posOrderMargin;
    });

    const calcData = getPositionCalcData();
    // 如果此轮未更新，则判断 calcData 是否有值，有值需要更新一次，避免值无法清空
    if (!needUpdate && calcData && Object.keys(calcData)?.length) {
      needUpdate = true;
    }

    const walletList = getWalletList();

    // 计算账务
    const updateWallet = makeCalcWallet({
      walletList,
      positionWalletMap,
      isolatedOrderMarginMap,
      posOrderMarginCurrency,
      accountTotalMargin,
    });

    if (needUpdate) {
      // 全仓不同币种的风险率计算
      forIn(openFee, (value, currency) => {
        // 全仓风险率
        crossRiskRate[currency] =
          accountTotalMargin[currency] === undefined
            ? undefined
            : calcCrossRiskRate({
                posOrderMM: posOrderMM[currency],
                closeFee: closeFee[currency],
                totalMargin: accountTotalMargin[currency],
                openFee: value,
              });
      });

      getPosition({
        condition: (posItem) => {
          const {
            isTrialFunds,
            isOpen,
            settleCurrency,
            symbol,
            markPrice: MP,
            marginMode,
            liquidationPrice: liqPrice,
          } = posItem;
          const currency = formatCurrency(settleCurrency);
          if (!isOpen || isTrialFunds) {
            return false;
          }
          const symbolInfo = getSymbolInfo({ symbol, tradeType: FUTURES });
          // 没拉到合约配置
          if (!symbolInfo.symbol) {
            return;
          }
          const { takerFeeRate } = symbolInfo;
          const markPrice = getMarkPrice(symbol) || MP;
          const isCross = marginMode === MARGIN_MODE_CROSS;
          if (isCross) {
            // 全仓AMR，计算结算币种的AMR
            if (!AMRMap[currency]) {
              AMRMap[currency] = calcAMR({
                totalMargin: accountTotalMargin[currency],
                allPosValueMap,
                currency,
              });
            }
            // 全仓强平价格
            updateCalcData[symbol].liquidationPrice =
              accountTotalMargin[currency] === undefined
                ? liqPrice
                : calcCrossLiquidPrice({
                    position: posItem,
                    symbolInfo,
                    AMR: AMRMap[currency],
                    MMR: updateCalcData[symbol]?.MMR,
                    markPrice,
                    takerFeeRate,
                  });
          }
        },
      });
      const payload = {
        positionCalcData: updateCalcData,
        crossRiskRate,
        orderSizeMap,
        isolatedOrderMarginMap,
        posOrderMarginCurrency,
        posOrderMarginSymbol,
      };

      RAFTaskFallback(() => {
        if (!isEqual(updateWallet, walletList)) {
          dispatch({
            type: 'futuresAssets/update',
            payload: {
              walletList: updateWallet,
            },
          });
        }

        dispatch({
          type: 'futures_calc_data/update',
          payload,
        });
      });

      // TODO: 全仓后续移除，暂时开放给测试使用
      window.inspectData = function inspectData() {
        return JSON.parse(
          JSON.stringify({
            ...payload,
            posOrderMM,
            openFee,
            closeFee,
            accountTotalMargin,
            orderMarginMap,
            wallet: updateWallet,
          }),
        );
      };
    } else {
      // 这里加一个兜底逻辑，判断资产是否更新
      RAFTaskFallback(() => {
        if (!isEqual(updateWallet, walletList)) {
          dispatch({
            type: 'futuresAssets/update',
            payload: {
              walletList: updateWallet,
            },
          });
        }
      });
    }

    console.timeEnd('====calc time');
  }, [dispatch]);

  const updateLockStatus = useCallback((value) => {
    lockUpdate.current = value;
  }, []);

  // 监听是否开启一次计算
  useEffect(() => {
    event.on('futures_start_calc', startCalc);
    return () => {
      event.off('futures_start_calc', startCalc);
    };
  }, [startCalc]);

  // 监听是否需要更改 blocker
  useEffect(() => {
    event.on('futures_start_calc_lock', updateLockStatus);
    return () => {
      event.off('futures_start_calc_lock', updateLockStatus);
    };
  }, [updateLockStatus]);

  return null;
};

export default React.memo(Compute);
