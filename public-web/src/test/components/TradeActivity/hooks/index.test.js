/**
 * Owner: jessie@kupotech.com
 */
// import { useSelector } from 'src/hooks/useSelector';
import { renderHook } from '@testing-library/react-hooks';

const { useVaildSymbol } = require('TradeActivity/hooks');

jest.mock('@knb/native-bridge', () => ({
  isApp: jest.fn(),
  open: jest.fn(),
}));

jest.mock('src/hooks/useSelector', () => ({
  useSelector: jest
    .fn()
    .mockImplementationOnce((cb) =>
      cb({ market: { records: [{ code: 'BTC-USDT' }, { code: 'KCS-USDT' }] } }),
    ),
}));

describe('useVaildSymbol', () => {
  it('useVaildSymbol with right', () => {
    const { result } = renderHook(() => useVaildSymbol('KCS-USDT'));
    expect(result.current).toBe('KCS-USDT');
  });
  it('useVaildSymbol with wrong', () => {
    const { result } = renderHook(() => useVaildSymbol('USD-USDT'));
    expect(result.current).toBe('BTC-USDT');
  });
});
