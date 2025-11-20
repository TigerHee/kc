/**
 * Owner: chelsey.fan@kupotech.com
 */
/**
 * params： 需要懒加载的图片元素;
 * 原理： 给图片设置data-src="xxx" 当图片元素处于可视窗口时 将data-src赋值给src 实现图片的动态加载。
 */
import styled from '@emotion/styled';
import clsx from 'clsx';
import { memo, useEffect, useRef } from 'react';
import { lazyImageObserver } from 'utils/initLazyImgObserver';

export const lazy = (lazyImage) => {
  if (lazyImageObserver) {
    lazyImageObserver.observe(lazyImage);
  } else {
    if (lazyImage.dataset.src) {
      lazyImage.classList.add('visible');
    }
  }
};

const Box = styled.div`
  background-image: none !important;
  &.visible {
    background-image: ${(props) => `url(${props['data-bg']})` || 'none'} !important;
  }
`;

const LazyBackgroundImage = (props) => {
  const { src, className, ...rest } = props;
  const lazyImgRef = useRef();
  useEffect(() => {
    if (!src) {
      return;
    }
    lazy(lazyImgRef.current);
  }, [src]);
  return (
    <Box
      className={clsx('lazy-background', className)}
      data-bg={src}
      ref={lazyImgRef}
      alt=""
      {...rest}
    />
  );
};

export default memo(LazyBackgroundImage);
