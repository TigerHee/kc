import {
  doubleValidateFields,
  limitPriceValidator,
} from '@/pages/OrderForm/components/TradeForm/formModules/utils/timeWeightedUtils.js';

jest.mock('src/utils/lang', () => ({
  _t: jest.fn((key) => key),
}));

jest.mock('dva', () => ({
  useSelector: jest.fn(),
}));

jest.mock('@/utils/stateGetter', () => ({
  getStateFromStore: jest.fn(),
}));

describe('doubleValidateFields', () => {
  // 设置一些共用的测试数据
  const lastPriceVal = 100; // 假设的最新价格
  const timeWeightedOrderConfig = {
    buyPriceLimitMinPercent: 0.2,
    sellPriceLimitMaxPercent: 0.2,
  };

  it('should fail validation if the time duration is too short', () => {
    const values = {
      totalAmount: 100,
      singleAmount: 10,
      durationHour: 0,
      durationMinute: 0,
      limitPrice: 120,
    };
    const result = doubleValidateFields({
      values,
      side: 'buy',
      lastPriceVal,
      timeWeightedOrderConfig,
    });
    expect(result.result).toBe(false);
    expect(result.contentText).toEqual(expect.arrayContaining(['5dc9s4Eyk14ZDnXvVpihFz']));
  });

  it('should fail validation if the buy limit price is too low', () => {
    const values = {
      totalAmount: 100,
      singleAmount: 10,
      durationHour: 1,
      durationMinute: 0,
      limitPrice: 80,
    };
    const result = doubleValidateFields({
      values,
      side: 'buy',
      lastPriceVal,
      timeWeightedOrderConfig,
    });
    expect(result.result).toBe(true);
    expect(result.contentText).toEqual(expect.arrayContaining([]));
  });

  it('should fail validation if the sell limit price is too high', () => {
    const values = {
      totalAmount: 100,
      singleAmount: 10,
      durationHour: 1,
      durationMinute: 0,
      limitPrice: 130,
    };
    const result = doubleValidateFields({
      values,
      side: 'sell',
      lastPriceVal,
      timeWeightedOrderConfig,
    });
    expect(result.result).toBe(true);
    expect(result.contentText).toEqual(expect.arrayContaining([]));
  });

  it('should pass validation if all conditions are met', () => {
    const values = {
      totalAmount: 100,
      singleAmount: 10,
      durationHour: 1,
      durationMinute: 0,
      limitPrice: 120,
    };
    const result = doubleValidateFields({
      values,
      side: 'buy',
      lastPriceVal,
      timeWeightedOrderConfig,
    });
    expect(result.result).toBe(true);
    expect(result.contentText).toHaveLength(0);
  });
});

describe('doubleValidateFields', () => {
  const timeWeightedOrderConfig = {
    buyPriceLimitMinPercent: 0.2,

    sellPriceLimitMaxPercent: 0.2,
  };

  test('should return error when side is buy and limit price is too high', () => {
    const values = {
      totalAmount: 100,

      singleAmount: 10,

      durationHour: 1,

      durationMinute: 0,

      limitPrice: 2,
    };

    const result = doubleValidateFields({
      values,

      side: 'buy',

      lastPriceVal: 1,

      timeWeightedOrderConfig,
    });

    expect(result.result).toBe(false);

    //expect(result.contentText).toContain('rQzDQx3fNyKHsUYYT3HTQn');
    expect(result.contentText).toEqual(expect.arrayContaining(['rQzDQx3fNyKHsUYYT3HTQn']));
  });

  test('should return error when side is sell and limit price is too low', () => {
    const values = {
      totalAmount: 100,

      singleAmount: 10,

      durationHour: 1,

      durationMinute: 0,

      limitPrice: 0.1,
    };

    const result = doubleValidateFields({
      values,

      side: 'sell',

      lastPriceVal: 1,

      timeWeightedOrderConfig,
    });

    expect(result.result).toBe(false);

    //expect(result.contentText).toContain('7doMa1ei54UKzPgow9tAoF');

    expect(result.contentText).toEqual(expect.arrayContaining(['7doMa1ei54UKzPgow9tAoF']));
  });

  test('should return error when time duration is too short', () => {
    const values = {
      totalAmount: 100,

      singleAmount: 10,

      durationHour: 0,

      durationMinute: 0,

      limitPrice: 1,
    };

    const result = doubleValidateFields({
      values,

      side: 'buy',

      lastPriceVal: 1,

      timeWeightedOrderConfig,
    });

    expect(result.result).toBe(false);

    //expect(result.contentText).toContain('5dc9s4Eyk14ZDnXvVpihFz');
    expect(result.contentText).toEqual(expect.arrayContaining(['5dc9s4Eyk14ZDnXvVpihFz']));
  });

  test('should return true when all validations pass', () => {
    const values = {
      totalAmount: 100,

      singleAmount: 10,

      durationHour: 1,

      durationMinute: 0,

      limitPrice: 1,
    };

    const result = doubleValidateFields({
      values,

      side: 'buy',

      lastPriceVal: 1,

      timeWeightedOrderConfig,
    });

    expect(result.result).toBe(true);

    expect(result.contentText).toEqual([]);
  });
});

describe('limitPriceValidator', () => {
  const lastPriceVal = 100;

  const timeWeightedOrderConfig = {
    buyPriceLimitMinPercent: 0.2,
    sellPriceLimitMaxPercent: 0.2,
  };

  it('should resolve for empty value', async () => {
    const result = limitPriceValidator({
      value: '',

      lastPriceVal,

      isBuy: true,

      timeWeightedOrderConfig,
    });

    await expect(result).resolves.toBeUndefined();
  });

  it('should reject for buy order with price less than limit', async () => {
    const result = limitPriceValidator({
      value: '10',

      lastPriceVal,

      isBuy: true,

      timeWeightedOrderConfig,
    });

    await expect(result).rejects.toBe('mPwnEjB8aKSPQRnSbAXQpN');
  });

  it('should resolve for buy order with price equal to limit', async () => {
    const result = limitPriceValidator({
      value: '20',

      lastPriceVal,

      isBuy: true,

      timeWeightedOrderConfig,
    });

    await expect(result).rejects.toBe('mPwnEjB8aKSPQRnSbAXQpN');
  });

  it('should reject for sell order with price greater than limit', async () => {
    const result = limitPriceValidator({
      value: '130',

      lastPriceVal,

      isBuy: false,

      timeWeightedOrderConfig,
    });

    await expect(result).rejects.toBe('rPU2rijq7zM8Gdw1qXXvWh');
  });

  it('should resolve for sell order with price equal to limit', async () => {
    const result = limitPriceValidator({
      value: '120',

      lastPriceVal,

      isBuy: false,

      timeWeightedOrderConfig,
    });

    await expect(result).resolves.toBeUndefined();
  });
});
