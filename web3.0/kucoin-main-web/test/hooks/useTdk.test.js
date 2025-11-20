/**
 * Owner: willen@kupotech.com
 */
const { default: useTdk } = require('src/hooks/tdk/useTdk');
import { renderHook } from '@testing-library/react-hooks';

test('test useTdk', () => {
  const { rerender } = renderHook(useTdk);
  rerender();
});
