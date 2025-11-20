/**
 * Owner: willen@kupotech.com
 */
const { default: useObserver } = require('src/hooks/useObserver');
import { renderHook } from '@testing-library/react-hooks';

test('test useObserver', () => {
  // 无dom branch
  const { rerender } = renderHook(useObserver, {
    initialProps: { elementRef: { current: null }, callback: () => {} },
  });
  // 有dom branch
  rerender({ elementRef: { current: document.createElement('div') }, callback: () => {} });
  // 更新dom branch
  rerender({ elementRef: { current: document.createElement('p') }, callback: () => {} });
});
