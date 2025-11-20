/**
 * Owner: saiya.lee@kupotech.com
 *
 * @description LoadingMask component
 */
import { type CSSProperties } from 'react';
import { clx } from '@/common';
import { useZIndex } from '@/hooks/useZIndex';
import { type ISizeExtended } from '@/shared-type';
import LoadingIcon from './assets/loading.svg?react';
import CircleLight from './assets/circle_light.svg?react';
// import CircleDark from './assets/circle_dark.svg?react';
import Logo from './assets/logo.svg?react';

import './style.scss'

export interface ILoadingProps {
  /**
   * loading 图标类型
   * * brand: 品牌logo加载图标
   * * normal: 普通加载图标
   * @default brand
   */
  type?: 'normal' | 'brand';
  /**
   * 组件尺寸 mini | small | medium | large
   * * custom: 自定义尺寸, 需要配合 style 属性使用
   * @default 'medium'
   */
  size?: Exclude<ISizeExtended, 'huge'> | 'custom';
  /**
   * 是否全屏
   */
  fullScreen?: boolean;
  /**
   * 背景是否blur(全屏时有意义)
   */
  blurBg?: boolean;
  /**
   * 自定义类名
   */
  className?: string;

  /**
   * 自定义样式
   */
  style?: CSSProperties;
}

/**
 * LoadingMask component
 */
export function Loading(props: ILoadingProps) {
  const zIndex = useZIndex(props.fullScreen);
  const className = clx('kux-loading', props.className, `is-${props.size || 'medium'}`, {
    'is-full-screen': props.fullScreen,
    'is-blur': props.blurBg,
  })
  const maskStyle: React.CSSProperties = {...props.style };
  if (props.fullScreen) {
    maskStyle.zIndex = zIndex
  }
  return (
    <div className={className} style={maskStyle}>
      <div className="kux-loading-box">
        {props.type === 'normal' ? (
          <LoadingIcon className="kux-loading-circle" />
        ) : (
          <>
          <CircleLight className="kux-loading-circle" />
          <Logo className="kux-loading-logo" />
          </>
        )}
      </div>
    </div>
  )
}
