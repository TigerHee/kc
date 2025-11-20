/**
 * Owner: garuda@kupotech.com
 */

import { useSelector } from 'react-redux';

import { get } from 'lodash';

import { useWalletList, getWalletList } from '@/hooks/futures/useWallet';
import { getStore } from 'utils/createApp'

import { renderHook } from '@testing-library/react-hooks';

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
}));

jest.mock('lodash', () => ({
  get: jest.fn(),
}));

jest.mock('utils/createApp', () => ({
  getStore: jest.fn(),
}));

describe('useWalletList', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return wallet list from state', () => {
    const mockWalletList = [{ id: 1, name: 'BTC' }];

    useSelector.mockImplementation((callback) =>
      callback({ futuresAssets: { walletList: mockWalletList } }),
    );

    const { result } = renderHook(() => useWalletList());

    expect(result.current).toEqual(mockWalletList);
  });

  it('should return empty array if wallet list is not present in state', () => {
    useSelector.mockImplementation((callback) => callback({ futuresAssets: {} }));

    const { result } = renderHook(() => useWalletList());

    expect(result.current).toBe(undefined);
  });
});

describe('getWalletList', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return wallet list from global state', () => {
    const mockWalletList = [{ id: 1, name: 'BTC' }];

    const mockState = { futuresAssets: { walletList: mockWalletList } };

    const mockStore = { getState: jest.fn().mockReturnValue(mockState) };

    getStore.mockReturnValue(mockStore);

    get.mockImplementation(
      (object, path, defaultValue) => object.futuresAssets.walletList || defaultValue,
    );

    const result = getWalletList();

    expect(result).toEqual(mockWalletList);

    expect(getStore).toHaveBeenCalled();

    expect(get).toHaveBeenCalledWith(mockState, 'futuresAssets.walletList', []);
  });

  it('should return empty array if wallet list is not present in global state', () => {
    const mockState = { futuresAssets: {} };

    const mockStore = { getState: jest.fn().mockReturnValue(mockState) };

    getStore.mockReturnValue(mockStore);

    get.mockImplementation(
      (object, path, defaultValue) => object.futuresAssets.walletList || defaultValue,
    );

    const result = getWalletList();

    expect(result).toEqual([]);

    expect(getStore).toHaveBeenCalled();

    expect(get).toHaveBeenCalledWith(mockState, 'futuresAssets.walletList', []);
  });
});
