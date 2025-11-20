/**
 * Owner: terry@kupotech.com
 */
import { useState, useEffect } from 'react';
import { clx } from '@/common';
import './style.scss'
import errorDefaultSource from './assets/error.svg?url';
import loadingDefaultSource from './assets/default.svg?url';

export interface ILazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  /**
   * 图片loading占位链接
   */
  loadingSrc?: string;
  /**
   * 图片error占位链接
   */
  errorSrc?: string;
  /**
   * 图片src
   */
  src: string;
}

type ILoadingStatus = 'init' | 'ready' | 'error';

/**
 * 加载图片，带占位图（loading、error占位）
 * @param props 
 * @returns 
 */
export function LazyImage(props: ILazyImageProps) {
  const {
    src,
    loadingSrc = loadingDefaultSource,
    errorSrc = errorDefaultSource,
    className = '',
    ...rest
  } = props;
  const [imgSrc, setImgSrc] = useState(loadingSrc);
  const [status, setStatus] = useState<ILoadingStatus>('init');

  useEffect(() => {
    if (!src || app.global._IS_SSG_ENV_) return;
    const image = new Image();
    let isUnmounted = false;
    image.src= src;
    image.onload = () => {
      if (isUnmounted) return;
      setImgSrc(src);
      setStatus('ready');
    }
    image.onerror = () => {
      if (isUnmounted) return;
      setImgSrc(errorSrc);
      setStatus('error');
    }
    return () => {
      isUnmounted = true;
    }
  }, [src, errorSrc]);

  if (!src) return null;
  
  return (
    <img
      src={imgSrc}
      data-status={status}
      className={clx('kux-lazy-image', className)}
      {...rest}
    />
  )
}