/**
 * params： 需要懒加载的图片元素;
 * 原理： 给图片设置data-src="xxx" 当图片元素处于可视窗口时 将data-src赋值给src 实现图片的动态加载。
 */
import React, { memo, useEffect, useRef } from 'react';
import { lazyImageObserver } from './initLazyImgObserver';
export const lazy = (lazyImage) => {
  if (lazyImageObserver) {
    lazyImageObserver.observe(lazyImage);
  } else {
    if (lazyImage.dataset.src) {
      lazyImage.src = lazyImage.dataset.src;
      lazyImage.classList.remove('lazy');
    }
  }
};

const defaultPreloadSrc =
  'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

const LazyImg = (props) => {
  const { src, preloadSrc = defaultPreloadSrc, ...rest } = props;
  const lazyImgRef = useRef();
  useEffect(() => {
    if (!src) {
      return;
    }
    lazy(lazyImgRef.current);
  }, [src]);
  return <img src={preloadSrc} data-src={src} ref={lazyImgRef} alt="" {...rest} />;
};

export default memo(LazyImg);
