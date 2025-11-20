/**
 * Owner: chelsey.fan@kupotech.com
 */
// https://k-devdoc.atlassian.net/wiki/spaces/frontend/pages/99822388

import React, { memo, useEffect, useRef, useCallback } from 'react';
import { PLACEHOLDER_IMAGE } from '../meta/const';

let lazyImageObserver = null;

if ('IntersectionObserver' in window) {
  const _lazyImageObserver = new IntersectionObserver(((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const lazyImage = entry.target;
        const classList = [].slice.call(lazyImage.classList);
        if (classList.includes('lazy-background')) {
          lazyImage.classList.add('visible');
          lazyImageObserver.unobserve(lazyImage);
        }
        if (lazyImage.dataset.src) {
          lazyImage.onerror = () => {
            lazyImage.src = PLACEHOLDER_IMAGE;
          };
          lazyImage.src = lazyImage.dataset.src;
          lazyImage.classList.remove('lazy');
          lazyImageObserver.unobserve(lazyImage);
        }
      }
    });
  }));
  lazyImageObserver = _lazyImageObserver;
}

const collectLazyElement = () => {
  const Backgrounds = [].slice.call(document.querySelectorAll('.lazy-background'));
  if (lazyImageObserver) {
    Backgrounds.forEach((lazyBgImage) => {
      lazyImageObserver.observe(lazyBgImage);
    });
  } else {
    Backgrounds.forEach((lazyBgImage) => {
      const target = document.querySelector(lazyBgImage);
      target.classList.add('visible');
    });
  }
};

export const LazyBg = (props) => {
  const toUpdate = props?.update;
  useEffect(() => {
    collectLazyElement();
  }, []);
  useEffect(() => {
    toUpdate && collectLazyElement();
  }, [toUpdate]);
};

export const lazy = (lazyImage) => {
  if (lazyImageObserver) {
    lazyImageObserver.observe(lazyImage);
  } else if (lazyImage.dataset.src) {
      lazyImage.src = lazyImage.dataset.src;
      lazyImage.classList.remove('lazy');
    }
};

export const LazyImage = memo((props) => {
  const { src, preloadSrc = PLACEHOLDER_IMAGE, alt = 'alt', ...rest } = props;
  const lazyImgRef = useRef();
  const errorImgRef = useRef();

  useEffect(() => {
    if (!src) {
      return;
    }
    lazy(lazyImgRef.current);
  }, [src]);

  // 图片加载失败，使用默认图
  const handleError = useCallback(() => {
    if (!errorImgRef.current && lazyImgRef.current && preloadSrc) {
      lazyImgRef.current.onerror = null;
      lazyImgRef.current.src = preloadSrc;
      errorImgRef.current = true;
    }
  }, [preloadSrc]);

  return (
    <img
      src={preloadSrc}
      data-src={src}
      ref={lazyImgRef}
      alt={alt}
      onError={!errorImgRef.current ? handleError : null}
      {...rest}
    />
  );
});

export {
  PLACEHOLDER_IMAGE,
};
