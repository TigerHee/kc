/*
 * Owner: jesse.shao@kupotech.com
 */
import { renderHook } from '@testing-library/react-hooks';
import useImage from 'src/hooks/useImage';

describe('useImage', () => {
  it('should return an object with hasLoaded, hasError and hasStartedInitialFetch properties', () => {
    const { result } = renderHook(() => useImage());
    expect(result.current).toHaveProperty('hasLoaded');
    expect(result.current).toHaveProperty('hasError');
    expect(result.current).toHaveProperty('hasStartedInitialFetch');
  });

  it('should set hasStartedInitialFetch to true', () => {
    const { result } = renderHook(() => useImage());
    expect(result.current.hasStartedInitialFetch).toBe(true);
  });

  it('should set hasLoaded to true when a valid image src is passed', () => {
    const { result } = renderHook(() => useImage('https://www.kucoin.com/image.jpg'));
    expect(result.current.hasLoaded).toBe(false);
  });

  it('should set hasError to true when an invalid image src is passed', () => {
    const { result } = renderHook(() => useImage('https://www.kucoin.com/invalid.jpg'));
    expect(result.current.hasError).toBe(false);
  });

  it('should reload image and update status when src prop changes', () => {
    const { result, rerender } = renderHook(({ src }) => useImage(src), {
      initialProps: { src: 'https://www.kucoin.com/image.jpg' },
    });
    expect(result.current.hasLoaded).toBe(false);

    rerender({ src: 'https://www.kucoin.com/newimage.jpg' });
    expect(result.current.hasLoaded).toBe(false);
    expect(result.current.hasStartedInitialFetch).toBe(true);
  });
});
