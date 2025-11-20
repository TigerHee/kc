/**
 * Owner: willen@kupotech.com
 */
import extend from 'dva-model-extend';
import baseUtil from 'common/models/base';
import mulPagination from 'common/models/mulPagination';

import {
  getPendingList,
  getIsolatedPendingList,
  getDoneList,
  getIsolatedDoneList,
  getBorrowSize,
  getBorrowIsolatedAppoint,
  postBorrow,
  postIsolatedBorrow,
  postRepay,
  postRepayForAirDrop,
  postIsolatedRepay,
} from 'services/margin';
import {
  multiply,
  getLiabilities,
  currencyAmount2BtcAmount,
  btcAmount2CurrencyAmount,
  getAvailableBalance,
} from 'components/Isolated/utils';
import { getIsolatedTags } from 'services/isolated';
import { STATUS, ACCOUNT_CODE } from 'components/TransferModal/config';
import { add } from 'helper';

const ISOLATED_STATUS = STATUS[ACCOUNT_CODE.ISOLATED];
// 信息是否正常
const checkIsHideInfo = (status, key) => {
  return ISOLATED_STATUS[status] && ISOLATED_STATUS[status][key];
};

// 订阅websocket数据，只挂载一次事件
let subscriptionWs = false;
// 后端返回的最大页数
const maxTotalPage = 100;

export default extend(baseUtil, mulPagination, {
  namespace: 'marginBorrow',
  state: {
    borrowType: '', // 全仓--MARGIN / 杠杆交易--ISOLATED
    borrowSize: null,
    borrowIsolated: null, // 逐仓仓位信息
    borrowMargin: null, // 全仓仓位信息
    positionTags: [], // 逐仓交易对列表
    symbolCode: null, // 逐仓选中的交易对
    // 活跃委托和历史委托
    pendingList: {
      pagination: {
        current: 1,
        pageSize: 10,
      },
      records: [],
    },
    // 未结算和已结算委托
    doneList: {
      pagination: {
        current: 1,
        pageSize: 10,
      },
      records: [],
    },
    shouldPullPendingList: false,
    borrowResult: null,
  },
  reducers: {},
  effects: {
    *pullPendingList({ payload = {} }, { put, call }) {
      const { data, success } = yield call(getPendingList, {
        currentPage: 1,
        pageSize: 10,
        ...payload,
      });
      if (success) {
        // 校正totalNum逻辑，免报错
        const maxTotalNum = maxTotalPage * data.pageSize;
        data.totalNum = data.totalNum > maxTotalNum ? maxTotalNum : data.totalNum;
        yield put({
          type: 'savePage',
          payload: data,
          listName: 'pendingList',
        });
        yield put({
          type: 'update',
          payload: {
            shouldPullPendingList: false,
          },
        });
      }
    },
    *pullDoneList({ payload = {} }, { put, call }) {
      const { data, success } = yield call(getDoneList, {
        currentPage: 1,
        pageSize: 10,
        ...payload,
      });
      if (success) {
        // 校正totalNum逻辑，免报错
        const maxTotalNum = maxTotalPage * data.pageSize;
        data.totalNum = data.totalNum > maxTotalNum ? maxTotalNum : data.totalNum;
        yield put({
          type: 'savePage',
          payload: data,
          listName: 'doneList',
        });
      }
    },
    *pullIsolatedPendingList({ payload = {} }, { put, call, select }) {
      const { symbolCode } = yield select((state) => state.marginBorrow);
      const { currency, currentPage } = payload;
      const currencyCode = currency ? { currencyCode: currency } : null;
      const symbol = symbolCode ? { symbol: symbolCode } : null;
      const params = {
        currentPage,
        ...currencyCode,
        ...symbol,
      };
      const { data, success } = yield call(getIsolatedPendingList, {
        currentPage: 1,
        pageSize: 10,
        ...params,
      });
      if (success) {
        // 校正totalNum逻辑，免报错
        const maxTotalNum = maxTotalPage * data.pageSize;
        data.totalNum = data.totalNum > maxTotalNum ? maxTotalNum : data.totalNum;
        yield put({
          type: 'savePage',
          payload: data,
          listName: 'pendingList',
        });
        yield put({
          type: 'update',
          payload: {
            shouldPullPendingList: false,
          },
        });
      }
    },
    *pullIsolatedDoneList({ payload = {} }, { put, call, select }) {
      const { symbolCode } = yield select((state) => state.marginBorrow);
      const { currency, currentPage } = payload;
      const currencyCode = currency ? { currencyCode: currency } : null;
      const symbol = symbolCode ? { symbol: symbolCode } : null;
      const params = {
        currentPage,
        ...currencyCode,
        ...symbol,
      };
      const { data, success } = yield call(getIsolatedDoneList, {
        currentPage: 1,
        pageSize: 10,
        ...params,
      });
      if (success) {
        // 校正totalNum逻辑，免报错
        const maxTotalNum = maxTotalPage * data.pageSize;
        data.totalNum = data.totalNum > maxTotalNum ? maxTotalNum : data.totalNum;
        yield put({
          type: 'savePage',
          payload: data,
          listName: 'doneList',
        });
      }
    },
    *pullBorrowIsolated({ payload = {} }, { put, call }) {
      if (!payload.tag) return;
      const { data, success } = yield call(getBorrowIsolatedAppoint, payload);
      if (success) {
        yield put({
          type: 'updateIsolatedPosition',
          payload: data,
        });
      }
    },
    // *updateMaxBorrow(){
    //   const { coinsMap } = yield select(state => state.marginMeta);
    //   const {
    //     isDebitEnabled: baseIsDebitEnabled,
    //     borrowMaxAmount: baseBorrowMaxAmount,
    //     borrowMinAmount: baseBorrowMinAmount,
    //     currencyLoanMinUnit: baseCurrencyLoanMinUnit,
    //   } = coinsMap[base] || {};
    //   const {
    //     isDebitEnabled: quoteIsDebitEnabled,
    //     borrowMaxAmount: quoteBorrowMaxAmount,
    //     borrowMinAmount: quoteBorrowMinAmount,
    //     currencyLoanMinUnit: quoteCurrencyLoanMinUnit,
    //   } = coinsMap[quote] || {};
    //     // 最大可借 base
    //     const baseMaxLoanSize = baseIsDebitEnabled ? getMaxBorrowSize({
    //       coin: {
    //         liability: baseTotalLiability,
    //         targetPrice: baseTargetPrice,
    //         borrowMaxAmount: baseBorrowMaxAmount,
    //         borrowMinAmount: baseBorrowMinAmount,
    //         currencyLoanMinUnit: baseCurrencyLoanMinUnit,
    //       },
    //       userLeverage: maxLeverage,
    //       quoteIsSelf: false,
    //       netAsset: currencyAmount2BtcAmount(netAsset, quoteTargetPrice, quote),
    //       totalLiability: currencyAmount2BtcAmount(totalLiability, quoteTargetPrice, quote),
    //     }) : 0;
    //     // 最大可借 quote
    //     const quoteMaxLoanSize = quoteIsDebitEnabled ? getMaxBorrowSize({
    //       coin: {
    //         liability: quoteTotalLiability,
    //         targetPrice: quoteTargetPrice,
    //         borrowMaxAmount: quoteBorrowMaxAmount,
    //         borrowMinAmount: quoteBorrowMinAmount,
    //         currencyLoanMinUnit: quoteCurrencyLoanMinUnit,
    //       },
    //       userLeverage: maxLeverage,
    //       quoteIsSelf: true,
    //       netAsset,
    //       totalLiability,
    //     }) : 0;
    // }
    *updateIsolatedPosition({ payload = {} }, { put, select }) {
      if (!payload) return null;
      const categories = yield select((state) => state.categories);
      const { currentMarket } = yield select((state) => state.marginMeta);
      // const { isolatedSymbolsMap } = yield select(state => state.market);
      const { targetPriceMap } = yield select((state) => state.isolated);
      const {
        baseAsset,
        quoteAsset,
        accumulatedPrincipal,
        tag,
        status,
        totalConversionBalance,
        ...other
      } = payload;

      // const currenctPosition = positionMap[tag] || {};
      // const { flDebtRatio } = isolatedSymbolsMap[tag] || {}; // todo
      const {
        borrowAmount: baseActualLoanSize,
        totalBalance: baseTotalBalance,
        holdBalance: baseHoldBalance,
        liabilityInterest: baseLiabilityInterest,
        liabilityPrincipal: baseLiabilityPrincipal,
        liability: baseLiability,
        markPrice: baseMarkPrice,
        availableBalance: oldBaseAvailableBalance,
        marginCoefficient: baseMarginCoefficient = 1,
      } = baseAsset;
      const {
        borrowAmount: quoteActualLoanSize,
        totalBalance: quoteTotalBalance,
        holdBalance: quoteHoldBalance,
        liabilityInterest: quoteLiabilityInterest,
        liabilityPrincipal: quoteLiabilityPrincipal,
        liability: quoteLiability,
        markPrice: quoteMarkPrice,
        availableBalance: oldQuoteAvailableBalance,
        marginCoefficient: quoteMarginCoefficient = 1,
      } = quoteAsset;

      const [base, quote] = tag.split('-');
      const baseTargetPrice = baseMarkPrice || targetPriceMap[base] || 0;
      const quoteTargetPrice = quoteMarkPrice || targetPriceMap[quote] || 0;
      const { precision: basePrecision } = categories[base] || { precision: 8 };
      const { precision: quotePrecision } = categories[quote] || { precision: 8 };

      const baseTotalLiability = baseAsset
        ? add(baseLiabilityInterest, baseLiabilityPrincipal).toFixed()
        : baseLiability;
      const quoteTotalLiability = quoteAsset
        ? add(quoteLiabilityInterest, quoteLiabilityPrincipal).toFixed()
        : quoteLiability;
      const baseAvailableBalance = baseAsset
        ? getAvailableBalance(baseTotalBalance, baseHoldBalance, basePrecision)
        : oldBaseAvailableBalance;
      const quoteAvailableBalance = quoteAsset
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
      // 负债率
      const liabilityRate = !checkIsHideInfo(status, 'isHideLiabilityRate')
        ? getLiabilities(totalBalanceWithCoefficient, totalLiability)
        : null;

      const nextBaseAsset = {
        // ...currenctPosition.baseAsset || {},
        ...baseAsset,
        currency: base,
        precision: basePrecision,
        targetPrice: baseTargetPrice,
        liability: baseTotalLiability,
        availableBalance: baseAvailableBalance,
        actualLoanSize: baseActualLoanSize,
      };
      const nextQuoteAsset = {
        // ...currenctPosition.quoteAsset || {},
        ...quoteAsset,
        currency: quote,
        precision: quotePrecision,
        targetPrice: quoteTargetPrice, // 标记价格
        liability: quoteTotalLiability,
        availableBalance: quoteAvailableBalance,
        actualLoanSize: quoteActualLoanSize,
      };
      const borrowIsolated = {
        // ...currenctPosition,
        ...other,
        tag,
        status,
        liabilityRate,
        totalBalance, // quote币种结算
        totalLiability, // quote币种结算
        availableBalance: quoteAvailableBalance, // quote币种结算
        accumulatedPrincipal,
        [base]: nextBaseAsset,
        [quote]: nextQuoteAsset,
        totalConversionLiability,
        totalConversionBalance: _totalConversionBalance,
      };
      yield put({
        type: 'update',
        payload: {
          borrowIsolated,
        },
      });
      const borrowSize = {
        totalBalance: borrowIsolated[currentMarket].totalBalance.toString(),
        actualLoanSize: borrowIsolated[currentMarket].actualLoanSize,
        availableBalance: borrowIsolated[currentMarket].availableBalance,
        currency: currentMarket,
        liability: borrowIsolated[currentMarket].liability,
        liabilityRate,
        status,
        [base]: nextBaseAsset,
        [quote]: nextQuoteAsset,
      };
      yield put({
        type: 'update',
        payload: {
          borrowSize,
        },
      });
    },
    *postBorrow({ payload = {} }, { put, call, select }) {
      try {
        const { data, success } = yield call(postBorrow, { ...payload });
        const { currentMarket } = yield select((state) => state.marginMeta);
        if (success) {
          if (data && data.actualSize > 0) {
            yield put({
              type: 'pullMarginBorrowSize',
              payload: {
                currency: currentMarket,
              },
            });
          }
        }
        return data;
      } catch (error) {
        return error;
      }
    },
    *postIsolatedBorrow({ payload = {} }, { put, call, select }) {
      try {
        const { symbolCode } = yield select((state) => state.marginBorrow);
        const { data, success } = yield call(postIsolatedBorrow, {
          ...payload,
          symbol: symbolCode,
        });
        if (success) {
          if (data && data.actualSize > 0) {
            yield put({
              type: 'pullBorrowIsolated',
              payload: {
                tag: symbolCode,
              },
            });
          }
        }
        return data;
      } catch (error) {
        return error;
      }
    },
    // 拉取全仓借入仓位
    *pullMarginBorrowSize({ payload = {}, callback }, { put, call }) {
      try {
        const { currency } = payload;
        const { data } = yield call(getBorrowSize, { currency });
        yield put({
          type: 'update',
          payload: {
            borrowMargin: data,
            borrowSize: data,
          },
        });
        if (typeof callback === 'function') callback();
      } catch (e) {
        yield put({
          type: 'update',
          payload: {
            borrowMargin: {},
            borrowSize: {},
          },
        });
        if (e && e.msg) {
          yield put({
            type: 'notice/feed',
            payload: {
              type: 'message.error',
              message: e.msg,
            },
          });
        }
      }
    },
    // 拉取逐仓借入仓位
    *pullIsolatedBorrowSize({ payload = {}, callback }, { put, call, select }) {
      const { symbolCode: _symbolCode } = yield select((state) => state.marginBorrow);
      const symbolCode = payload.symbolCode || _symbolCode;
      const { data, success } = yield call(getIsolatedTags, {
        bizType: 'BORROW',
        includeSymbolName: true,
        currency: payload.currency,
      });
      if (success) {
        if (data && data.length > 0) {
          yield put({
            type: 'update',
            payload: {
              positionTags: data,
            },
          });
          if (symbolCode) {
            const { success: suc, data: isolatedData } = yield call(getBorrowIsolatedAppoint, {
              tag: symbolCode,
            });
            if (suc) {
              if (!_symbolCode) {
                yield put({ type: 'update', payload: { symbolCode } });
              }
              yield put({
                type: 'updateIsolatedPosition',
                payload: isolatedData,
              });
              if (typeof callback === 'function') callback();
            }
          } else {
            const { symbol } = data[0];
            yield put({
              type: 'update',
              payload: {
                symbolCode: symbol,
              },
            });
            yield put({
              type: 'pullBorrowIsolated',
              payload: {
                tag: symbol,
              },
            });
          }
        }
      }
    },
    *postRepay({ isAirDropEnabled, payload = {} }, { call }) {
      const res = yield call(isAirDropEnabled ? postRepayForAirDrop : postRepay, payload);
      return res;
    },
    *postIsolatedRepay({ payload = {} }, { call }) {
      const res = yield call(postIsolatedRepay, payload);
      return res;
    },
    *updateDebtRatio({ payload = {} }, { put, select }) {
      const { borrowMargin } = yield select((state) => state.marginBorrow);
      const { currentMarket } = yield select((state) => state.marginMeta);
      const {
        data: { debtRatio, debtList },
      } = payload;
      if (borrowMargin && typeof debtRatio === 'number') {
        yield put({
          type: 'update',
          payload: {
            borrowMargin: {
              ...borrowMargin,
              liabilityRate: debtRatio,
              liability: debtList[currentMarket] || 0,
            },
          },
        });
      }
    },
    *borrow({ payload = {}, isIsolated }, { call }) {
      const res = yield call(isIsolated ? postIsolatedBorrow : postBorrow, payload);
      return res;
    },
  },
  subscriptions: {
    setUp({ dispatch }) {
      if (subscriptionWs) {
        return;
      }
      subscriptionWs = true;
      import('src/utils/socket').then(({ kcWs: socket }) => {
        socket.topicMessage(
          '/margin/position',
          'debt.ratio',
          true,
        )(
          (arr) => {
            dispatch({
              type: 'updateDebtRatio',
              payload: arr[0],
            });
          },
          { frequency: 200 },
        );
      });
    },
  },
});
