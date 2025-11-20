/**
 * Owner: garuda@kupotech.com
 */
import { get } from 'lodash';
import Decimal from 'decimal.js';
import {
  greaterThan,
  greaterThanOrEqualTo,
  lessThanOrEqualTo,
  toNonExponential,
} from 'utils/operation';
import { getStore } from 'utils/createApp';
import { FUTURES } from '@/meta/const';
import { getIndexPrice, getMarkPrice } from '@/hooks/futures/useMarket';
import { _t } from 'utils/lang';
import { getDigit } from 'src/helper';
import { formatNumber } from '@/utils/futures';
import { getSymbolInfo } from '@/hooks/common/useSymbol';
import { priceTypeToLocaleKey, PROFIT_TYPE, LOSS_TYPE } from '../constants';

const priceValidator = (value, tick) => {
  const numberReg = /^\d+(\.\d+)?$/;
  let valid = true;
  valid = numberReg.test(value);
  if (valid) {
    valid = Decimal(value).mod(tick).eq(0);
  }
  return valid;
};

const validator = (formPrice, stopPriceType, type) => {
  const globalState = getStore().getState();
  const marketList = get(globalState, 'futuresMarket.sortedMarkets') || [];
  const {
    symbol,
    currentQty,
    liquidationPrice: positionLDQ,
  } = get(globalState, 'futures_orders.positionItem') || {};
  const contract = getSymbolInfo({ symbol, tradeType: FUTURES });

  const liquidationPrice = positionLDQ;

  let price;
  let tick;

  if (stopPriceType === 'TP') {
    const { lastPrice } = marketList.find((item) => item.symbol === symbol) || { lastPrice: 0 };
    price = lastPrice;
    tick = contract.tickSize;
  } else if (stopPriceType === 'IP') {
    price = getIndexPrice(symbol);
    tick = contract.indexPriceTickSize;
  } else if (stopPriceType === 'MP') {
    price = getMarkPrice(symbol);
    tick = contract.indexPriceTickSize;
  }

  const { maxPrice } = contract;

  if (price) {
    price = toNonExponential(price);
  }

  const isGreaterThanMaxPrice = greaterThan(formPrice)(maxPrice);

  const isShort = currentQty < 0;

  let isPriceError = isShort
    ? lessThanOrEqualTo(formPrice)(price)
    : greaterThanOrEqualTo(formPrice)(price);

  if (type === PROFIT_TYPE) {
    isPriceError = isShort
      ? greaterThanOrEqualTo(formPrice)(price)
      : lessThanOrEqualTo(formPrice)(price);
  }

  if (formPrice && !priceValidator(formPrice, tick)) {
    return _t('input.tips.price', { tick: toNonExponential(tick) });
  }

  if (isGreaterThanMaxPrice) {
    return _t('contract.price.check', {
      price: formatNumber(toNonExponential(maxPrice), {
        fixed: getDigit(tick),
        pointed: true,
        dropZ: false,
      }),
    });
  }

  let sideText = isShort ? _t('stopClose.lower') : _t('stopClose.higher');

  if (type === PROFIT_TYPE) {
    sideText = isShort ? _t('stopClose.higher') : _t('stopClose.lower');
  }

  if (type === LOSS_TYPE) {
    // 多单
    if (currentQty > 0) {
      // 小于等于强平价格
      if (lessThanOrEqualTo(formPrice)(liquidationPrice)) {
        return _t(`stopClose.loss.liquidationPrice.error1`, {
          liquidationPrice: formatNumber(toNonExponential(positionLDQ), {
            fixed: getDigit(contract?.indexPriceTickSize),
            pointed: true,
            dropZ: false,
          }),
        });
      }
      // 空单
    } else if (currentQty < 0 && greaterThanOrEqualTo(formPrice)(liquidationPrice)) {
      return _t(`stopClose.loss.liquidationPrice.error-1`, {
        liquidationPrice: formatNumber(toNonExponential(positionLDQ), {
          fixed: getDigit(contract?.indexPriceTickSize),
          pointed: true,
          dropZ: false,
        }),
      });
    }
  }

  if (!!formPrice && isPriceError) {
    return _t(`stopClose.${type}.error`, {
      side: sideText,
      price: formatNumber(toNonExponential(price), {
        fixed: getDigit(tick),
        pointed: true,
        dropZ: false,
      }),
      type: _t(priceTypeToLocaleKey[stopPriceType]),
    });
  }

  // 止损

  return false;
};

export default validator;
