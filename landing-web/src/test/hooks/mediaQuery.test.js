/**
 * Owner: jesse@kupotech.com
 */
import { useIsLarge, useIsMiddle, useIsSmall } from 'src/hooks/mediaQuery';
import { renderHook } from '@testing-library/react-hooks';

test('test mediaQuery', () => {
  const { result } = renderHook(() => useIsSmall(null, false));
  const { result: result1 } = renderHook(() => useIsMiddle(null, false));
  const { result: result2 } = renderHook(() => useIsLarge(null, false));
  expect(result.current).toBe(false);
  expect(result1.current).toBe(false);
  expect(result2.current).toBe(false);
});
