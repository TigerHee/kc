/**
 * Owner: willen@kupotech.com
 */
import { renderHook } from '@testing-library/react-hooks';
import useObserver from 'src/hooks/useResizeObserver';

test('test useObserver', () => {
  const elementRef = { current: document.createElement('div') };
  const { rerender } = renderHook(() => useObserver({ elementRef, callback: () => {} }));
});
