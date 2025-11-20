/**
 * Owner: willen@kupotech.com
 */
import extend from 'dva-model-extend';
import {baseModel} from 'utils/dva';
import {cloneDeep, isEmpty} from 'lodash';
import {
  confirmOrder,
  limitConfirmOrder,
  getConvertBaseConfig,
  getRefreshGap,
  quotePrice,
  queryConvertCurrencyConfig,
  getKyc3TradeLimitInfo,
  limitOrderTax,
  getAllMatchCoins,
} from 'services/convert';
import {
  dropZero,
  numberFixed,
  multiply,
  divide,
  degte,
  delte,
  percisionConvert,
  checkSymbolIsDisabled,
} from 'utils/helper';
import {DEFAULT_BASE, DEFAULT_QUOTE} from 'components/Convert/config';
import {showToast} from '@krn/bridge';
import {tracker} from '@krn/toolkit';
import {Platform} from 'react-native';
import Decimal from 'decimal.js';
import getCurrencyConfig from 'utils/getCurrencyConfig';

const isInRange = (code, start, end) => code >= start && code <= end;
const isInCludes = (code, arr) => arr.includes(code);

// 市价询价时展示横条提示信息
const getTdErrorMsg = e => {
  const {code: _code, msg} = e || {};
  const code = +_code;

  return code &&
    (isInRange(code, 400200, 400302) ||
      isInRange(code, 50070, 50088) ||
      isInCludes(code, [5030, 60024]))
    ? msg
    : null;
};
/**
 * @description: 转成成需要的
 * @param {object} data
 * @return {object}
 */
function convertData(data = {}, isSetU) {
  for (let coin in data) {
    if (Object.prototype.hasOwnProperty.call(data, coin)) {
      const item = data[coin];
      data[coin] = {
        coin: isSetU === true ? 'USDT' : coin, // 币种, USDT map需要设置成USDT
        precision: percisionConvert(item.step), // 数量步长精度
        minNumber: dropZero(item.minSize), // 单笔最小兑换数量
        maxNumber: dropZero(item.maxSize), // 单笔最大兑换数量
      };
    }
  }
  return data;
}

/**
 * @description: 从query或者本地缓存中恢复上次使用的币种， 没有就使用默认的
 * @param {object} coinMap
 * @param {coin} queryFrom
 * @param {coin} queryTo
 * @param {object} from
 * @param {object} to
 * @param {enum} orderType
 * @return {object}
 */
function getLastFromTo(coinMap, queryFrom, queryTo, from, to, orderType) {
  let meta = {};
  if (queryFrom) {
    meta = getCurrencyConfig({
      from: queryFrom,
      to: queryTo,
      coinMap,
      orderType,
    });
  }

  // 无传参、传参无效，拿到默认交易对的参数配置
  if (!meta.from?.coin) {
    let BASE = from.coin || DEFAULT_BASE;
    let QUOTE = to.coin || DEFAULT_QUOTE;
    meta = getCurrencyConfig({from: BASE, to: QUOTE, coinMap, orderType});
  }

  return {lastFrom: meta.from || from, lastTo: meta.to || to};
}

export default extend(baseModel, {
  namespace: 'convert',
  state: {
    orderType: 'MARKET', // 订单类型 MARKET || LIMIT
    selectAccountType: 'BOTH',
    availableBalance: 0, // 可用余额
    fromAvailableBalance: 0,
    toAvailableBalance: 0,
    formStatus: 'normal', // 表单状态, normal为正常状态, error为网络异常失败，expire为轮询结束价格过期
    triggerEmptyValidate: false, // 输入框为 空时点击按钮触发校验
    refreshing: false, // 市价刷新
    limitRefreshing: false, // 限价刷新

    focusType: 'from', // 当前激活的inputItem from or to, 市价单时同 real, 限价单时，输入 get 的时候，不能更新为正真的，输入价格时 为 price
    realInputFocus: 'from', // 输入框聚焦标识，做背景高亮用，值同focusType
    currentEstimates: 'to', // title 应该显示预估的值，from, to, price

    priceInfo: {
      tickerId: null,
      lastUpdateTime: 0, // 最新成交价更新时间
      autoLoopCount: 1, // 自动轮询次数
      loopDurationTime: 5000, // 自动轮询间隔时间（后端提供）
      price: null,
      inversePrice: null,
      base: '',
      quote: '',
      taxSize: '',
      taxCurrency: '',
    },
    emptyMarketPriceInfo: {}, // 市价单空询价的信息
    limitTaxInfo: {}, // 限价单税收
    // 限价单
    limitPriceInfo: {
      oneCoin: '',
      eqCoin: '',
      oneCoinPrice: '',
      eqCoinPrice: '',
    },

    // 限价单巡市价单信息
    limitMarketPriceInfo: {},
    coinMap: {}, // 市价交易对map信息
    limitCoinMap: {}, // 限价交易对map信息
    marketCoinMapLoaded: false, // coinMap 是否请求了，因为做了持久化，需要做个标识只请求一次
    limitCoinMapLoaded: false,
    from: {
      coin: DEFAULT_BASE,
    },
    to: {
      coin: DEFAULT_QUOTE,
    },
    fromValidate: false, // from验证状态
    toValidate: false, // to验证状态
    oldInfo: {
      fromCurrency: '',
      toCurrency: '',
      amount: 0,
    },

    openAccountSheet: false,
    openDepositeSheet: false,
    orderResult: {}, //订单结果
    baseConfig: {}, // 基础配置信息
    lastCachePriceInfo: {}, // 上一次缓存询价信息

    marketorderCoinListLoaded: false, // orderCoinList 是否请求了，因为做了持久化，需要做个标识只请求一次
    limitorderCoinListLoaded: false,
    marginMarkMap: {}, // 杠杆标识
    limitMarginMarkMap: {}, // 杠杆标识

    kyc3TradeLimitInfo: {},

    matchCoinsMap: {}, // 配对的币种
  },
  effects: {
    *resetFormData({payload}, {put, select}) {
      const {from, to} = yield select(state => state.convert);
      yield put({
        type: 'update',
        payload: {
          focusType: 'from',
          from: {coin: from.coin},
          to: {coin: to.coin},
          orderResult: {},
        },
      });
      yield put({type: 'getAllSymbolList'});
    },
    *switchFromAndToCoin({payload}, {put, select}) {
      const {from, to, focusType, realInputFocus, currentEstimates} = cloneDeep(
        yield select(state => state.convert),
      );

      yield put({
        type: 'update',
        payload: {
          formStatus: 'normal',
          fromValidate: false, // 直接重置为false，防止启动轮巡
          toValidate: false,
          from: {...to, amount: ''},
          to: {...from, amount: ''},
          focusType: focusType === 'from' ? 'to' : 'from',
          currentEstimates: currentEstimates !== 'from' ? 'from' : 'to',
          realInputFocus: realInputFocus !== 'from' ? 'from' : 'to',
        },
      });
    },
    /**
     * 历史订单币种列表 用这份数据
     * 和 杠杆代币标识、 热门币种、新币标识
     */
    *getConvertCurrencyConfig({payload}, {call, put, select}) {
      const {orderType = 'MARKET'} = payload || {};
      const {marketorderCoinListLoaded, limitorderCoinListLoaded} =
        yield select(state => state.convert);

      const isMarket = orderType === 'MARKET';

      const marginMarkMapKey = isMarket
        ? 'marginMarkMap'
        : 'limitMarginMarkMap';
      const orderCoinListLoadedKey = isMarket
        ? 'marketorderCoinListLoaded'
        : 'limitorderCoinListLoaded';
      const orderCoinListKey = isMarket
        ? 'orderCoinList'
        : 'limitOrderCoinList';

      const hotsListKey = isMarket ? 'orderHotsList' : 'limitOrderHotsList';

      // 如果已经加载过就不需要在加载了
      if (
        (isMarket && marketorderCoinListLoaded) ||
        (!isMarket && limitorderCoinListLoaded)
      ) {
        return;
      }
      const params = {
        orderType,
      };
      try {
        const {success, data} = yield call(queryConvertCurrencyConfig, params);
        if (success) {
          const marginMarkMap = {};

          const {currencies, hots} = data || {};

          const list = currencies
            .map(item => {
              marginMarkMap[item.currency] = {
                value: item.marginMark,
                type:
                  item.marginMark !== 'NO_MARGIN' // 杠杆代币标识
                    ? item.marginMark.startsWith('LONG')
                      ? 'LONG'
                      : 'SHORT'
                    : null,
                tag: item.tag,
              };
              return {
                ...item,
                // currencyName: categories[item.currency]?.currencyName,
                fullName: item.name,
                name: item.currencyName,
                coin: item.currency,
              };
            })
            .sort((a, b) => (a.currency + '').localeCompare(b.currency + ''));

          // 设置杠杆代币配置
          yield put({
            type: 'update',
            payload: {
              [marginMarkMapKey]: marginMarkMap,
              [orderCoinListLoadedKey]: true,
            },
          });
          // 设置闪兑订单配置
          yield put({
            type: 'order/update',
            payload: {
              [orderCoinListKey]: list || [],
              [hotsListKey]: hots || [],
            },
          });
        }
      } catch (error) {
        yield put({
          type: 'update',
          payload: {
            [marginMarkMapKey]: {},
            [orderCoinListLoadedKey]: false,
          },
        });
        yield put({
          type: 'order/update',
          payload: {
            [orderCoinListKey]: [],
            [hotsListKey]: [],
          },
        });
      }
    },
    /**
     * 币种选择列表 用这份数据，区分限价市价
     * 包含币种的基础配置信息
     * minSize, maxSize, stepSize(precison), tickSize
     */
    *getAllSymbolList({payload}, {call, put, select}) {
      const {queryFrom, queryTo} = payload || {};
      const {from, to, matchCoinsMap, orderType} = yield select(
        state => state.convert,
      );

      const isMarket = orderType === 'MARKET';

      const coinMapLoadedKey = isMarket
        ? 'marketCoinMapLoaded'
        : 'limitCoinMapLoaded';

      try {
        // 从其他路由过来，默认展示的市价tab
        if (queryFrom || queryTo) {
          yield put({
            type: 'update',
            payload: {
              from: {coin: queryFrom || DEFAULT_BASE},
              to: {coin: queryTo || DEFAULT_QUOTE},
            },
          });
        }

        let coinMap = matchCoinsMap[orderType];

        if (isEmpty(coinMap)) {
          coinMap = yield put.resolve({
            type: 'getAllMatchCoins',
          });
        }

        const {lastFrom, lastTo} = getLastFromTo(
          coinMap,
          queryFrom,
          queryTo,
          from,
          to,
          orderType,
        );

        yield put({
          type: 'update',
          payload: {
            [coinMapLoadedKey]: true,
            from: {
              ...lastFrom,
              amount: '',
            },
            to: {
              ...lastTo,
              amount: '',
            },
          },
        });
      } catch (e) {
        console.log('getAllSymbolList error');
        yield put({
          type: 'update',
          payload: {
            [coinMapLoadedKey]: false,
          },
        });
      }
    },
    // 获取配对的币种
    *getAllMatchCoins({payload}, {call, put, select}) {
      const {orderType, matchCoinsMap: odlMatchCoinsMap} = yield select(
        state => state.convert,
      );

      if (!isEmpty(odlMatchCoinsMap[orderType])) {
        return odlMatchCoinsMap[orderType];
      }
      try {
        const {data} = yield call(getAllMatchCoins, {orderType});
        data.normalCurrencyLimitMap = convertData(data.normalCurrencyLimitMap);
        data.usdtCurrencyLimitMap = convertData(
          data.usdtCurrencyLimitMap,
          true,
        );

        yield put({
          type: 'update',
          payload: {
            matchCoinsMap: {
              ...odlMatchCoinsMap,
              [orderType]: data,
            },
          },
        });
        return data;
      } catch (error) {
        yield put({
          type: 'update',
          payload: {
            matchCoinsMap: {
              ...odlMatchCoinsMap,
              [orderType]: {},
            },
          },
        });
      }
    },

    *quotePrice({payload = {}}, {put, select, call}) {
      const stateModel = yield select(state => state.convert);
      const {
        priceInfo,
        from,
        to,
        focusType,
        selectAccountType,
        oldInfo,
        // availableBalance,
        fromAvailableBalance,
        toAvailableBalance,
      } = stateModel;
      const {loopDurationTime} = priceInfo;
      const {needRefresh, step} = payload;
      const version = yield select(state => state.app.version);

      // 交易对禁用，阻止询价
      const isSymbolDisabled = checkSymbolIsDisabled(stateModel);
      if (isSymbolDisabled) return;

      const isFrom = focusType === 'from';

      let amount = isFrom ? from.amount : to.amount;
      const precision = isFrom ? from.precision : to.precision;
      const minNumber = isFrom ? from.minNumber || 0 : to.minNumber || 0;
      const maxNumber = isFrom ? from.maxNumber || 0 : to.maxNumber || 0;
      amount = dropZero(numberFixed(amount, precision));

      const availableBalance = isFrom
        ? fromAvailableBalance
        : toAvailableBalance;

      if (
        from.coin &&
        to.coin &&
        +amount &&
        delte(amount, maxNumber) &&
        degte(amount, minNumber) &&
        (delte(amount, availableBalance) || focusType === 'to')
      ) {
        let data = {tickerId: null};

        let result = {};
        const start = Date.now();

        //币种或数量是否有变化
        const isChange =
          oldInfo.fromCurrency !== from.coin ||
          oldInfo.amount !== amount ||
          oldInfo.toCurrency !== to.coin;

        const handleSensor = () => {
          if (isChange) {
            const return_span = Date.now() - start;
            const blockId = step === 1 ? 'convertInputNew' : 'orderPreviewNew';
            const locationId = step === 1 ? 4 : 1;
            try {
              tracker.onExpose({
                pageId: 'BSfastTradeNew',
                blockId,
                locationId,
                properties: {
                  from_symbol: from.coin,
                  to_symbol: to.coin,
                  from_amount: from.amount,
                  to_amount: to.amount,
                  input_position: focusType,
                  account_type: selectAccountType,
                  return_span,
                  valid_span: loopDurationTime,
                },
              });
            } catch (e) {}
          }
        };

        try {
          if (needRefresh) {
            yield put({
              type: 'update',
              payload: {
                refreshing: true,
              },
            });
          }

          result = yield call(quotePrice, {
            version,
            channel: Platform.OS,
            fromCurrency: from.coin,
            toCurrency: to.coin,
            [isFrom ? 'fromCurrencySize' : 'toCurrencySize']: amount,
          });

          handleSensor();
          yield put({
            type: 'update',
            payload: {
              oldInfo: {fromCurrency: from.coin, amount, toCurrency: to.coin},
              formStatus: 'normal',
            },
          });
        } catch (e) {
          // console.log('---- Ray e ----', e);
          handleSensor();
          yield put({
            type: 'update',
            payload: {
              oldInfo: {fromCurrency: from.coin, amount, toCurrency: to.coin},
              formStatus: 'error',
              // 捕获显示td错误
              errMsg: getTdErrorMsg(e),
            },
          });

          // 当code为5040时，将错误信息提示给用户
          if (e.code && +e.code === 5040) {
            e.msg && showToast(e.msg);
          }
        }

        data = result.data || {};
        // console.log('---- Ray data ----', data);
        const fromAmount = isFrom ? amount : data.size;
        const toAmount = isFrom ? data.size : amount;

        yield put({
          type: 'update',
          payload: {
            ...(isFrom
              ? {to: {...to, amount: toAmount ? dropZero(toAmount) : ''}}
              : {
                  from: {
                    ...from,
                    amount: fromAmount ? dropZero(fromAmount) : '',
                  },
                }),
            priceInfo: {
              ...priceInfo,
              tickerId: data.tickerId,
              lastUpdateTime: Date.now(),
              // autoLoopCount: needRefresh ? 1 : autoLoopCount + 1,
              price: data.price,
              inversePrice: data.inversePrice,
              base: data.base,
              quote: data.quote,
              taxSize: data.taxSize,
              taxCurrency: data.taxCurrency,
            },
            refreshing: false,
          },
        });
      }
    },
    /**
     * 空询价
     */
    *quoteEmptyPrice({payload = {}}, {put, select, call}) {
      // 交易对禁用，阻止询价
      const stateModel = yield select(state => state.convert);
      const isSymbolDisabled = checkSymbolIsDisabled(stateModel);
      if (isSymbolDisabled) return;

      try {
        const version = yield select(state => state.app.version);
        const {fromCurrencySize} = payload;

        if (!+fromCurrencySize) return;

        const {data} = yield call(quotePrice, {
          version,
          channel: Platform.OS,
          ...payload,
        });
        yield put({
          type: 'update',
          payload: {
            emptyMarketPriceInfo: data || {},
          },
        });
      } catch (error) {}
    },
    /**
     * 获取轮训间隔
     */
    *getPriceRefreshGap({payload}, {put, call, select}) {
      const {data} = yield call(getRefreshGap);
      const {priceInfo} = cloneDeep(yield select(state => state.convert));
      yield put({
        type: 'update',
        payload: {
          priceInfo: {
            ...priceInfo,
            loopDurationTime: data * 1000,
          },
        },
      });
    },
    *confirmOrder({payload}, {call, select}) {
      const {isLimit, ...params} = payload;
      const version = yield select(state => state.app.version);

      const start = Date.now();
      try {
        const api = isLimit ? limitConfirmOrder : confirmOrder;
        const data = yield call(api, {...params, version});
        return {
          ...data,
          return_span: Date.now() - start,
        };
      } catch (e) {
        return {
          success: false,
          msg: e.msg,
          code: e.code,
          return_span: Date.now() - start,
        };
      }
    },
    /**
     * 限价单税收
     */
    *limitOrderTax({payload}, {put, call}) {
      try {
        const {success, data} = yield call(limitOrderTax, payload);
        if (success) {
          yield put({type: 'update', payload: {limitTaxInfo: data || {}}});
        }
      } catch (e) {
        console.log(e);
        yield put({type: 'update', payload: {limitTaxInfo: {}}});
      }
    },

    /**
     * 一些基础配置，停机公共，顶飘，限价单期限...
     */
    *getConvertBaseConfig({payload}, {put, call}) {
      try {
        const {success, data} = yield call(getConvertBaseConfig);
        if (success) {
          yield put({type: 'update', payload: {baseConfig: data || {}}});
        }
      } catch (e) {
        console.log(e);
        yield put({type: 'update', payload: {baseConfig: {}}});
      }
    },
    *getKyc3TradeLimitInfo({payload}, {call, put}) {
      const {data} = yield call(getKyc3TradeLimitInfo, payload);
      yield put({type: 'update', payload: {kyc3TradeLimitInfo: data || {}}});
    },

    /**
     * 处理限价单逻辑
     * 计算获得不能四舍五入，要向下取
     */
    *handleLimitLogic({payload}, {call, put, select}) {
      const {direction} = payload;
      const {from, to, focusType, limitPriceInfo} = yield select(
        state => state.convert,
      );
      const {
        amount: fromAmount,
        coin: fromCoin,
        precision: fromPrecision,
      } = from;
      const {amount: toAmount, precision: toPrecision} = to;
      const {oneCoinPrice, oneCoin} = limitPriceInfo;

      /**
       * pay 影响的永远是 get.
       */
      if (direction === 'from') {
        if (
          !toAmount || // 先输入 “pay” 币种数量，没有 get 的时候
          focusType === direction || // 先输入 “pay” 币种数量，价格不变，“get” 数量随之变化；
          (focusType !== direction && toAmount && oneCoinPrice) // 如果三个数量都确认了，改动pay 数量，价格默认不变，影响get数量；
        ) {
          const method = fromCoin === oneCoin ? multiply : divide;

          const amount =
            method(fromAmount, oneCoinPrice, toPrecision, Decimal.ROUND_DOWN) ||
            '';

          yield put({
            type: 'update',
            payload: {
              to: {...to, amount},
              focusType: direction,
              currentEstimates: 'to',
            },
          });
        }
      }

      /**
       * 刚开始一进来就输入 get 时 是影响 pay
       * 如果之前输入了其他值，在来输入 get 则影响的是 单价
       */
      if (direction === 'to') {
        if (
          !fromAmount || // 没有 pay 的时候
          focusType === direction // 先输入 “get” 币种数量，价格不变，“pay” 数量随之变化；
        ) {
          const method = fromCoin === oneCoin ? divide : multiply;

          const amount = method(toAmount, oneCoinPrice, fromPrecision) || '';

          yield put({
            type: 'update',
            payload: {
              from: {...from, amount},
              focusType: direction,
              currentEstimates: 'from',
            },
          });
        }
        // console.log('---- Ray fo ----', focusType, direction);
        // 如果三个数量都确认了，改动get 数量，pay数量默认不变，影响单价；
        if (focusType !== direction && fromAmount) {
          const precision = oneCoin === fromCoin ? toPrecision : fromPrecision;

          const reverseInputPrecision =
            oneCoin === fromCoin ? fromPrecision : toPrecision;

          const amount =
            fromCoin === oneCoin
              ? divide(toAmount, fromAmount, precision)
              : divide(fromAmount, toAmount, precision);

          const eqCoinPrice = divide('1', amount, reverseInputPrecision);

          yield put({
            type: 'update',
            payload: {
              // focusType: direction, // 这里不能去更新 focusType
              limitPriceInfo: {
                ...limitPriceInfo,
                oneCoinPrice: amount || '',
                eqCoinPrice,
              },
              currentEstimates: 'price',
            },
          });
        }
      }

      /**
       * 改动价格
       * 改动价格，pay数量默认不变，影响get数量；
       */
      if (direction === 'price') {
        const method = fromCoin === oneCoin ? multiply : divide;
        const amount =
          method(fromAmount, oneCoinPrice, toPrecision, Decimal.ROUND_DOWN) ||
          '';
        yield put({
          type: 'update',
          payload: {
            focusType: direction,
            to: {
              ...to,
              amount,
            },
            currentEstimates: 'to',
          },
        });
      }
    },
  },
});
