/**
 * Owner: Clyne@kupotech.com
 */
import { useSelector, useDispatch } from 'dva';
import { renderHook } from '@testing-library/react-hooks';
import { getStore } from 'utils/createApp';
import useActiveOrder, {
  ACTIVE_ORDER_ENUM,
  useGetActiveOrders,
  getActiveOrders,
  useInitActiveOrder,
  useActiveOrderListData,
} from '@/hooks/futures/useActiveOrder';
import {
  SYMBOL_FILTER_ENUM,
  futuresPositionNameSpace,
} from 'src/trade4.0/pages/Orders/FuturesOrders/config';
import { useFuturesSymbols, useGetCurrentSymbol, getCurrentSymbol } from '@/hooks/common/useSymbol';

jest.mock('@/hooks/useWorkerSubscribe', () => ({
  useFuturesWorkerSubscribe: jest.fn(),
}));

jest.mock('@/hooks/common/useSymbol', () => ({
  useFuturesSymbols: jest.fn(),
  getCurrentSymbol: jest.fn(),
  useGetCurrentSymbol: jest.fn(),
}));

jest.mock('@emotion/react', () => {
  const origin = jest.requireActual('@emotion/react');
  return {
    ...origin,
    useTheme: () => ({
      currentTheme: 'dark',
    }),
  };
});

jest.mock('src/utils/createApp', () => ({
  getStore: jest.fn().mockReturnValue({
    getState: jest.fn(),
  }),
}));

jest.mock('dva', () => ({
  useDispatch: jest.fn().mockReturnValue(jest.fn()),
  useSelector: jest.fn(),
}));

describe('useGetActiveOrders getActiveOrders', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const tests = [
    {
      desc: '无参数',
      expected: 2,
      mockOrders: [{ id: '1' }, { id: '2' }],
      args: undefined,
    },
    {
      desc: '无参数 无orders',
      expected: 0,
      mockOrders: null,
      args: undefined,
    },
    {
      desc: 'dataType 体验金',
      expected: 1,
      mockOrders: [{ id: '1', isTrialFunds: true }, { id: '2' }],
      args: { dataType: ACTIVE_ORDER_ENUM.TRIAL_FUND },
    },
    {
      desc: 'dataType 自由资金',
      expected: 1,
      mockOrders: [{ id: '1', isTrialFunds: true }, { id: '2' }],
      args: { dataType: ACTIVE_ORDER_ENUM.SELF },
    },
    {
      desc: 'condition 模式',
      expected: 0,
      mockOrders: [{ id: '1', isTrialFunds: true }, { id: '2' }],
      args: { condition: ({ id }) => id === 3 },
    },
  ];

  test.each(tests)(
    'useGetActiveOrders getActiveOrders $desc',
    async ({ expected, mockOrders, args }) => {
      const mockState = {
        [futuresPositionNameSpace]: {
          activeOrders: mockOrders,
        },
      };
      useSelector.mockImplementation((callback) => {
        return callback(mockState);
      });
      getStore().getState.mockReturnValueOnce(mockState);
      const { result } = renderHook(() => useGetActiveOrders(args));
      const ret = getActiveOrders(args);
      expect(result.current.length).toBe(expected);
      expect(ret.length).toBe(expected);
    },
  );
});

describe('useInitActiveOrder', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const tests = [
    {
      desc: '未登录',
      expected: 0,
      mockUser: null,
      mockOpenContract: false,
    },
    {
      desc: '登录但未开通合约',
      expected: 0,
      mockUser: { id: 123 },
      mockOpenContract: false,
    },
    {
      desc: '登录且开通合约',
      expected: 1,
      mockUser: { id: 123 },
      mockOpenContract: true,
    },
  ];

  test.each(tests)('useInitActiveOrder $desc', async ({ expected, mockUser, mockOpenContract }) => {
    const mockState = {
      user: {
        user: mockUser,
      },
      openFutures: { openContract: mockOpenContract },
      symbols: {},
      [futuresPositionNameSpace]: {
        [SYMBOL_FILTER_ENUM.FUTURES_ACTIVE_ORDER]: '',
      },
    };
    const mockDispatch = useDispatch();
    useSelector.mockImplementation((callback) => {
      return callback(mockState);
    });
    renderHook(() => useInitActiveOrder());
    expect(mockDispatch).toHaveBeenCalledTimes(expected);
  });
});

describe('useActiveOrderListData', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const tests = [
    {
      desc: '无symbolFilter',
      expected: 2,
      mockSymbolFilter: false,
      currentSymbol: 'SHIBUSDTM',
    },
    {
      desc: '有symbolFilter',
      expected: 0,
      mockSymbolFilter: true,
      currentSymbol: 'SHIBUSDTM',
    },
  ];

  test.each(tests)(
    'useActiveOrderListData $desc',
    async ({ expected, mockSymbolFilter, currentSymbol }) => {
      const mockState = {
        [futuresPositionNameSpace]: {
          activeOrders: [{ symbol: 'XBTUSDTM' }, { symbol: 'ETHUSDTM' }],
          [SYMBOL_FILTER_ENUM.FUTURES_ACTIVE_ORDER]: mockSymbolFilter,
        },
      };
      useGetCurrentSymbol.mockReturnValue(currentSymbol);
      useSelector.mockImplementation((callback) => {
        return callback(mockState);
      });
      const { result } = renderHook(() => useActiveOrderListData());
      expect(result.current.length).toBe(expected);
    },
  );
});

describe('useActiveOrder', () => {
  it('useActiveOrder UT', () => {
    const mockState = {
      symbols: {
        futuresSymbolsMap: { XBTUSDTM: { symbol: 'XBTUSDTM' } },
      },
      [futuresPositionNameSpace]: {
        cancelAllVisible: false,
      },
      theme: {
        current: 'dark',
      },
    };
    const mockDispatch = useDispatch();
    useSelector.mockImplementation((callback) => {
      return callback(mockState);
    });
    useFuturesSymbols.mockReturnValue(mockState.symbols.futuresSymbolsMap);
    const { result } = renderHook(() => useActiveOrder());
    const {
      handleCancelAllOrders,
      cancelOrder,
      hideCancelConfirm,
      showCancelConfirm,
      setCancelAllVisible,
      contractMap,
      contracts,
    } = result.current;
    expect(contracts.XBTUSDTM).toMatchObject({ symbol: 'XBTUSDTM' });
    expect(contractMap.XBTUSDTM).toMatchObject({ symbol: 'XBTUSDTM' });
    // 全撤单
    hideCancelConfirm();
    setCancelAllVisible(true);
    expect(mockDispatch).toHaveBeenCalledWith({
      type: futuresPositionNameSpace + '/update',
      payload: {
        cancelAllVisible: true,
      },
    });
    // 确认
    showCancelConfirm();
    expect(mockDispatch).toHaveBeenCalledWith({
      type: futuresPositionNameSpace + '/update',
      payload: { cancelAllVisible: true },
    });
    cancelOrder('123', false, {});
    expect(mockDispatch).toHaveBeenCalledWith({
      type: futuresPositionNameSpace + '/cancel',
      payload: {
        orderId: '123',
        order: true,
        isTrialFunds: false,
        sensorType: 'ISOLATED_self',
      },
    });
    handleCancelAllOrders();
    expect(mockDispatch).toHaveBeenCalledWith({
      type: futuresPositionNameSpace + '/cancelAllOrders',
    });
  });
});
