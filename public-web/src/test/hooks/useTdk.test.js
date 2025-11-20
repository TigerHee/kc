/**
 * Owner: willen@kupotech.com
 */
const { default: useTdk } = require('src/hooks/tdk/useTdk');
const { TDK_EXCLUDE_PATH } = require('src/hooks/tdk/config');
import { renderHook } from '@testing-library/react-hooks';

jest.mock('@kucoin-base/i18n');

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest
    .fn()
    .mockImplementationOnce(() => ({ pathname: '/test' }))
    .mockImplementationOnce(() => ({ pathname: '/price/BTC' })),
}));

test('test useTdk', () => {
  const { rerender } = renderHook(useTdk);
  rerender();
});

const isPriceTemplate = TDK_EXCLUDE_PATH[3];
describe('isPriceTemplate', () => {
  test('should return true for /price', () => {
    expect(isPriceTemplate({ pathname: '/price' })).toBe(false);
  });

  test('should return true for /price/anything-else', () => {
    expect(isPriceTemplate({ pathname: '/price/anything-else' })).toBe(true);
  });

  test('should return false for /price/hot-list', () => {
    expect(isPriceTemplate({ pathname: '/price/hot-list' })).toBe(false);
  });

  test('should return false for /price/top-gainers', () => {
    expect(isPriceTemplate({ pathname: '/price/top-gainers' })).toBe(false);
  });

  test('should return false for /price/new-coins', () => {
    expect(isPriceTemplate({ pathname: '/price/new-coins' })).toBe(false);
  });

  test('should return false for /price/hot-list/anything-else', () => {
    expect(isPriceTemplate({ pathname: '/price/hot-list/anything-else' })).toBe(true);
  });

  test('should return false for /anything-else', () => {
    expect(isPriceTemplate({ pathname: '/anything-else' })).toBe(false);
  });

  test('should return false for empty pathname', () => {
    expect(isPriceTemplate({ pathname: '' })).toBe(false);
  });
});
