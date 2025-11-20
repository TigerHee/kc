/**
 * Owner: eli.xiang@kupotech.com
 */

import { act, renderHook } from '@testing-library/react-hooks';
import { getPasskeyListApi } from 'services/ucenter/passkey';
import { COMMON_FETCH_STATUS } from 'src/constants';
import usePasskeyList from 'src/hooks/usePasskeyList';

// Mock the API call
jest.mock('services/ucenter/passkey', () => ({
  getPasskeyListApi: jest.fn(),
}));

describe('usePasskeyList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with empty passkey list and init status', () => {
    const { result } = renderHook(() => usePasskeyList());

    expect(result.current.passkeyList).toEqual([]);
    expect(result.current.fetchStatus).toBe(COMMON_FETCH_STATUS.fetching);
  });

  it('should fetch passkey list successfully', async () => {
    const mockData = { data: ['key1', 'key2'] };
    getPasskeyListApi.mockResolvedValueOnce(mockData);

    const { result, waitForNextUpdate } = renderHook(() => usePasskeyList());

    // Initial fetch status should be fetching
    act(() => {
      result.current.updatePasskeyList();
    });

    expect(result.current.fetchStatus).toBe(COMMON_FETCH_STATUS.fetching);

    await waitForNextUpdate(); // Wait for the state to update

    expect(result.current.passkeyList).toEqual(mockData.data);
    expect(result.current.fetchStatus).toBe(COMMON_FETCH_STATUS.success);
  });

  it('should handle error when fetching passkey list', async () => {
    getPasskeyListApi.mockRejectedValueOnce(new Error('Fetch error'));

    const { result, waitForNextUpdate } = renderHook(() => usePasskeyList());

    act(() => {
      result.current.updatePasskeyList();
    });

    expect(result.current.fetchStatus).toBe(COMMON_FETCH_STATUS.fetching);

    await waitForNextUpdate(); // Wait for the state to update

    expect(result.current.passkeyList).toEqual([]);
    expect(result.current.fetchStatus).toBe(COMMON_FETCH_STATUS.error);
  });

  it('should not fetch if already in success or error status', async () => {
    const { result } = renderHook(() => usePasskeyList());

    act(() => {
      result.current.updatePasskeyList();
    });

    await act(async () => {
      await result.current.updatePasskeyList(); // Call again
    });

    expect(getPasskeyListApi).toHaveBeenCalledTimes(3); // Should only be called once
  });
});
