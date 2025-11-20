/**
 * Owner: jesse@kupotech.com
 */
const { default: usePrevious } = require('src/hooks/usePrevious');

import { renderHook, act } from '@testing-library/react-hooks';

describe('usePrevious', () => {
  it('returns undefined as the previous value on the first render', () => {
    const { result } = renderHook(() => usePrevious(0));
    expect(result.current).toBeUndefined();
  });

  it('returns the previous value after a re-render', () => {
    const { result, rerender } = renderHook(({ value }) => usePrevious(value), {
      initialProps: { value: 0 },
    });

    act(() => {
      rerender({ value: 1 });
    });

    expect(result.current).toBe(0);
  });
});
