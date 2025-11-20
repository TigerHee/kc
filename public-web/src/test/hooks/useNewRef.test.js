/**
 * Owner: Ray.Lee@kupotech.com
 */
import { renderHook } from '@testing-library/react-hooks';

import useNewRef from 'src/hooks/useNewRef.js';

describe('useNewRef', () => {
  it('should return a ref with the initial value', () => {
    const { result } = renderHook(() => useNewRef('initial value'));

    expect(result.current.current).toBe('initial value');
  });

  it('should update the ref when the value changes', () => {
    const { result, rerender } = renderHook(({ value }) => useNewRef(value), {
      initialProps: { value: 'initial value' },
    });

    expect(result.current.current).toBe('initial value');

    rerender({ value: 'new value' });

    expect(result.current.current).toBe('new value');
  });

  it('should not update the ref if the value does not change', () => {
    const { result, rerender } = renderHook(({ value }) => useNewRef(value), {
      initialProps: { value: 'initial value' },
    });

    const initialRef = result.current;

    rerender({ value: 'initial value' });

    expect(result.current).toBe(initialRef);
  });
});
