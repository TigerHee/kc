/**
 * Owner: harry.lai@kupotech.com
 */
import Decimal from 'decimal.js';

import {
  abs,
  closeFeeOperator,
  costOperator,
  decreaseOddsOperator,
  dividedBy,
  forwardStopPercentOperator,
  lessThan,
  lessThanOrEqualTo,
  marginBalanceOperator,
  marketMinDealPriceOperator,
  max,
  min,
  minus,
  multiply,
  negIncreaseOddsOperator,
  openFeeOperator,
  openMarginOperator,
  orderValueOperator,
  percent,
  percentage,
  plus,
  posIncreaseOddsOperator,
  round,
  stopLossLevOperator,
  stopLossTipOperator,
  stopPercentOperator,
  toDP,
  toFixed,
  toNonExponential,
  transformParam,
} from 'utils/operation';

describe('test operation', () => {
  test('test operation', () => {
    expect(transformParam() + '').toBe('0');
    expect(transformParam(NaN) + '').toBe('NaN');
    expect(plus(123)(321) + '').toBe('444');
    expect(minus(333)(222) + '').toBe('111');
    expect(multiply(3)(2) + '').toBe('6');

    expect(min(1, 2, 3, 4, 5, 6) + '').toBe('1');
    expect(max(1, 2, 3, 4, 5, 6) + '').toBe('6');

    expect(lessThan(1)(3)).toBe(true);
    expect(lessThanOrEqualTo(1)(3)).toBe(true);
    expect(dividedBy(1)(0) + '').toBe('0');
    expect(percentage(1) + '').toBe('100');
    expect(round(1.23) + '').toBe('1');
    expect(abs(123) + '').toBe('123');

    expect(toFixed(4)(5) + '').toBe('4.00000');
    expect(toFixed(4)(null, 2) + '').toBe('4');

    expect(toNonExponential(4) + '').toBe('4');
    expect(toNonExponential('2e-4') + '').toBe('0.0002');
    expect(toNonExponential(new Decimal(123)) + '').toBe('123');

    expect(percent(4)(2) + '').toBe('2');
    expect(percent(4)(2, true) + '').toBe('200');

    expect(posIncreaseOddsOperator(4, 222)).toBe(true);
    expect(negIncreaseOddsOperator(433, 222)).toBe(false);
    expect(decreaseOddsOperator(4, 222)).toBe(false);

    expect(toDP(4)(2) + '').toBe('4');
    expect(toDP(4)(null) + '').toBe('4');
    expect(openFeeOperator(1, 2, 0.002, 0.006).toString()).toBe('0.007');
    expect(closeFeeOperator(1, 2, 0.002, 0.006, 5).toString()).toBe('0.0072');

    expect(marketMinDealPriceOperator(1, 1).toString()).toBe('0');
    expect(orderValueOperator(1, 2, 1).toString()).toBe('0.5');
    expect(stopLossLevOperator({posCost: 1, posInit: 2}).toString()).toBe(
      '0.5',
    );
    expect(
      stopPercentOperator({
        stopPrice: 1,
        posCost: 0.2,
        posMargin: 2,
        posMaint: 3,
        currentQty: -1,
        multiplier: 0.01,
      }).toString(),
    ).toBe('21');
  });
  test('111', () => {
    expect(
      forwardStopPercentOperator({
        stopPrice: 1,
        posCost: 0.2,
        posMargin: 2,
        posMaint: 3,
        currentQty: -1,
        multiplier: 0.01,
      }).toString(),
    ).toBe('21');
  });

  test('stopLossTipOperator', () => {
    expect(stopLossTipOperator({stopPercent: 1, lev: 20}).toString()).toBe(
      '4.95',
    );
  });

  test('openMarginOperator', () => {
    expect(openMarginOperator(2, 1, 2).toString()).toBe('1');
  });

  test('marginBalanceOperator', () => {
    expect(marginBalanceOperator(1, 1, 1, 1).toString()).toBe('4');
  });
  test('costOperator', () => {
    expect(costOperator(1, 2, 3).toString()).toBe('6');
  });
});
