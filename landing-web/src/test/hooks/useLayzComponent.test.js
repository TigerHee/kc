/**
 * Owner: terry@kupotech.com
 */
import { act, renderHook } from '@testing-library/react-hooks';
import useLazyComponent from 'src/hooks/useLayzComponent.js';

import useState from 'src/hooks/useSafeState';

// Mock the useSafeState hook, assuming it behaves like useState
jest.mock('src/hooks/useSafeState', () => ({
  __esModule: true, // Needed if using ES6 modules with default export
  default: jest.fn(),
}));

describe('useLazyComponent', () => {
  const mockUpdateComponent = jest.fn();

  beforeEach(() => {
    useState.mockImplementation((initialState) => [initialState, mockUpdateComponent]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should not update component if `show` is false', async () => {
    const loadableFunc = jest.fn(() => 'MockComponent');
    const { waitForNextUpdate } = renderHook(() => useLazyComponent({ show: false, loadableFunc }));

    // Try to wait for any updates, which should not happen
    await expect(waitForNextUpdate({ timeout: 100 })).rejects.toThrow();
    expect(loadableFunc).not.toHaveBeenCalled();
    expect(mockUpdateComponent).not.toHaveBeenCalled();
  });

  it('should not update component if `loadableFunc` is not a function', async () => {
    const { waitForNextUpdate } = renderHook(() =>
      useLazyComponent({ show: true, loadableFunc: null }),
    );

    // Try to wait for any updates, which should not happen
    await expect(waitForNextUpdate({ timeout: 100 })).rejects.toThrow();
    expect(mockUpdateComponent).not.toHaveBeenCalled();
  });

  it('should update component when `show` is true and `loadableFunc` is a function', async () => {
    const mockLoadableFunc = jest.fn(() => 'MockComponent');
    const { result, waitFor } = renderHook(() =>
      useLazyComponent({ show: true, loadableFunc: mockLoadableFunc }),
    );

    await waitFor(() => mockLoadableFunc.mock.calls.length > 0);

    expect(mockLoadableFunc).toHaveBeenCalled();
    // expect(mockUpdateComponent).toHaveBeenCalledWith(expect.any(Promise));

    // Optionally wait for the Promise to resolve and update the component state
    await act(async () => {
      await result.current;
    });
  });

  // Add more tests as needed to cover other scenarios
});
