/**
 * Owner: garuda@kupotech.com
 */

import { useSelector, useDispatch } from 'dva';

import {
  useUserFee,
  getUserFee,
  useGetUserOpenFutures,
  getUserOpenFutures,
  useGetUserFuturesPermissions,
  getUserFuturesPermissions,
  useRiskLimit,
  useGetRiskLimit,
  useOperatorRiskLimit,
  getRiskLimit,
  useGetLocalSetting,
  useSetLocalSetting,
  useUserMaxLeverage,
  getUserMaxLeverage,
} from '@/hooks/futures/useGetUserFuturesInfo';
import { getState } from 'helper';
import { getStore } from 'src/utils/createApp';
import { isSpotTypeSymbol } from '@/hooks/common/useIsSpotSymbol';

import { renderHook, act } from '@testing-library/react-hooks';

jest.mock('dva', () => ({
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
}));

jest.mock('src/utils/createApp', () => ({
  getStore: jest.fn(),
}));

jest.mock('helper', () => ({
  getState: jest.fn(),
}));

jest.mock('@/hooks/common/useIsSpotSymbol', () => ({
  isSpotTypeSymbol: jest.fn(),
}));

describe('useUserFee', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return takerFeeRate and fixTakerFee from state', () => {
    const mockState = { futuresCommon: { takerFeeRate: 0.01, fixTakerFee: 0.02 } };

    useSelector.mockImplementation((callback) => callback(mockState));

    const { result } = renderHook(() => useUserFee());

    expect(result.current).toEqual({ takerFeeRate: 0.01, fixTakerFee: 0.02 });
  });

  it('should return default values if state is empty', () => {
    useSelector.mockImplementation((callback) => callback({ futuresCommon: {} }));

    const { result } = renderHook(() => useUserFee());

    expect(result.current).toEqual({ takerFeeRate: undefined, fixTakerFee: undefined });
  });
});

describe('getUserFee', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return takerFeeRate and fixTakerFee from global state', () => {
    const mockState = { futuresCommon: { takerFeeRate: 0.01, fixTakerFee: 0.02 } };

    const mockStore = { getState: jest.fn().mockReturnValue(mockState) };

    getStore.mockReturnValue(mockStore);

    const result = getUserFee();

    expect(result).toEqual({ takerFeeRate: 0.01, fixTakerFee: 0.02 });
  });

  it('should return default values if state is empty', () => {
    const mockState = {};

    const mockStore = { getState: jest.fn().mockReturnValue(mockState) };

    getStore.mockReturnValue(mockStore);

    const result = getUserFee();

    expect(result).toEqual({ takerFeeRate: undefined, fixTakerFee: undefined });
  });
});

describe('useGetUserOpenFutures', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return openContract from state', () => {
    const mockState = { openFutures: { openContract: true } };

    useSelector.mockImplementation((callback) => callback(mockState));

    const { result } = renderHook(() => useGetUserOpenFutures());

    expect(result.current).toBe(true);
  });

  it('should return undefined if openContract is not present in state', () => {
    useSelector.mockImplementation((callback) => callback({ openFutures: {} }));

    const { result } = renderHook(() => useGetUserOpenFutures());

    expect(result.current).toBeUndefined();
  });
});

describe('getUserOpenFutures', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return openContract from global state', () => {
    const mockState = { openFutures: { openContract: true } };

    const mockStore = { getState: jest.fn().mockReturnValue(mockState) };

    getStore.mockReturnValue(mockStore);

    const result = getUserOpenFutures();

    expect(result).toBe(true);
  });

  it('should return undefined if openContract is not present in global state', () => {
    const mockState = {};

    const mockStore = { getState: jest.fn().mockReturnValue(mockState) };

    getStore.mockReturnValue(mockStore);

    const result = getUserOpenFutures();

    expect(result).toBeUndefined();
  });
});

describe('useGetUserFuturesPermissions', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return true if type is included in settings', () => {
    const mockState = {
      futuresSetting: {
        webNoticeConfig: ['type1'],
        confirmConfig: ['type2'],
      },
    };

    useSelector.mockImplementation((callback) => callback(mockState));

    const { result } = renderHook(() => useGetUserFuturesPermissions({ type: 'type1' }));

    expect(result.current).toBe(true);
  });

  it('should return false if type is not included in settings', () => {
    const mockState = {
      futuresSetting: {
        webNoticeConfig: ['type1'],
        confirmConfig: ['type2'],
      },
    };

    useSelector.mockImplementation((callback) => callback(mockState));

    const { result } = renderHook(() => useGetUserFuturesPermissions({ type: 'type3' }));

    expect(result.current).toBe(false);
  });

  it('should return false if type is not included in settings when settings is empty', () => {
    const mockState = {
      futuresSetting: {},
    };

    useSelector.mockImplementation((callback) => callback(mockState));

    const { result } = renderHook(() => useGetUserFuturesPermissions({ type: 'type3' }));

    expect(result.current).toBe(false);
  });
});

describe('getUserFuturesPermissions', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return true if type is included in settings', () => {
    const mockState = {
      futuresSetting: {
        webNoticeConfig: ['type1'],
        confirmConfig: ['type2'],
      },
    };

    const mockStore = { getState: jest.fn().mockReturnValue(mockState) };

    getStore.mockReturnValue(mockStore);

    const result = getUserFuturesPermissions({ type: 'type1' });

    expect(result).toBe(true);
  });

  it('should return false if type is not included in settings', () => {
    const mockState = {
      futuresSetting: {
        webNoticeConfig: ['type1'],
        confirmConfig: ['type2'],
      },
    };

    const mockStore = { getState: jest.fn().mockReturnValue(mockState) };

    getStore.mockReturnValue(mockStore);

    const result = getUserFuturesPermissions({ type: 'type3' });

    expect(result).toBe(false);
  });

  it('should return false if type is not included in settings when settings is empty', () => {
    const mockState = {
      futuresSetting: {},
    };

    useSelector.mockImplementation((callback) => callback(mockState));

    const { result } = renderHook(() => useGetUserFuturesPermissions({ type: 'type3' }));

    expect(result.current).toBe(false);
  });
});

describe('useGetLocalSetting', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return takerFeeRate and fixTakerFee from state', () => {
    const mockState = { futuresSetting: { retentionData: false, confirmModal: true } };

    useSelector.mockImplementation((callback) => callback(mockState));

    const { result } = renderHook(() => useGetLocalSetting());

    expect(result.current).toEqual({ retentionData: false, confirmModal: true });
  });
});

describe('useSetLocalSetting', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should dispatch actions to get risk limits', () => {
    const dispatch = jest.fn();

    useDispatch.mockReturnValue(dispatch);

    const { result } = renderHook(() => useSetLocalSetting());

    act(() => {
      result.current('confirm', false);
    });

    expect(dispatch).toHaveBeenCalledWith({
      type: 'futuresSetting/updateLocalSetting',
      payload: {
        type: 'confirm',
        status: false,
      },
    });
  });
});

describe('useRiskLimit', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return userRiskLimit and riskLimits from state', () => {
    const mockState = { futuresSetting: { userRiskLimit: { limit: 100 }, riskLimits: [1, 2, 3] } };

    useSelector.mockImplementation((callback) => callback(mockState));

    const { result } = renderHook(() => useRiskLimit());

    expect(result.current).toEqual({ userRiskLimit: { limit: 100 }, riskLimits: [1, 2, 3] });
  });

  it('should return default values if state is empty', () => {
    useSelector.mockImplementation((callback) => callback({ futuresSetting: {} }));

    const { result } = renderHook(() => useRiskLimit());

    expect(result.current).toEqual({ userRiskLimit: {}, riskLimits: [] });
  });
});

describe('useGetRiskLimit', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should dispatch actions to get risk limits', () => {
    const dispatch = jest.fn();

    useDispatch.mockReturnValue(dispatch);
    isSpotTypeSymbol.mockReturnValue(false);

    const { result } = renderHook(() => useGetRiskLimit());

    act(() => {
      result.current('BTC');
    });

    expect(dispatch).toHaveBeenCalledWith({
      type: 'futuresSetting/getUserRiskLimit',

      payload: { symbol: 'BTC' },
    });

    expect(dispatch).toHaveBeenCalledWith({
      type: 'futuresSetting/getRiskLimits',

      payload: 'BTC',
    });
  });
});

describe('useOperatorRiskLimit', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should dispatch action to change risk limit', async () => {
    const dispatch = jest.fn().mockResolvedValue('success');

    useDispatch.mockReturnValue(dispatch);

    const { result } = renderHook(() => useOperatorRiskLimit());

    let response;

    await act(async () => {
      response = await result.current({ level: 1, symbol: 'BTC', bizNo: '123' });
    });

    expect(dispatch).toHaveBeenCalledWith({
      type: 'futuresSetting/postChangeRiskLimit',

      payload: { level: 1, symbol: 'BTC', bizNo: '123' },
    });

    expect(response).toBe('success');
  });
});

describe('getRiskLimit', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return userRiskLimit and riskLimits from state', () => {
    const mockState = {
      futuresSetting: {
        userRiskLimit: { limit: 100 },
        riskLimits: [1, 2, 3],
      },
    };

    getState.mockImplementation((callback) => callback(mockState));

    const result = getRiskLimit();

    expect(result).toEqual({
      userRiskLimit: { limit: 100 },

      riskLimits: [1, 2, 3],
    });
  });

  it('should return default values if state is empty', () => {
    getState.mockImplementation(() => null);

    const result = getRiskLimit();

    expect(result).toEqual({
      userRiskLimit: {},

      riskLimits: [],
    });
  });
});

describe('useUserMaxLeverage', () => {
  beforeEach(() => {
    const mockState = {
      futuresCommon: {
        userMaxLeverage: 10,
        trialFundUserMaxLeverage: 5,
      },
    };

    useSelector.mockImplementation((callback) => callback(mockState));
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return trialFund maxLeverage', () => {
    const { result } = renderHook(() => useUserMaxLeverage(true));

    expect(result.current).toBe(5);
  });

  it('should return default maxLeverage', () => {
    const { result } = renderHook(() => useUserMaxLeverage());

    expect(result.current).toBe(10);
  });
});

describe('getUserMaxLeverage', () => {
  beforeEach(() => {
    const mockState = {
      futuresCommon: {
        userMaxLeverage: 10,
        trialFundUserMaxLeverage: 5,
      },
    };

    const mockStore = { getState: jest.fn().mockReturnValue(mockState) };
    getStore.mockReturnValue(mockStore);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return trialFund maxLeverage', () => {
    const result = getUserMaxLeverage(true);

    expect(result).toBe(5);
  });

  it('should return default maxLeverage', () => {
    const result = getUserMaxLeverage();

    expect(result).toBe(10);
  });
});
