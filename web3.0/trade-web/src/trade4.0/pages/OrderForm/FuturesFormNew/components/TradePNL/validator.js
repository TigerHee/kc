/**
 * Owner: garuda@kupotech.com
 */

import { LONG_TYPE, PROFIT_TYPE, priceTypeToLocaleKey } from './config';
import { calcProfitRate, calcLossRate, expectLiquidationPrice } from './utils';

import {
  MARGIN_MODE_CROSS,
  getDigit,
  greaterThan,
  greaterThanOrEqualTo,
  lessThan,
  lessThanOrEqualTo,
  thousandPointed,
} from '../../builtinCommon';

import { getMarginMode } from '../../builtinHooks';
import { getSymbolInfo, getTriggerPrice } from '../../hooks/useGetData';

const validator = (data, pnlType, _t) => {
  const { openPrice, formPrice, lev, inputType, stopPriceType } = data;
  const { symbolInfo: contract, symbol } = getSymbolInfo();
  const { lastPrice, markPrice, indexPrice } = getTriggerPrice();
  const { maxPrice } = contract;

  const isGreaterThanMaxPrice = greaterThan(formPrice)(maxPrice);
  const isLessThanMinPrice = lessThanOrEqualTo(formPrice)(0);

  let isPriceError;
  let sideText;

  let isLastPriceError;
  let lastPriceSideText;
  const isProfit = inputType === PROFIT_TYPE;

  const priceTypeMap = {
    TP: lastPrice,
    MP: markPrice,
    IP: indexPrice,
  };

  const checkPrice = priceTypeMap[stopPriceType] || 0;
  // 做多
  if (pnlType === LONG_TYPE) {
    isPriceError = isProfit
      ? lessThanOrEqualTo(formPrice)(openPrice)
      : greaterThanOrEqualTo(formPrice)(openPrice);
    sideText = isProfit ? _t('stopClose.lower') : _t('stopClose.higher');

    // 做多的时候，输入框是止损，
    // 设定的止损价格需要小于当前最新价格
    if (!isProfit) {
      isLastPriceError = greaterThanOrEqualTo(formPrice)(checkPrice);
      lastPriceSideText = _t('stopClose.higher');
    }
  } else {
    isPriceError = isProfit
      ? greaterThanOrEqualTo(formPrice)(openPrice)
      : lessThanOrEqualTo(formPrice)(openPrice);
    // 设定的止损价格需要高于当前最新价格
    if (!isProfit) {
      isLastPriceError = lessThanOrEqualTo(formPrice)(checkPrice);
      lastPriceSideText = _t('stopClose.lower');
    }
    sideText = isProfit ? _t('stopClose.higher') : _t('stopClose.lower');
  }

  if (isLessThanMinPrice) {
    return _t('contract.stopPrice.check', { price: thousandPointed(maxPrice) });
  }

  if (isGreaterThanMaxPrice) {
    return _t('contract.stopPrice.check', { price: thousandPointed(maxPrice) });
  }

  // 判断是否止盈率/亏损率<0
  if (!!openPrice && !!formPrice && !isPriceError) {
    if (isProfit) {
      const profitRate = calcProfitRate(contract, data);
      isPriceError = lessThan(profitRate)(0);
    } else {
      const profitRate = calcLossRate(contract, data);
      isPriceError = lessThan(profitRate)(0);
    }
  }

  if (!!openPrice && !!formPrice && isPriceError) {
    const typeSide = isProfit ? 'stopClose.profit.error' : 'stopClose.loss.error';
    return _t(typeSide, {
      side: sideText,
      price: thousandPointed(openPrice),
      type: _t('trade.positionsOrders.entryPrice'),
    });
  }

  // KUM-14005 止赢止损下单优化
  // 如果是多单，设定的止损价格需要小于当前最新价格
  // 如果是空单，设置的止损价格需要高于当前最新价格
  if (!!openPrice && !!formPrice && isLastPriceError && checkPrice) {
    return _t(`stopClose.${inputType}.error`, {
      side: lastPriceSideText,
      price: thousandPointed(checkPrice),
      type: _t(priceTypeToLocaleKey[stopPriceType]),
    });
  }

  if (!!openPrice && !!formPrice && !isPriceError && !isProfit) {
    let liquidationPrice;
    const marginMode = getMarginMode(symbol);
    // 全仓不校验强平价格
    if (marginMode === MARGIN_MODE_CROSS) {
      return false;
    } else {
      // 逐仓强平价格
      liquidationPrice = expectLiquidationPrice(
        contract,
        { openPrice, lev, side: pnlType === LONG_TYPE ? 1 : -1 },
        getDigit(contract.indexPriceTickSize),
      );
    }

    const isError =
      pnlType === LONG_TYPE
        ? lessThanOrEqualTo(formPrice)(liquidationPrice)
        : greaterThanOrEqualTo(formPrice)(liquidationPrice);

    if (isError) {
      return _t(
        pnlType === LONG_TYPE
          ? 'stopClose.loss.liquidationPrice.error1'
          : 'stopClose.loss.liquidationPrice.error-1',
        { liquidationPrice: thousandPointed(liquidationPrice) },
      );
    }
  }

  return false;
};

export default validator;
