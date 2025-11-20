/**
 * Owner: borden@kupotech.com
 */
import extend from 'dva-model-extend';
import baseUtil from 'common/models/base';
import { _t } from 'utils/lang';
import { TRADE_TYPES_CONFIG } from 'utils/hooks/useTradeTypes';
import { currencyAmount2BtcAmount } from 'components/Isolated/utils';
import { queryReferRate } from 'services/margin';
import { checkContractsStatus } from '@/utils/futures';
import { getPriceForCalc } from '@/pages/OrderForm/utils';
import { sub, add, multiplyAndFixed, floadToPercent, dropZero, multiply, isUndef } from 'helper';
import { routerRedux } from 'dva';
import { getBuySell1 } from '@/pages/Orderbook/hooks/useModelData';

/**
 * 买单 totalAmount 为 金额，卖单 totalAmount 为 量
 * 1. 购买：预估手续费展示为 下單總金額 * 手续费率；
 * 2. 出售：
 *    1. 市价 || 市价止损： 出售quote币种数量 * 买一价格 * 手续费率
 *    2. OCO: 出售quote币种数量 * Max（卖出价，限价）* 手续费率
 *    3. 其他：出售quote币种数量 * 卖出价 * 手续费率
 */
const calcHandlingFee = ({ side, totalAmount, feeRate, precision, price } = {}) => {
  try {
    const amount = side === 'buy' ? totalAmount : multiply(totalAmount, price);
    const fee = multiplyAndFixed(amount, feeRate, precision);

    return dropZero(fee);
  } catch (error) {
    return 0;
  }
};

/**
 * 计算 杠杆税收，如果没有则返回 null，界面中不展示
 * buyTaxRate, sellTaxRate 为后端返回的 taker|| maker率 * 税率 的和值，如果为 null 表示不收税
 * 买单 totalAmount 为 金额，卖单 totalAmount 为 量
 * 买：totalAmount * buyTaxRate
 * 卖：totalAmount * sellTaxRate * buy1
 */
const calcTaxFee = ({ isBuy, totalAmount, taxRate, precision, price } = {}) => {
  try {
    if (isUndef(taxRate)) return null;
    const amount = isBuy ? totalAmount : multiply(totalAmount, price);
    const fee = multiplyAndFixed(amount, taxRate, precision);

    return dropZero(fee);
  } catch (error) {
    return null;
  }
};

export default extend(baseUtil, {
  namespace: 'tradeFormUtils',
  state: {},
  effects: {
    *getLeverConfirmData({ payload = {} }, { call, select }) {
      const categories = yield select((state) => state.categories);
      const { tradeType, currentSymbol } = yield select((state) => state.trade);
      const { formValues } = yield select((state) => state.tradeForm);
      const { marginMap } = yield select((state) => state.user_assets);
      const { positionMap, targetPriceMap } = yield select((state) => state.isolated);
      const { buy1 } = getBuySell1();

      const { symbol = currentSymbol } = payload;
      const { takerFeeRate = 0, makerFeeRate = 0, buyTaxRate, sellTaxRate } = yield select(
        (state) => state.tradeForm.feeInfoMap?.[symbol],
      ) || {};
      const {
        side,
        tradeType: type,
        vals: { price, limitPrice, amount },
      } = formValues;

      const isMarketTrade = /market/.test(type);
      const isSell = side === 'sell';
      const isBuy = side === 'buy';

      const priceForCalc = getPriceForCalc(type, side, price, limitPrice);
      const [base, quote] = symbol.split('-');
      const currency = isSell ? base : quote;
      const { currencyName, precision = 8 } = categories[currency] || {};
      const { currencyName: quoteCurrencyName, precision: quotePrecision } =
        categories[quote] || {};
      const position =
        tradeType === TRADE_TYPES_CONFIG.MARGIN_TRADE.key ? marginMap : positionMap[symbol] || {};

      const { liability: baseLiability = 0 } = position[base] || {};
      const { liability: quoteLiability = 0 } = position[quote] || {};
      const baseTargetPrice = targetPriceMap[`${base}-BTC`] || 0;
      const quoteTargetPrice = targetPriceMap[`${quote}-BTC`] || 0;
      const baseLiabilityToBtc = currencyAmount2BtcAmount(baseLiability, baseTargetPrice, base);
      const quoteLiabilityToBtc = currencyAmount2BtcAmount(quoteLiability, quoteTargetPrice, quote);

      const { availableBalance = 0 } = position[currency] || {};
      // 是否反向开仓，为空买入或者为多卖出为平仓，base负债多为空，quote负债多为多
      const isShortCovering =
        (baseLiabilityToBtc > quoteLiabilityToBtc && isBuy) ||
        (baseLiabilityToBtc < quoteLiabilityToBtc && isSell) ||
        false;
      const totalAmount =
        isMarketTrade || isSell
          ? amount
          : dropZero(multiplyAndFixed(amount || 0, priceForCalc || 0, precision));
      let volume = totalAmount;
      // 买入手续费是外扣，所以计算需借需要加上手续费
      if (isBuy) {
        volume = +add(
          totalAmount || 0,
          multiplyAndFixed(totalAmount || 0, takerFeeRate, precision),
        );
      }
      // 取大
      const feeRate = Math.max(takerFeeRate, makerFeeRate);

      const r = sub(volume || 0, availableBalance);
      const borrowSize = +r.toFixed() > 0 ? r.toFixed() : 0;
      let referRate;
      try {
        const { data } = yield call(queryReferRate, {
          amount: borrowSize,
          currency,
        });
        referRate = data.referRate;
      } catch (e) {
        referRate = 0;
      }

      const handlingFee = calcHandlingFee({
        side,
        totalAmount,
        feeRate,
        precision: quotePrecision,
        price: isMarketTrade ? buy1 : priceForCalc,
      });

      const taxFee = calcTaxFee({
        isBuy,
        totalAmount,
        taxRate: isBuy ? buyTaxRate : sellTaxRate,
        precision: quotePrecision,
        price: isMarketTrade ? buy1 : priceForCalc,
      });

      return {
        currency,
        borrowSize,
        totalAmount,
        currencyName,
        isShortCovering,
        availableBalance,
        referRate: referRate ? floadToPercent(referRate) : '-',
        handlingFee,
        quoteCurrencyName,
        taxFee,
      };
    },

    /**
     * [检查交易对是否是合法的]
     */
    *checkSymbol({ payload }, { select }) {
      const { symbol } = payload;
      const { symbolsMap } = yield select((state) => state.symbols);
      if (!symbol || !symbolsMap[symbol]) {
        return false;
      }
      return true;
    },

    *checkSymbol4_0({ payload }, { select, put }) {
      const { symbol, tradeType, dispatch } = payload;
      const symbolsMap = yield select((state) => state.symbols.symbolsMap || {});
      const marginSymbolsMap = yield select((state) => state.symbols.marginSymbolsMap || {});
      const isMarginType = tradeType === 'isolated' || tradeType === 'margin';
      let info = symbolsMap[symbol];
      if (isMarginType) {
        info = marginSymbolsMap[symbol];
        if (info) {
          // 逐仓
          if (tradeType === 'isolated') {
            // 逐仓可用
            if (info.isIsolatedEnabled) {
              return true;
              // 全仓可用
            } else if (info.isMarginEnabled) {
              setTimeout(() => {
                dispatch(routerRedux.replace(`/margin/${symbol}`));
              }, 50);
              return;
            }
          } else if (tradeType === 'margin') {
            // 逐仓可用
            if (info.isMarginEnabled) {
              return true;
              // 全仓可用
            } else if (info.isIsolatedEnabled) {
              setTimeout(() => {
                dispatch(routerRedux.replace(`/isolated/${symbol}`));
              }, 50);
              return;
            }
            // 现货币币
          }
        }
        setTimeout(() => {
          if (symbol === 'isolated' || symbol === 'margin') {
            dispatch(routerRedux.replace(`/${tradeType}/BTC-USDT`));
          } else {
            dispatch(routerRedux.replace(`/${symbol}`));
          }
        }, 50);
        return;
        // 现货
      } else if (info) {
        return true;
      }
      return false;
    },

    // 校验合约交易对是否合法，并且返回当前交易对信息
    *checkFuturesSymbol({ payload: { symbol } = {} }, { select }) {
      try {
        const contracts = yield select((state) => state.symbols.futuresSymbolsMap);
        // 如果该合约不存在或者已下线
        return checkContractsStatus({ symbol, contracts });
      } catch (err) {
        throw err;
      }
    },
    *getSymbolPrecision({ payload }, { select }) {
      const { symbol } = payload;
      const [_base, _quote] = symbol.split('-');
      const { symbolsMap } = yield select((state) => state.symbols);
      let pre = { base: 8, quote: 8 };
      if (symbolsMap && symbolsMap[symbol]) {
        pre = {
          [_base]: symbolsMap[symbol].basePrecision,
          [_quote]: symbolsMap[symbol].quotePrecision,
        };
      }
      return pre;
    },
  },
  subscriptions: {},
});
