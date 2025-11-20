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
import {
  getStore,
  _t,
  getLastPrice,
  getMarkPrice,
  getIndexPrice,
  getSymbolInfo,
  formatNumber,
  getDigit,
  priceTypeToLocaleKey,
  getPositionCalcData,
} from '@/pages/Futures/import';
import { PROFIT_TYPE, LOSS_TYPE } from '../constants';
import { FUTURES } from 'src/trade4.0/meta/const';
import { CROSS, namespace } from '../../../config';
import { emitWarning } from '../components/WarningTips';

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
  const {
    symbol,
    currentQty,
    liquidationPrice: _positionLDQ,
    isTrialFunds,
    marginMode,
  } = get(globalState, `${namespace}.positionItem`) || {};
  const { liquidationPrice: positionLDQ = _positionLDQ } = getPositionCalcData(symbol);
  const liquidationPrice = toNonExponential(isTrialFunds ? _positionLDQ : positionLDQ);
  const lastPrice = getLastPrice(symbol);
  const markPrice = getMarkPrice(symbol);
  const indexPrice = getIndexPrice(symbol);
  const contract = getSymbolInfo({ symbol, tradeType: FUTURES });

  let price;
  let tick;
  let hasLossWarning = false;
  let hasProfitWarning = false;

  if (stopPriceType === 'TP') {
    price = lastPrice;
    tick = contract.tickSize;
  } else {
    price = stopPriceType === 'MP' ? markPrice : indexPrice;
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
    emitWarning(type, 'reset');
    return _t('input.tips.price', { tick: toNonExponential(tick) });
  }

  if (isGreaterThanMaxPrice) {
    emitWarning(type, 'reset');
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

  // 止损
  if (type === LOSS_TYPE) {
    // 多单
    if (currentQty > 0) {
      // 小于等于强平价格
      if (lessThanOrEqualTo(formPrice)(liquidationPrice)) {
        if (marginMode !== CROSS) {
          return _t(`stopClose.loss.liquidationPrice.error1`, {
            liquidationPrice: formatNumber(toNonExponential(liquidationPrice), {
              fixed: getDigit(contract?.indexPriceTickSize),
              pointed: true,
              dropZ: false,
            }),
          });
        } else {
          emitWarning(type, 'warning');
          hasLossWarning = true;
        }
      }
      // 空单
    } else if (currentQty < 0) {
      if (greaterThanOrEqualTo(formPrice)(liquidationPrice)) {
        if (marginMode !== CROSS) {
          return _t(`stopClose.loss.liquidationPrice.error-1`, {
            liquidationPrice: formatNumber(toNonExponential(liquidationPrice), {
              fixed: getDigit(contract?.indexPriceTickSize),
              pointed: true,
              dropZ: false,
            }),
          });
        } else {
          emitWarning(type, 'warning');
          hasLossWarning = true;
        }
      }
    }
  }

  // 止盈
  if (type === PROFIT_TYPE) {
    // 多单
    if (currentQty > 0) {
      // 小于等于强平价格
      if (lessThanOrEqualTo(formPrice)(liquidationPrice)) {
        if (marginMode === CROSS) {
          emitWarning(type, 'warning');
          hasProfitWarning = true;
        }
      }
      // 空单
    } else if (currentQty < 0) {
      if (greaterThanOrEqualTo(formPrice)(liquidationPrice)) {
        if (marginMode === CROSS) {
          emitWarning(type, 'warning');
          hasProfitWarning = true;
        }
      }
    }
  }

  if (!!formPrice && isPriceError) {
    emitWarning(type, 'reset');
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

  // 每次输入都需要reset，检查是否已经设置过warning了
  if (!hasLossWarning && type === LOSS_TYPE) {
    emitWarning(LOSS_TYPE, 'reset');
  }

  // 每次输入都需要reset，检查是否已经设置过warning了
  if (!hasProfitWarning && type === PROFIT_TYPE) {
    emitWarning(PROFIT_TYPE, 'reset');
  }

  // 止损

  return false;
};

export default validator;
