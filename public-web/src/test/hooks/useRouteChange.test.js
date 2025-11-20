/**
 * Owner: willen@kupotech.com
 */
const { default: useRouteChange } = require('src/hooks/useRouteChange');
import { renderHook } from '@testing-library/react-hooks';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest
    .fn()
    .mockImplementationOnce(() => ({ pathname: '/test' }))
    .mockImplementationOnce(() => ({ pathname: '' })),
}));

jest.mock('src/hooks/useSelector', () => ({
  useSelector: jest
    .fn()
    .mockImplementationOnce((cb) => cb({ user: { user: { uid: 123123 } } }))
    .mockImplementationOnce((cb) => cb({ user: { user: null } })),
}));

window.scrollTo = jest.fn();
test('test useRouteChange', () => {
  // 已登录
  const { rerender } = renderHook(useRouteChange);
  // 未登录
  rerender();
});
