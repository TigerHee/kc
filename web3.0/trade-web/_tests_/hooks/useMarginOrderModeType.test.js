import { renderHook, act } from '@testing-library/react-hooks';

import { useSelector } from 'dva';

import useSide from '@/pages/OrderForm/hooks/useSide';

import { useTradeType, getTradeType } from 'src/trade4.0/hooks/common/useTradeType';

import { getStateFromStore } from '@/utils/stateGetter';

import useMarginOrderModeType, {
  getMarginOrderModeType,
} from 'src/trade4.0/hooks/useMarginOrderModeType.js';

jest.mock('dva', () => ({
  useSelector: jest.fn(),
}));

jest.mock('@/pages/OrderForm/hooks/useSide', () => jest.fn());

jest.mock('src/trade4.0/hooks/common/useTradeType', () => ({
  useTradeType: jest.fn(),

  getTradeType: jest.fn(),
}));

jest.mock('@/utils/stateGetter', () => ({
  getStateFromStore: jest.fn(),
}));

describe('useMarginOrderModeType', () => {
  it('should return correct values', () => {
    useSelector.mockImplementation((selector) =>
      selector({
        tradeForm: {
          marginOrderModeBuy: 'buy',

          marginOrderModeSell: 'sell',

          isolatedOrderModeBuy: 'buy',

          isolatedOrderModeSell: 'sell',
        },
      }),
    );

    useSide.mockReturnValue({ side: 'buy' });

    useTradeType.mockReturnValue('TRADE_TYPE');

    const { result } = renderHook(() => useMarginOrderModeType());

    expect(result.current).toEqual({
      marginOrderModeBuy: 'buy',

      marginOrderModeSell: 'sell',

      isolatedOrderModeBuy: 'buy',

      isolatedOrderModeSell: 'sell',

      currentMarginOrderMode: '',

      currentMarginOrderModeKey: '',
    });
  });
});

describe('getMarginOrderModeType', () => {
  it('should return correct values', () => {
    getStateFromStore.mockImplementation((selector) =>
      selector({
        tradeForm: {
          marginOrderModeBuy: 'buy',

          marginOrderModeSell: 'sell',

          isolatedOrderModeBuy: 'buy',

          isolatedOrderModeSell: 'sell',
        },
      }),
    );

    getTradeType.mockReturnValue('TRADE_TYPE');

    const result = getMarginOrderModeType({ tradeType: 'TRADE_TYPE' });

    expect(result).toEqual({
      marginOrderModeBuy: 'buy',

      marginOrderModeSell: 'sell',

      isolatedOrderModeBuy: 'buy',

      isolatedOrderModeSell: 'sell',

      currentMarginOrderMode: '',

      currentMarginOrderModeKey: '',
    });
  });

  it('test getMarginOrderModeType is margin tradeType should return correct values', () => {
    getStateFromStore.mockImplementation((selector) =>
      selector({
        tradeForm: {
          marginOrderModeBuy: 'buy',
          marginOrderModeSell: 'sell',
          isolatedOrderModeBuy: 'buy',
          isolatedOrderModeSell: 'sell',
        },
      }),
    );

    getTradeType.mockReturnValue('TRADE_TYPE');

    const result = getMarginOrderModeType({ tradeType: 'MARGIN_ISOLATED_TRADE' });

    expect(result).toEqual({
      marginOrderModeBuy: 'buy',
      marginOrderModeSell: 'sell',
      isolatedOrderModeBuy: 'buy',
      isolatedOrderModeSell: 'sell',
      currentMarginOrderMode: 'sell',
      currentMarginOrderModeKey: 'isolatedOrderModeSell',
    });
  });
});
