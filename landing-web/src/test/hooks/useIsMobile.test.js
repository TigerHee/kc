/*
 * Owner: melon@kupotech.com
 */
import { renderHook } from '@testing-library/react-hooks';
import useIsMobile from 'src/hooks/useIsMobile';


describe('useIsMobile Func', () => {
  it('test useIsMobile', () => {
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBeDefined();
  });
});
