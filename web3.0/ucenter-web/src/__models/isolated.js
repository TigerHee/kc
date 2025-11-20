/**
 * Owner: willen@kupotech.com
 */
/*
 * @Author: Borden.Lan
 * @Date: 2021-04-30 16:21:18
 * @Description:逐仓相关
 */
import baseUtil from 'common/models/base';
import polling from 'common/models/polling';
import {
  btcAmount2CurrencyAmount,
  currencyAmount2BtcAmount,
  getAvailableBalance,
  getLiabilities,
  getLiquidationPrice,
  getNetAsset,
  multiply,
} from 'components/Isolated/utils';
// import { ACCOUNT_CODE, STATUS } from 'components/TransferModal/config';
import { ACCOUNT_CODE, STATUS } from 'components/KuxTransferModal/config';
import extend from 'dva-model-extend';
import { add, sub } from 'helper';
import { each, filter, isEqual, map, pick, values } from 'lodash';
import { getIsolatedAccountAssets } from 'services/assets';
import * as serv from 'services/isolated';

const ISOLATED_STATUS = STATUS[ACCOUNT_CODE.ISOLATED];
// 信息是否正常
const checkIsHideInfo = (status, key) => {
  return ISOLATED_STATUS[status] && ISOLATED_STATUS[status][key];
};

// 订阅websocket数据，只挂载一次事件
let subscriptionWs = false;

export default extend(baseUtil, polling, {
  namespace: 'isolated',
  state: {
    changePricePosition: null,
    positionMap: {},
    isolatedAccountAssets: {}, // 逐仓仓位明细
    tagMap: {},
    targetPriceMap: {
      BTC: 1,
    },
  },
  reducers: {
    updateTargetPrice(state, { payload }) {
      return {
        ...state,
        targetPriceMap: { ...state.targetPriceMap, ...payload },
      };
    },
    updatePositionMap(state, { payload }) {
      return {
        ...state,
        positionMap: { ...state.positionMap, ...payload },
      };
    },
    updateTagMap(state, { payload }) {
      const nextTagMap = { ...state.tagMap };
      each(values(payload), (item) => {
        const { tag, status, isAutoRepay } = item;
        nextTagMap[tag] = {
          ...(nextTagMap[tag] || {}),
          ...(status !== undefined ? { status } : {}),
          ...(isAutoRepay !== undefined ? { isAutoRepay } : {}),
        };
      });
      return {
        ...state,
        tagMap: nextTagMap,
      };
    },
  },
  effects: {
    *pullIsolatedAppoint({ forceFetch = false }, { call, put }) {
      // sokect正常连接并且topic_state为1时，阻止此次fetch
      const ws = yield import('@kc/socket');
      const socket = ws.getInstance();
      if (!forceFetch && socket.connected()) {
        const topic = ws.Topic.get('/margin/isolatedPosition:{SYMBOL_LIST}', {
          SYMBOLS: ['all'],
        });
        const topicStateData = socket.constructor.TOPIC_STATE.SUBSCRIBED;
        if (socket) {
          const { topicState } = socket;
          if (topicState[topic] && topicState[topic][0] === topicStateData) {
            return;
          }
        }
      }
      const { success, data } = yield call(getIsolatedAccountAssets);
      if (success) {
        const { positions, markPrices, ...other } = data;

        yield put({
          type: 'updateTargetPrice',
          payload: markPrices,
        });
        const dataMap = {};
        each(positions, (item, index) => {
          // _index: 用来保持接口返回的顺序
          dataMap[item.tag] = { ...item, _index: index + 1 };
        });
        yield put({
          type: 'updateIsolatedAccountAssets',
          payload: { ...other },
        });
        yield put({
          type: 'updatePosition',
          isRest: true, // 强制请求
          payload: dataMap,
        });
      }
    },
    // map 转 list
    *updateIsolatedAccountAssets({ payload }, { put, select }) {
      const { isRest, positionMap, totalBalance, totalLiability } = payload || {};
      const { balanceCurrency } = yield select((state) => state.user);
      const { isolatedAccountAssets, targetPriceMap } = yield select((state) => state.isolated);
      let nextPositions = [];
      // 接口拉取全量替换
      if (isRest) {
        nextPositions = filter(values(positionMap), (v) => v._index);
      } else if (isolatedAccountAssets.positions && isolatedAccountAssets.positions.length) {
        nextPositions = map(isolatedAccountAssets.positions, (item) => {
          return positionMap && positionMap[item.tag] ? positionMap[item.tag] : item;
        });
      }
      const baseCurrencyMarkPrice = targetPriceMap[balanceCurrency];
      const nextIsolatedAccountAssets = {
        positions: nextPositions,
        baseCurrency: baseCurrencyMarkPrice ? balanceCurrency : 'BTC',
      };
      // 后端接口返回的源数据是以BTC计价
      const isBTC = nextIsolatedAccountAssets.baseCurrency === 'BTC';
      // 接口拉取的，下面俩值不走计算，为undefined
      if (totalBalance !== undefined) {
        nextIsolatedAccountAssets.totalBalance = totalBalance;
        nextIsolatedAccountAssets.displayTotalBalance = isBTC
          ? totalBalance
          : btcAmount2CurrencyAmount(totalBalance, baseCurrencyMarkPrice);
      }
      if (totalLiability !== undefined) {
        nextIsolatedAccountAssets.totalLiability = totalLiability;
        nextIsolatedAccountAssets.displayTotalLiability = isBTC
          ? totalLiability
          : btcAmount2CurrencyAmount(totalLiability, baseCurrencyMarkPrice);
      }
      if (totalBalance !== undefined && totalLiability !== undefined) {
        // 净资产
        const netAsset = getNetAsset(totalBalance, totalLiability);
        nextIsolatedAccountAssets.netAsset = netAsset;
        nextIsolatedAccountAssets.displayNetAsset = isBTC
          ? netAsset
          : btcAmount2CurrencyAmount(netAsset, baseCurrencyMarkPrice);
      }
      yield put({
        type: 'update',
        payload: {
          isolatedAccountAssets: { ...isolatedAccountAssets, ...nextIsolatedAccountAssets },
        },
      });
    },
    // isRest: 是否接口拉取，区别于推送
    *updatePosition({ payload, isRest = false }, { put, select }) {
      const categories = yield select((state) => state.categories);
      const { symbolsInfoMap, isolatedSymbolsMap } = yield select((state) => state.market);
      const { smallExchangeConfig } = yield select((state) => state.user_assets);
      const { positionMap, tagMap, targetPriceMap, isolatedAccountAssets } = yield select(
        (state) => state.isolated,
      );
      let isolatedTotalBalance = isRest ? undefined : isolatedAccountAssets.totalBalance;
      let isolatedTotalLiability = isRest ? undefined : isolatedAccountAssets.totalLiability;
      const { baseCurrency } = smallExchangeConfig || {};

      const changePosition = {};

      each(values(payload), (item) => {
        const { tag: currentSymbol } = item || {};
        const currentTagConfig = tagMap[currentSymbol] || {};
        const currentPosition = positionMap[currentSymbol] || {};
        const {
          tag,
          baseAsset,
          quoteAsset,
          totalConversionBalance,
          status = currentPosition.status,
          isAutoRepay = currentTagConfig.isAutoRepay,
          accumulatedPrincipal = currentPosition.accumulatedPrincipal,
          ...other
        } = item || {};
        const [base, quote] = tag.split('-');
        // 接口拉取的数据直接更新
        const isChangeBaseAsset =
          baseAsset &&
          (isRest ||
            !isEqual(
              baseAsset,
              pick(currentPosition[base], [
                'holdBalance',
                'liabilityInterest',
                'liabilityPrincipal',
                'totalBalance',
              ]),
            ));
        const isChangeQuoteAsset =
          quoteAsset &&
          (isRest ||
            !isEqual(
              quoteAsset,
              pick(currentPosition[quote], [
                'holdBalance',
                'liabilityInterest',
                'liabilityPrincipal',
                'totalBalance',
              ]),
            ));
        // base或者quote的仓位是否存在变化
        const isChange = [isChangeBaseAsset, isChangeQuoteAsset].some((v) => v);
        const {
          [base]: currentBaseAsset = null,
          [quote]: currentQuoteAsset = null,
          liquidationPrice: oldLiquidationPrice = 0,
        } = currentPosition;
        const mergeBaseAsset = { ...currentBaseAsset, ...baseAsset };
        const mergeQuoteAsset = { ...currentQuoteAsset, ...quoteAsset };
        if ([mergeBaseAsset, mergeQuoteAsset].some((v) => JSON.stringify(v) === '{}')) return;
        const { flDebtRatio = 0 } = isolatedSymbolsMap[tag] || {};
        const { pricePrecision = 8 } = symbolsInfoMap[tag] || {};

        const {
          liability: baseLiability,
          markPrice: baseMarkPrice,
          availableBalance: oldBaseAvailableBalance,
          totalBalance: baseTotalBalance,
          holdBalance: baseHoldBalance,
          liabilityInterest: baseLiabilityInterest,
          liabilityPrincipal: baseLiabilityPrincipal,
          marginCoefficient: baseMarginCoefficient = 1,
        } = mergeBaseAsset;
        const {
          liability: quoteLiability,
          markPrice: quoteMarkPrice,
          availableBalance: oldQuoteAvailableBalance,
          totalBalance: quoteTotalBalance,
          holdBalance: quoteHoldBalance,
          liabilityInterest: quoteLiabilityInterest,
          liabilityPrincipal: quoteLiabilityPrincipal,
          marginCoefficient: quoteMarginCoefficient = 1,
        } = mergeQuoteAsset;

        const baseTargetPrice = baseMarkPrice || targetPriceMap[base] || 0;
        const quoteTargetPrice = quoteMarkPrice || targetPriceMap[quote] || 0;

        const { precision: basePrecision } = categories[base] || { precision: 8 };
        const { precision: quotePrecision } = categories[quote] || { precision: 8 };

        const baseTotalLiability = isChangeBaseAsset
          ? add(baseLiabilityInterest, baseLiabilityPrincipal).toFixed()
          : baseLiability;
        const quoteTotalLiability = isChangeQuoteAsset
          ? add(quoteLiabilityInterest, quoteLiabilityPrincipal).toFixed()
          : quoteLiability;
        const baseAvailableBalance = isChangeBaseAsset
          ? getAvailableBalance(baseTotalBalance, baseHoldBalance, basePrecision)
          : oldBaseAvailableBalance;
        const quoteAvailableBalance = isChangeQuoteAsset
          ? getAvailableBalance(quoteTotalBalance, quoteHoldBalance, quotePrecision)
          : oldQuoteAvailableBalance;

        const baseRest = [baseTargetPrice, base];
        // 涉及到标记价格的计算，即使传过来的asset为空，也保持计算
        const baseTotalBalanceToQuote = btcAmount2CurrencyAmount(
          currencyAmount2BtcAmount(baseTotalBalance, ...baseRest),
          quoteTargetPrice,
        );
        const baseLiabilityToQuote = btcAmount2CurrencyAmount(
          currencyAmount2BtcAmount(baseTotalLiability, ...baseRest),
          quoteTargetPrice,
        );
        // 账户总资产（单位：quote）
        const totalBalance = add(baseTotalBalanceToQuote, quoteTotalBalance).toFixed();
        // 带入了保证金系数的账户总资产（单位：quote）
        const totalBalanceWithCoefficient = add(
          multiply(baseTotalBalanceToQuote, baseMarginCoefficient),
          multiply(quoteTotalBalance, quoteMarginCoefficient),
        ).toFixed();
        const _totalConversionBalance =
          totalConversionBalance !== undefined
            ? totalConversionBalance
            : currencyAmount2BtcAmount(totalBalance, quoteTargetPrice, quote);
        // 账户总负债（单位：quote）
        const totalLiability = add(baseLiabilityToQuote, quoteTotalLiability).toFixed();
        const totalConversionLiability = currencyAmount2BtcAmount(
          totalLiability,
          quoteTargetPrice,
          quote,
        );
        if (!isRest && isChange) {
          const totalBalanceDiffer = sub(
            _totalConversionBalance,
            currentPosition.totalConversionBalance || 0,
          ).toFixed();
          const totalLiabilityDiffer = sub(
            totalConversionLiability,
            currentPosition.totalConversionLiability || 0,
          ).toFixed();
          isolatedTotalBalance = add(isolatedTotalBalance || 0, totalBalanceDiffer).toFixed();
          isolatedTotalLiability = add(isolatedTotalLiability || 0, totalLiabilityDiffer).toFixed();
        }
        // 依据小额资产，增加小额资产
        const baseCurrencyPrice = targetPriceMap[baseCurrency] || 0;
        const baseCurrencyAmount =
          btcAmount2CurrencyAmount(_totalConversionBalance, baseCurrencyPrice) || 0;

        const nextBaseAsset = {
          ...mergeBaseAsset,
          currency: base,
          precision: basePrecision,
          markPrice: baseTargetPrice,
          liability: baseTotalLiability,
          availableBalance: baseAvailableBalance,
        };
        const nextQuoteAsset = {
          ...mergeQuoteAsset,
          currency: quote,
          precision: quotePrecision,
          markPrice: quoteTargetPrice, // 标记价格
          liability: quoteTotalLiability,
          availableBalance: quoteAvailableBalance,
        };
        // // 净资产
        // const netAsset = getNetAsset(totalBalance, totalLiability);
        // // 账户真实杠杆倍数
        // const realLeverage = getRealLeaverage(totalBalance, netAsset);
        // 盈亏
        // const earning = getEarning(netAsset, nextQuoteAsset, accumulatedPrincipal);
        // // 盈利率
        // const earningRate = getEarningRate(earning, accumulatedPrincipal);
        // 负债率
        const liabilityRate = !checkIsHideInfo(status, 'isHideLiabilityRate')
          ? getLiabilities(totalBalanceWithCoefficient, totalLiability)
          : null;
        // 强平价
        let liquidationPrice = null;
        if (!checkIsHideInfo(status, 'isHideLiquidationPrice')) {
          if (isChange) {
            liquidationPrice = getLiquidationPrice(
              nextBaseAsset,
              nextQuoteAsset,
              flDebtRatio,
              pricePrecision,
            );
          } else {
            liquidationPrice = oldLiquidationPrice;
          }
        }
        changePosition[tag] = {
          ...currentPosition,
          ...other,
          tag,
          status,
          // earning,
          // netAsset,
          // earningRate,
          // realLeverage,
          isAutoRepay,
          liabilityRate,
          baseCurrencyPrice,
          baseCurrencyAmount,
          totalBalance, // quote币种结算
          totalLiability, // quote币种结算
          liquidationPrice,
          accumulatedPrincipal,
          [base]: nextBaseAsset,
          [quote]: nextQuoteAsset,
          totalConversionLiability,
          totalConversionBalance: _totalConversionBalance,
        };
      });
      yield put({
        type: 'updatePositionMap',
        payload: changePosition,
      });
      // 推送更新 总资产和仓位
      yield put({
        type: 'updateIsolatedAccountAssets',
        payload: {
          isRest,
          positionMap: changePosition,
          totalBalance: isolatedTotalBalance,
          totalLiability: isolatedTotalLiability,
        },
      });
      yield put({
        type: 'updateTagMap',
        payload: changePosition,
      });
    },
    // 获取用户仓位详情
    *pullTargetPrice({ put, call }) {
      const symbolsStr = 'all';
      // sokect正常连接并且topic_state为1时，阻止此次fetch
      const ws = yield import('@kc/socket');
      const socket = ws.getInstance();
      const connected = socket.connected();
      const topicStateData = socket.constructor.TOPIC_STATE.SUBSCRIBED;
      if (connected) {
        const topic = ws.Topic.get('/indicator/markPrice:{SYMBOL_LIST}', {
          SYMBOLS: [symbolsStr],
        });
        const wsState = socket;
        if (wsState) {
          const { topicState } = wsState;
          if (topicState[topic] && topicState[topic][0] === topicStateData) {
            return;
          }
        }
      }
      const { success, data } = yield call(serv.getTargetPrice);
      if (success) {
        const targetPriceMap = {};
        each(data, (item) => {
          targetPriceMap[item.symbol.split('-')[0]] = item.value;
        });
        yield put({
          type: 'updateTargetPrice',
          payload: targetPriceMap,
        });
        yield put({
          type: 'updateChangePricePosition',
        });
      }
    },
    *pullPositionStatusByTag({ payload = {} }, { call, put }) {
      const { tag } = payload;
      // const { currentSymbol } = yield select(state => state.trade);
      // if (tag === currentSymbol) return;
      // 后端Ethan确认，查状态就用根据交易对查仓位的接口
      const { data } = yield call(serv.getIsolatedAppoint, payload);
      yield put({
        type: 'updateTagMap',
        payload: {
          [tag]: {
            tag,
            status: data.status,
            isAutoRepay: data.isAutoRepay,
          },
        },
      });
    },
    *updateAutoRepay({ payload = {}, callback }, { call, put }) {
      const { symbol, switchStatus } = payload;
      const { success } = yield call(serv.updateAutoRepay, {
        symbol,
        isEnabled: switchStatus,
      });
      if (success) {
        yield put({
          type: 'updateTagMap',
          payload: {
            [symbol]: {
              tag: symbol,
              isAutoRepay: switchStatus,
            },
          },
        });
        if (typeof callback === 'function') callback();
      }
    },
    *updateChangePricePosition({ put, select }) {
      const pricePosition = {};
      const { targetPriceMap, positionMap, changePricePosition } = yield select(
        (state) => state.isolated,
      );
      Object.keys(positionMap).forEach((key) => {
        const { tag, totalBalance, totalLiability } = positionMap[key];
        const isLegalAccount = !(+totalBalance || +totalLiability);
        if (!isLegalAccount) {
          const [base, quote] = tag.split('-');
          const basePrice = targetPriceMap[base] || 0;
          const quotePrice = targetPriceMap[quote] || 0;
          const oldBasePrice = changePricePosition && changePricePosition[key].baseTargetPrice;
          const oldQuotePrice = changePricePosition && changePricePosition[key].quoteTargetPrice;
          if (
            (positionMap[key][base].targetPrice && oldBasePrice) !== basePrice ||
            (positionMap[key][quote].targetPrice && oldQuotePrice) !== quotePrice
          ) {
            pricePosition[tag] = {
              tag: key,
              baseTargetPrice: basePrice,
              quoteTargetPrice: quotePrice,
            };
          }
        }
      });
      if (JSON.stringify(pricePosition) === '{}') return;
      yield put({
        type: 'update',
        payload: { changePricePosition: pricePosition },
      });
    },
  },
  subscriptions: {
    watchPolling({ dispatch }) {
      dispatch({
        type: 'watchPolling',
        payload: {
          effect: 'pullTargetPrice',
        },
      });
      dispatch({
        type: 'watchPolling',
        payload: {
          effect: 'pullIsolatedAppoint',
        },
      });
    },
    subscribeMessage() {
      if (subscriptionWs) {
        return;
      }
      subscriptionWs = true;
    },
  },
});
