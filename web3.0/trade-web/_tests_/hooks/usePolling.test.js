import { renderHook, act } from '@testing-library/react-hooks';
import { useDispatch } from 'dva';
import usePolling from 'src/trade4.0/hooks/usePolling.js';

jest.mock('dva', () => ({
  useDispatch: jest.fn(),
}));

describe('usePolling', () => {
  let mockDispatch;

  beforeEach(() => {
    mockDispatch = jest.fn(() => Promise.resolve());
    useDispatch.mockReturnValue(mockDispatch);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should start polling', async () => {
    const { result } = renderHook(() => usePolling('pullEffectName', 'registerEffectName'));

    await act(async () => {
      result.current.startPolling({ key: 'value' });
    });

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'registerEffectName',
    });
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'pullEffectName@polling',
      payload: { key: 'value' },
    });
  });

  it('should cancel polling', () => {
    const { result } = renderHook(() => usePolling('pullEffectName', 'registerEffectName'));

    act(() => {
      result.current.cancelPolling();
    });

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'pullEffectName@polling:cancel',
    });
  });
});
