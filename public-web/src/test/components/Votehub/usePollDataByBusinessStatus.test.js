/**
 * Owner: harry.lai@kupotech.com
 */
import { renderHook } from '@testing-library/react-hooks';
import { useDispatch } from 'react-redux';
import { usePollDataByBusinessStatus } from 'src/components/Votehub/hooks';

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  shallowEqual: jest.fn(),
}));
const mockDispatch = jest.fn();
beforeEach(() => {
  mockDispatch.mockClear();
  useDispatch.mockReturnValue(mockDispatch);
});

jest.mock('src/hooks/useSelector', () => {
  return {
    __esModule: true,
    default: null,
    useSelector: jest.fn(() => ({ countryInfo: 'countryInfo' })),
  };
});

describe('usePollDataByBusinessStatus', () => {
  it('dispatches the correct action when activityStatus not matches type', () => {
    const type = '2';
    renderHook(() => usePollDataByBusinessStatus('1', type));
  });

  it('dispatches the correct action when activityStatus matches type', () => {
    const type = '2';
    const { rerender } = renderHook(() => usePollDataByBusinessStatus(type, type));

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'votehub/pullActivityProjects@polling',
    });
  });

  it('sets up a cleanup function when activityStatus matches type', () => {
    const type = '4';
    const { unmount } = renderHook(() => usePollDataByBusinessStatus(type, type));

    unmount();

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'votehub/pullWinProjects@polling:cancel',
    });
  });
});
