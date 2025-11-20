import { useEffect, useRef, RefObject } from 'react';
import ResizeObserver from 'resize-observer-polyfill';

interface UseObserverProps {
  callback: ResizeObserverCallback;
  elementRef: RefObject<Element>;
}

const useObserver = ({ callback, elementRef }: UseObserverProps): void => {
  const current = elementRef?.current;

  const observer = useRef<ResizeObserver | null>(null);

  const observe = (): void => {
    if (elementRef?.current && observer.current) {
      observer.current.observe(elementRef.current);
    }
  };

  useEffect(() => {
    if (observer.current && current) {
      observer.current.unobserve(current);
    }
    observer.current = new ResizeObserver(callback);
    observe();

    return () => {
      if (observer.current && elementRef?.current) {
        observer.current.unobserve(elementRef.current);
      }
    };
  }, [current, callback, elementRef]);
};

export default useObserver;
