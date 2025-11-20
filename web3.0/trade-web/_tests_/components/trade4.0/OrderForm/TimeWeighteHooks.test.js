import { singleAmountValidator } from '@/pages/OrderForm/components/TradeForm/hooks/useSingleAmountInput.js';
import { rangeValidator } from '@/pages/OrderForm/components/TradeForm/hooks/usePriceVarInput.js';
import { totalAmountValidator } from '@/pages/OrderForm/components/TradeForm/hooks/useTotalAmountInput.js';
import { isMinStep, formatNumber, floadToPercent } from '@/utils/format';
import { getStateFromStore } from '@/utils/stateGetter';
import { useSelector, connect } from 'dva';
import { getPair } from '@/hooks/common/usePair';
import { getSymbolConfig } from '@/hooks/common/useSymbol';
import { getTradeType } from '@/hooks/common/useTradeType';
import DropdownSelect from '@/components/DropdownSelect';

import useAmountConfig, {
  getAmountConfig,
} from '@/pages/OrderForm/components/TradeForm/hooks/useAmountConfig.js';

jest.mock('src/utils/lang', () => ({
  _t: jest.fn((key) => key),
}));

jest.mock('dva', () => ({
  useSelector: jest.fn(),
  connect: jest.fn(),
}));

jest.mock('@/components/DropdownSelect', () => () => 'DropdownSelect');

jest.mock('@/utils/stateGetter', () => ({
  getStateFromStore: jest.fn(),
}));

jest.mock('@/utils/format', () => ({
  getAmountConfig: jest.fn(),

  getStateFromStore: jest.fn(),

  _t: jest.fn(),

  isMinStep: jest.fn(),

  multiply: jest.fn(),

  formatNumber: jest.fn(),

  floadToPercent: jest.fn(),
}));

jest.mock('@/hooks/common/usePair', () => ({
  getPair: jest.fn(),
}));
jest.mock('@/hooks/common/useSymbol', () => ({
  getSymbolConfig: jest.fn(),
}));
jest.mock('@/hooks/common/useTradeType', () => ({
  getTradeType: jest.fn(),
}));

jest.mock('@/pages/OrderForm/components/TradeForm/hooks/useAmountConfig.js', () => ({
  getAmountConfig: jest.fn(),
}));

describe('singleAmountValidator', () => {
  beforeEach(() => {
    getStateFromStore.mockImplementation((callback) =>
      callback({
        user: {
          isLogin: true,
        },
        symbols: {
          unitDict: {},
        },
      }),
    );
    getPair.mockReturnValue({ baseInfo: {}, quoteInfo: {} });
    getSymbolConfig.mockReturnValue({ quoteMinSize: 0 });
    getTradeType.mockReturnValue('tradeType');
    getAmountConfig.mockReturnValue({ amountMin: 0, amountMax: 10, amountIncrement: 1 });
  });

  it('should resolve if value is nil', async () => {
    const result = await singleAmountValidator({ value: null });

    expect(result).toBeUndefined();
  });

  it('should resolve if not logged in', async () => {
    getStateFromStore.mockImplementationOnce((callback) =>
      callback({
        user: {
          isLogin: false,
        },
        symbols: {
          unitDict: {},
        },
      }),
    );
    const result = await singleAmountValidator({ value: 10 });
    expect(result).toBeUndefined();
  });

  it('should reject when value does not meet minimum step', async () => {
    getAmountConfig.mockReturnValueOnce({ amountIncrement: 2 });

    const result = singleAmountValidator({ value: 1, side: 'buy' });
    console.log(result);
    await expect(result).rejects.toBe('trd.form.step.amount.mode.err');
  });

  it('should reject when value is less than minimum', async () => {
    getAmountConfig.mockReturnValueOnce({ amountMin: 10 });
    isMinStep.mockReturnValueOnce(true);
    const result = singleAmountValidator({ value: 5, side: 'buy' });
    console.log(result);
    await expect(result).rejects.toBe('trd.form.amount.min');
  });

  it('should reject when value is greaterThanOrEqualTo, has totalAmount', async () => {
    getAmountConfig.mockReturnValueOnce({ amountMin: 10 });
    isMinStep.mockReturnValueOnce(true);
    const values = {
      totalAmount: 100,
      limitPrice: 130,
      value: 26,
      side: 'buy',
    };
    const result = singleAmountValidator({ ...values });
    console.log(result);
    await expect(result).rejects.toBe('1yMJRhiqXpBTH7c7vb4veK');
  });

  it('should reject when value is greaterThanOrEqualTo,has no totalAmount', async () => {
    getAmountConfig.mockReturnValueOnce({ amountMin: 10 });
    isMinStep.mockReturnValueOnce(true);
    const values = {
      limitPrice: 130,
      value: 20,
      side: 'buy',
    };
    const result = singleAmountValidator({ ...values });
    console.log(result);
    await expect(result).rejects.toBe('as3zot2a6WB8dZ4myxgizz');
  });
});

describe('rangeValidator', () => {
  it('should return error when value is less than min or greater than max for FIXED distance type', async () => {
    const params = {
      value: 0.00005,

      lastPriceVal: 1,

      distanceTypeState: 'FIXED',

      currency: 'USDT',

      timeWeightedOrderConfig: {},

      pricePrecision: 4,
    };

    let error = await rangeValidator(params).catch((e) => e);

    expect(error).toEqual('nCdJAeLANHDjFgFLzeBwjC');

    params.value = 0.06;

    error = await rangeValidator(params).catch((e) => e);

    expect(error).toEqual('nCdJAeLANHDjFgFLzeBwjC');
  });

  it('should return error when value is less than min or greater than max for PERCENT distance type', async () => {
    const params = {
      value: 0.005,

      lastPriceVal: 1,

      distanceTypeState: 'PERCENT',

      currency: 'USDT',

      timeWeightedOrderConfig: {},

      pricePrecision: 4,
    };

    let error = await rangeValidator(params).catch((e) => e);

    expect(error).toEqual('nCdJAeLANHDjFgFLzeBwjC');

    params.value = 5.5;

    error = await rangeValidator(params).catch((e) => e);

    expect(error).toEqual('nCdJAeLANHDjFgFLzeBwjC');
  });

  it('should return no error when value is within the range for both FIXED and PERCENT distance types', async () => {
    let params = {
      value: 0.0002,

      lastPriceVal: 1,

      distanceTypeState: 'FIXED',

      currency: 'USDT',

      timeWeightedOrderConfig: {},

      pricePrecision: 4,
    };

    let error = await rangeValidator(params).catch((e) => e);

    expect(error).toBeUndefined();

    params = {
      value: 2,

      lastPriceVal: 1,

      distanceTypeState: 'PERCENT',

      currency: 'USDT',

      timeWeightedOrderConfig: {},

      pricePrecision: 4,
    };

    error = await rangeValidator(params).catch((e) => e);

    expect(error).toBeUndefined();
  });
});

describe('totalAmountValidator', () => {
  beforeEach(() => {
    getStateFromStore.mockImplementation((callback) =>
      callback({
        user: {
          isLogin: true,
        },
        symbols: {
          unitDict: {},
        },
      }),
    );
    getPair.mockReturnValue({ baseInfo: { currency: 'BTC' }, quoteInfo: { currency: 'BTC' } });
    getSymbolConfig.mockReturnValue({ quoteMinSize: 0 });
    getTradeType.mockReturnValue('tradeType');
    getAmountConfig.mockReturnValue({ amountMin: 0, amountMax: 10, amountIncrement: 1 });
  });
  it('should return error when value is less than min for orderSizeMinUSD', async () => {
    const params = {
      side: 'buy',

      value: 400,

      isLogin: true,

      timeWeightedOrderConfig: { orderSizeMinUSD: 500 },

      pricesUSD: { BTC: 1 },
    };

    let error = await totalAmountValidator(params).catch((e) => e);

    expect(error).toEqual('trd.form.step.amount.mode.err');
  });

  it('should return error when value is not a min step', async () => {
    const params = {
      side: 'buy',

      value: 600,

      isLogin: true,

      timeWeightedOrderConfig: { orderSizeMinUSD: 500 },

      pricesUSD: { BTC: 1 },
    };

    isMinStep.mockReturnValue(false);
    let error = await totalAmountValidator(params).catch((e) => e);

    expect(error).toEqual('trd.form.step.amount.mode.err');
  });

  it('should return error when value is greater than max', async () => {
    const params = {
      side: 'buy',

      value: 600,

      isLogin: true,

      timeWeightedOrderConfig: { orderSizeMinUSD: 500 },

      pricesUSD: { BTC: 1 },
    };
    isMinStep.mockReturnValue(true);
    getAmountConfig.mockReturnValue({ amountMax: 500 });
    let error = await totalAmountValidator(params).catch((e) => e);

    expect(error).toEqual('trd.form.amount.max');
  });
});
