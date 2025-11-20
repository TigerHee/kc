/**
 * Owner: willen@kupotech.com
 */
const { default: useRouteChange } = require('src/hooks/useRouteChange');
import { renderHook } from '@testing-library/react-hooks';

window.scrollTo = jest.fn();
test('test useRouteChange', () => {
  // 已登录
  const { rerender } = renderHook(useRouteChange);
  // 未登录
  rerender();
});
