import { renderHook, act } from '@testing-library/react-hooks';
import { useHistoryOrderEnhanceTWAPTabs } from 'src/trade4.0/pages/Orders/HistoryOrders/hooks/useHistoryOrderEnhanceTWAPTabs';
import { SPOT } from 'src/trade4.0/meta/const';
import { useTradeType } from 'src/trade4.0/hooks/common/useTradeType';

jest.mock('src/trade4.0/hooks/common/useTradeType', () => ({
  useTradeType: jest.fn(),
}));

describe('useHistoryOrderEnhanceTWAPTabs', () => {
  const historyOrderDict = [
    { key: 'tab1', config: 'config1' },
    { key: 'tab2', config: 'config2' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return the first tab config when trade type is not SPOT', () => {
    useTradeType.mockReturnValue('NON_SPOT');
    const { result } = renderHook(() => useHistoryOrderEnhanceTWAPTabs(historyOrderDict));
    expect(result.current.currentTabOrderConfig).toEqual(historyOrderDict[0]);
    expect(result.current.activeTabKey).toBe('tab1');
  });

  it('should return the active tab config when trade type is SPOT', () => {
    useTradeType.mockReturnValue(SPOT);
    const { result } = renderHook(() => useHistoryOrderEnhanceTWAPTabs(historyOrderDict));
    expect(result.current.currentTabOrderConfig).toEqual(historyOrderDict[0]);
    expect(result.current.activeTabKey).toBe('tab1');
    act(() => {
      result.current.handleTabClick('tab2');
    });
    expect(result.current.currentTabOrderConfig).toEqual(historyOrderDict[1]);
    expect(result.current.activeTabKey).toBe('tab2');
  });

  it('should handle tab click correctly', () => {
    useTradeType.mockReturnValue(SPOT);
    const { result } = renderHook(() => useHistoryOrderEnhanceTWAPTabs(historyOrderDict));

    act(() => {
      result.current.handleTabClick('tab2');
    });
    expect(result.current.activeTabKey).toBe('tab2');
    expect(result.current.currentTabOrderConfig).toEqual(historyOrderDict[1]);
  });
});
