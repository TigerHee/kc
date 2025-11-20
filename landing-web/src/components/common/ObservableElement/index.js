/**
 * Owner: jesse.shao@kupotech.com
 */
import React, { useRef, useEffect } from 'react';
import { Element } from 'react-scroll';

const ObservableElement = ({ onActive, children, name, ...restProps }) => {
  const domRef = useRef();
  useEffect(
    () => {
      const dom = domRef.current;
      let observer;
      if (dom) {
        observer = new IntersectionObserver(
          ([e]) => {
            typeof onActive === 'function' && onActive(e.intersectionRatio, name);
          },
          { threshold: [0, 0.5] },
        );

        observer.observe(dom);
      }
      return () => {
        if (observer) {
          observer.disconnect();
        }
      };
    },
    [onActive, domRef, name],
  );
  return (
    <div ref={domRef}>
      <Element name={name} {...restProps}>
        {children}
      </Element>
    </div>
  );
};

export default ObservableElement;
