/**
 * Owner: jesse@kupotech.com
 */
import useRouteChange from 'hooks/useRouteChange';
import { renderHook } from '@testing-library/react-hooks';
import { render, fireEvent } from '@testing-library/react';

jest.mock('dva', () => ({
  ...jest.requireActual('dva'),
  useLocation: jest
    .fn()
    .mockImplementationOnce(() => ({ pathname: '/test' }))
    .mockImplementationOnce(() => ({ pathname: '' })),
  useSelector: jest.fn().mockImplementationOnce(() => {
    return { user: { user: { uid: 123123 } } };
  }),
  // .mockImplementationOnce((cb) => cb({ user: { user: null } })),
}));
window.scrollTo = jest.fn();

test('test useRouteChange', () => {
  // 已登录
  const { rerender } = renderHook(useRouteChange);
  // 未登录
  rerender();
});

test('renders with default props', () => {
  render(<useRouteChange />);
});

test('renders with default props1', () => {
  renderHook(() => useRouteChange());
});
