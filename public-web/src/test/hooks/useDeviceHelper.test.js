/*
 * @Date: 2024-06-25 10:44:46
 * @LastEditors: harry.lai harry.lai@kupotech.com
 * @LastEditTime: 2024-06-25 14:15:22
 */
/**
 * Owner: harry.lai@kupotech.com
 */
import { renderHook } from '@testing-library/react-hooks';

import { useResponsive } from '@kux/mui/hooks';
import { useDeviceHelper, useIsH5 } from 'src/hooks/useDeviceHelper';

jest.mock('@kux/mui/hooks', () => ({
  useResponsive: jest.fn(),
}));

describe('useIsH5', () => {
  it('should return true when sm is false', () => {
    useResponsive.mockReturnValue({ sm: false });

    const { result } = renderHook(() => useIsH5());

    expect(result.current).toBe(true);
  });

  it('should return false when sm is true', () => {
    useResponsive.mockReturnValue({ sm: true });

    const { result } = renderHook(() => useIsH5());

    expect(result.current).toBe(false);
  });
});

describe('useDeviceHelper', () => {
  it('should return isH5 as true when sm is false', () => {
    useResponsive.mockReturnValue({ sm: false, lg: false });

    const { result } = renderHook(() => useDeviceHelper());

    expect(result.current.isH5).toBe(true);

    expect(result.current.isPad).toBe(false);

    expect(result.current.isPC).toBe(false);
  });

  it('should return isPad as true when sm is true and lg is false', () => {
    useResponsive.mockReturnValue({ sm: true, lg: false });

    const { result } = renderHook(() => useDeviceHelper());

    expect(result.current.isH5).toBe(false);

    expect(result.current.isPad).toBe(true);

    expect(result.current.isPC).toBe(false);
  });

  it('should return isPC as true when lg is true', () => {
    useResponsive.mockReturnValue({ sm: true, lg: true });

    const { result } = renderHook(() => useDeviceHelper());

    expect(result.current.isH5).toBe(false);

    expect(result.current.isPad).toBe(false);

    expect(result.current.isPC).toBe(true);
  });
});
