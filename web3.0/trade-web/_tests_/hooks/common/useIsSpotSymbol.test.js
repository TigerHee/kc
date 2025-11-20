
/**
 * Owner: garuda@kupotech.com
 */

import { useIsSpotTypeSymbol, isSpotTypeSymbol } from '@/hooks/common/useIsSpotSymbol';
import { getCurrentSymbol, useGetCurrentSymbol } from '@/hooks/common/useSymbol';

jest.mock('@/hooks/common/useSymbol');

describe('isSpotTypeSymbol', () => {
  it('should return true when symbol contains "-"', () => {
    getCurrentSymbol.mockReturnValue('BTC-USD');
    const result = isSpotTypeSymbol('BTC-USD');
    expect(result).toBe(true);
  });

  it('should return false when symbol does not contain "-"', () => {
    getCurrentSymbol.mockReturnValue('BTCUSD');
    const result = isSpotTypeSymbol();
    expect(result).toBe(false);
  });
});

describe('useIsSpotTypeSymbol', () => {
  it('should return true when symbol contains "-"', () => {
    useGetCurrentSymbol.mockReturnValue('BTC-USD');
    const result = useIsSpotTypeSymbol('BTC-USD');
    expect(result).toBe(true);
  });

  it('should return false when symbol does not contain "-"', () => {
    useGetCurrentSymbol.mockReturnValue('BTCUSD');
    const result = useIsSpotTypeSymbol();
    expect(result).toBe(false);
  });
});