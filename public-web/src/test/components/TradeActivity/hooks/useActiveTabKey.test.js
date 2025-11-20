/**
 * Owner: jessie@kupotech.com
 */
import { renderHook } from '@testing-library/react-hooks';
import moment from 'moment';
import { useDispatch } from 'react-redux';
import useActiveTabKey from 'src/components/TradeActivity/hooks/useActiveTabKey.js';
const { useSelector } = require('src/hooks/useSelector');

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
}));

jest.mock('src/hooks/useSelector', () => ({
  useSelector: jest.fn(),
}));

describe('useActiveTabKey', () => {
  let dispatchMock;

  beforeEach(() => {
    dispatchMock = jest.fn();
    useDispatch.mockReturnValue(dispatchMock);
    jest.clearAllMocks();
  });

  it('should return undefined when activeStakingToken is undefined', () => {
    useSelector.mockImplementation((selector) => {
      if (selector.name === 'activeStakingToken') return undefined;
      if (selector.name === 'currentInfo') return { pools: [] };
    });

    const { result } = renderHook(() => useActiveTabKey());

    expect(result.current).toBeUndefined();
    expect(dispatchMock).not.toHaveBeenCalled();
  });

  it('should return the first non-completed staking token', () => {
    const mockPools = [
      {
        stakingToken: 'TOKEN1',
        stakingStartTime: new Date().getTime() - 100000,
        stakingEndTime: new Date().getTime() + 600000,
      },
      {
        stakingToken: 'TOKEN2',
        stakingStartTime: new Date().getTime() - 100000,
        stakingEndTime: new Date().getTime() + 600000,
      },
    ];

    useSelector.mockImplementation((selector) =>
      selector({
        gempool: {
          activeStakingToken: 'TOKEN1',
          currentInfo: {
            pools: mockPools,
          },
        },
      }),
    );

    const { result } = renderHook(() => useActiveTabKey());

    expect(result.current).toBe('TOKEN1');
    expect(dispatchMock).toHaveBeenCalledWith({
      type: 'gempool/update',
      payload: { activeStakingToken: undefined },
    });
  });

  it('should return the first staking token if activeStakingToken does not match', () => {
    const mockPools = [
      {
        stakingToken: 'TOKEN1',
        stakingStartTime: moment().add(1, 'days').toISOString(),
        stakingEndTime: moment().add(2, 'days').toISOString(),
      },
      null,
    ];

    useSelector.mockImplementation((selector) =>
      selector({
        gempool: {
          activeStakingToken: 'TOKEN3',
          currentInfo: {
            pools: mockPools,
          },
        },
      }),
    );

    const { result } = renderHook(() => useActiveTabKey());

    expect(result.current).toBe('TOKEN1');
    expect(dispatchMock).toHaveBeenCalledWith({
      type: 'gempool/update',
      payload: { activeStakingToken: undefined },
    });
  });

  it('should return undefined if all pools are completed', () => {
    const mockPools = [
      {
        stakingToken: 'TOKEN1',
        stakingStartTime: moment().subtract(4, 'days').toISOString(),
        stakingEndTime: moment().subtract(2, 'days').toISOString(),
      },
      {
        stakingToken: 'TOKEN2',
        stakingStartTime: moment().subtract(6, 'days').toISOString(),
        stakingEndTime: moment().subtract(3, 'days').toISOString(),
      },
    ];

    useSelector.mockImplementation((selector) =>
      selector({
        gempool: {
          activeStakingToken: 'TOKEN1',
          currentInfo: {
            pools: mockPools,
          },
        },
      }),
    );

    const { result } = renderHook(() => useActiveTabKey());

    expect(result.current).toBeUndefined();
    expect(dispatchMock).toHaveBeenCalledWith({
      type: 'gempool/update',
      payload: { activeStakingToken: undefined },
    });
  });

  it('should handle empty pools gracefully', () => {
    const mockPools = [
      {
        stakingToken: 'TOKEN1',
        stakingStartTime: moment().subtract(4, 'days').toISOString(),
        stakingEndTime: moment().subtract(2, 'days').toISOString(),
      },
      {
        stakingToken: 'TOKEN2',
        stakingStartTime: moment().subtract(6, 'days').toISOString(),
        stakingEndTime: moment().subtract(3, 'days').toISOString(),
      },
    ];

    useSelector.mockImplementation((selector) =>
      selector({
        gempool: {
          activeStakingToken: 'TOKEN1',
          currentInfo: {
            pools: mockPools,
          },
        },
      }),
    );

    const { result } = renderHook(() => useActiveTabKey());

    expect(result.current).toBeUndefined();
    expect(dispatchMock).toHaveBeenCalledWith({
      type: 'gempool/update',
      payload: { activeStakingToken: undefined },
    });
  });
});
