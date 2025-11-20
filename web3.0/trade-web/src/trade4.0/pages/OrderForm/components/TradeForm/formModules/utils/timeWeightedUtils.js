/*
 * @Owner: gannicus.zhou@kupotech.com
 * @Date: 2024-04-24 18:04:17
 * @LastEditors: gannicus Gannicus.Zhou@kupotech.com
 * @LastEditTime: 2024-05-13 22:20:39
 * @FilePath: /trade-web/src/trade4.0/pages/OrderForm/components/TradeForm/formModules/utils/timeWeightedUtils.js
 * @Description:
 */
import { _t, _tHTML } from 'src/utils/lang';
import { divide, multiply, add, sub } from 'src/helper';
import { greaterThan, lessThan } from 'src/utils/operation';

// 二次校验，弹窗弹框警告，而不是表单拦截
export const doubleValidateFields = ({ values, side, lastPriceVal, timeWeightedOrderConfig }) => {
  const { totalAmount, singleAmount, durationHour = 0, durationMinute = 0, limitPrice } = values;
  const {
    buyPriceLimitMinPercent = 0.2, // 买入时 PriceLimit 价格不能低于指定的市场价格的百分比,
    sellPriceLimitMaxPercent = 0.2, // 卖出时 PriceLimit 价格不能高于指定的市场价格的百分比,
  } = timeWeightedOrderConfig;

  const resultDurationSec = add(multiply(durationHour, 3600), multiply(durationMinute, 60));
  values.durationSec = resultDurationSec;
  // 1.Validate timeDuration
  const isTimeValidatedError = lessThan(
    divide(resultDurationSec, divide(totalAmount, singleAmount)),
  )(10);

  // 2.Validate limitPrice
  if (
    side === 'buy' &&
    greaterThan(divide(limitPrice, lastPriceVal))(add(buyPriceLimitMinPercent, 1))
  ) {
    return {
      result: false,
      contentText: [
        ...[isTimeValidatedError ? _t('5dc9s4Eyk14ZDnXvVpihFz') : []],
        _t('rQzDQx3fNyKHsUYYT3HTQn'),
      ],
    };
  }
  if (
    side === 'sell' &&
    lessThan(divide(limitPrice, lastPriceVal))(sub(1, sellPriceLimitMaxPercent))
  ) {
    return {
      result: false,
      contentText: [
        ...[isTimeValidatedError ? _t('5dc9s4Eyk14ZDnXvVpihFz') : []],
        _t('7doMa1ei54UKzPgow9tAoF'),
      ],
    };
  }

  // 如果limitPrice校验通过，需要把timeDuration 检验return
  if (isTimeValidatedError) {
    return {
      result: false,
      contentText: isTimeValidatedError ? [_t('5dc9s4Eyk14ZDnXvVpihFz')] : [],
    };
  }

  return {
    result: true,
    contentText: [],
  };
};

export const limitPriceValidator = ({
  value,
  lastPriceVal,
  isBuy,
  timeWeightedOrderConfig = {},
}) => {
  const {
    buyPriceLimitMinPercent = 0.2, // 买入时 PriceLimit 价格不能低于指定的市场价格的百分比,
    sellPriceLimitMaxPercent = 0.2, // 卖出时 PriceLimit 价格不能高于指定的市场价格的百分比,
  } = timeWeightedOrderConfig;
  const _val = +value;
  if (_val) {
    if (isBuy && lessThan(divide(_val, lastPriceVal))(sub(1, buyPriceLimitMinPercent))) {
      return Promise.reject(_t('mPwnEjB8aKSPQRnSbAXQpN'));
    }
    if (!isBuy && greaterThan(divide(_val, lastPriceVal))(add(sellPriceLimitMaxPercent, 1))) {
      return Promise.reject(_t('rPU2rijq7zM8Gdw1qXXvWh'));
    }
  }
  return Promise.resolve();
};
