/*
 * Owner: melon@kupotech.com
 */
import { renderHook } from '@testing-library/react-hooks';
import useLocalEnv from 'src/hooks/useLocalEnv';


describe('useLocalEnv Func', () => {
  it('test useLocalEnv', () => {
    const { result } = renderHook(() => useLocalEnv());
    expect(result.current).toBeDefined();
  });
});
