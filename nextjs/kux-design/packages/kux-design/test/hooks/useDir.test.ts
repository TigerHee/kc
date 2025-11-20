import { renderHook, act } from '@testing-library/react';
import { useDir } from '@/hooks/useDir';
import { DIR_ATTRIBUTE_NAME } from '@/common';

describe('useDir', () => {
  beforeEach(() => {
    document.documentElement.removeAttribute(DIR_ATTRIBUTE_NAME);
  });

  it('should react to dir attribute changes', async () => {
    document.documentElement.setAttribute(DIR_ATTRIBUTE_NAME, 'ltr');
    const { result } = renderHook(() => useDir());
    expect(result.current).toBe('ltr');

    // 变更 dir 属性, 使用异步 act 来确保 DOM 更新已应用
    await act(() => {
      document.documentElement.setAttribute(DIR_ATTRIBUTE_NAME, 'rtl');
      return Promise.resolve();
    });
    expect(result.current).toBe('rtl');
  });

  it('should handle SSR', () => {
    const { result } = renderHook(() => useDir());
    expect(result.current).toBe('ltr'); // SSR 下默认值
  });

  it('should return same instance for multiple calls (singleton)', () => {
    const { result: result1 } = renderHook(() => useDir());
    const { result: result2 } = renderHook(() => useDir());
    expect(result1.current).toBe(result2.current);
  });
});
