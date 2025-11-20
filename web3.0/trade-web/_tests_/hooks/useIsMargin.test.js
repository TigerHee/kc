import { renderHook } from '@testing-library/react-hooks';
import { useTradeType } from 'src/trade4.0/hooks/common/useTradeType.js';
import { checkIsMargin } from 'src/trade4.0/meta/tradeTypes';
import useIsMargin from 'src/trade4.0/hooks/useIsMargin.js';

jest.mock('src/trade4.0/hooks/common/useTradeType.js');
jest.mock('src/trade4.0/meta/tradeTypes');

describe('useIsMargin', () => {
  beforeEach(() => {
    useTradeType.mockClear();
    checkIsMargin.mockClear();
  });

  it('should return the result of checkIsMargin with the given tradeType', () => {
    const tradeType = 'mockTradeType';
    const checkIsMarginResult = true;

    useTradeType.mockReturnValue('mockUseTradeType');
    checkIsMargin.mockReturnValue(checkIsMarginResult);

    const { result } = renderHook(() => useIsMargin(tradeType));

    expect(checkIsMargin).toHaveBeenCalledWith(tradeType);
    expect(result.current).toBe(checkIsMarginResult);
  });

  it('should return the result of checkIsMargin with the tradeType from useTradeType when no tradeType is given', () => {
    const useTradeTypeResult = 'mockUseTradeType';
    const checkIsMarginResult = false;

    useTradeType.mockReturnValue(useTradeTypeResult);
    checkIsMargin.mockReturnValue(checkIsMarginResult);

    const { result } = renderHook(() => useIsMargin());

    expect(checkIsMargin).toHaveBeenCalledWith(useTradeTypeResult);
    expect(result.current).toBe(checkIsMarginResult);
  });
});
