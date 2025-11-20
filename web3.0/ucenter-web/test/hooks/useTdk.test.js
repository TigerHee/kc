/**
 * Owner: willen@kupotech.com
 */
const { default: useTdk } = require('src/hooks/useTdk');
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
