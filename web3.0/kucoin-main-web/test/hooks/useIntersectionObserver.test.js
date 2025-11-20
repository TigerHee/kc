/**
 * Owner: larvide.peng@kupotech.com
 */
import useIntersectionObserver from 'src/hooks/useIntersectionObserver';
import { renderHook, act } from '@testing-library/react-hooks';

describe('useIntersectionObserver', () => {
  let observe;
  let unobserve;
  let disconnect;

  beforeEach(() => {
    observe = jest.fn();
    unobserve = jest.fn();
    disconnect = jest.fn();
    global.IntersectionObserver = jest.fn((callback, options) => ({
      observe,
      unobserve,
      disconnect,
      thresholds: Array.isArray(options.threshold) ? options.threshold : [options.threshold],
    }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useIntersectionObserver({
      threshold: 0.3,
      root: null,
      rootMargin: '0px',
      freezeOnceVisible: true,
    }));
    expect(result.current.nodeEntry).toBeUndefined();
    expect(result.current.ref).toBeInstanceOf(Function);
  });

  it('should observe the element when ref is set', () => {
    const { result } = renderHook(() => useIntersectionObserver({
      threshold: 0.3,
      root: null,
      rootMargin: '0px',
      freezeOnceVisible: true,
    }));
    act(() => {
      result.current.ref(document.createElement('div'));
    });
    expect(observe).toHaveBeenCalled();
  });

  it('should call onChange callback when intersection changes', () => {
    const onChange = jest.fn();
    const { result } = renderHook(() => useIntersectionObserver({ onChange }));
    act(() => {
      result.current.ref(document.createElement('div'));
    });

    const entry = { isIntersecting: true, intersectionRatio: 1, target: result.current.ref };
    const observerCallback = global.IntersectionObserver.mock.calls[0][0];
    act(() => {
      observerCallback([entry]);
    });

    expect(onChange).toHaveBeenCalledWith(true, entry);
  });

  it('should reset state when ref is set to null and freezeOnceVisible is false', () => {
    const { result } = renderHook(() => useIntersectionObserver({ freezeOnceVisible: false }));
    act(() => {
      result.current.ref(document.createElement('div'));
    });
    const entry = { isIntersecting: true, intersectionRatio: 1, target: result.current.ref };
    const observerCallback = global.IntersectionObserver.mock.calls[0][0];
    act(() => {
      observerCallback([entry]);
    });

    act(() => {
      result.current.ref(null);
    });
    expect(result.current.nodeEntry).toBeUndefined();
  });
});
