/**
 * LazyVideo组件 - 实现video元素的懒加载
 * 原理：给video设置data-src="xxx" 当video元素处于可视窗口时 将data-src赋值给src 实现视频的动态加载。
 */
import React, { memo, useEffect, useRef, forwardRef } from 'react';
import { lazyVideoObserver } from './initLazyVideoObserver';

export const lazyVideo = (lazyVideoElement: HTMLVideoElement) => {
  if (lazyVideoObserver) {
    lazyVideoObserver.observe(lazyVideoElement);
  } else {
    // 如果不支持IntersectionObserver，直接加载视频
    if (lazyVideoElement.dataset.src) {
      lazyVideoElement.src = lazyVideoElement.dataset.src;
      lazyVideoElement.classList.remove('lazy-video');
      lazyVideoElement.load(); // 手动触发加载
    }
  }
};

interface LazyVideoProps extends React.VideoHTMLAttributes<HTMLVideoElement> {
  src: string;
  poster?: string;
  onLoad?: () => void;
}

const LazyVideo = forwardRef<HTMLVideoElement, LazyVideoProps>((props, ref) => {
  const { src, poster, onLoad, className = '', ...rest } = props;
  const lazyVideoRef = useRef<HTMLVideoElement>(null);

  // 合并ref
  const videoRef = (ref as React.RefObject<HTMLVideoElement>) || lazyVideoRef;

  useEffect(() => {
    if (!src || !videoRef.current) {
      return;
    }

    // 添加加载完成事件监听
    const handleLoadedData = () => {
      onLoad?.();
    };

    const videoElement = videoRef.current;
    videoElement.addEventListener('loadeddata', handleLoadedData);

    // 启动懒加载
    lazyVideo(videoElement);

    return () => {
      videoElement.removeEventListener('loadeddata', handleLoadedData);
    };
  }, [src, onLoad]);

  return (
    <video
      ref={videoRef}
      data-src={src}
      poster={poster}
      className={`lazy-video ${className}`}
      {...rest}
    />
  );
});

LazyVideo.displayName = 'LazyVideo';

export default memo(LazyVideo);
