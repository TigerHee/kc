/**
 * Owner: willen@kupotech.com
 */
const { useFirstMountState } = require('src/hooks/useFirstMountState');
import { renderHook } from '@testing-library/react-hooks';

test('test useFirstMountState', () => {
  const { result, rerender } = renderHook(useFirstMountState);
  expect(result.current).toBe(true);
  rerender();
  expect(result.current).toBe(false);
});
