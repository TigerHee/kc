/**
 * Owner: jesse@kupotech.com
 */
const { default: useSafeState } = require('src/hooks/useSafeState');
import { renderHook } from '@testing-library/react-hooks';

describe('useSafeState', () => {
  test('should return initial state', () => {
    const initialState = { count: 0 };
    const { result } = renderHook(() => useSafeState(initialState));
    expect(result.current[0]).toEqual(initialState);
  });

  test('should update state with setSafeState', () => {
    const initialState = { count: 0 };
    const { result } = renderHook(() => useSafeState(initialState));
    const [, setSafeState] = result.current;
    setSafeState({ count: 1 });
    expect(result.current[0]).toEqual({ count: 1 });
  });

  test('should not update state if component is unmounted', () => {
    const initialState = { count: 0 };
    const { result, unmount } = renderHook(() => useSafeState(initialState));
    const [, setSafeState] = result.current;
    unmount();
    setSafeState({ count: 1 });
    expect(result.current[0]).toEqual(initialState);
  });
});
