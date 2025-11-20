/**
 * Owner: willen@kupotech.com
 */

import useFetchHandle from 'src/hooks/useFetchHandle';
import useLoading from 'src/hooks/useLoading';
import { renderHook } from '@testing-library/react-hooks';

test('test useFetchHandle', () => {
  renderHook(useLoading);
  const { result } = renderHook(() => useFetchHandle());
  result.current?.fetchHandle();
  result.current?.fetchHandle(Promise.resolve());

  expect(result.current).toHaveProperty('loading');
});
