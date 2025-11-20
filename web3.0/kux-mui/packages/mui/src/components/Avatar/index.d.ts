/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';

export interface IAvatarProps {
  /**
   * 指定头像的形状
   */
  variant?: 'circle' | 'square';

  /**
   * 图片类头像的资源地址或者图片元素
   */
  src?: string;

  /**
   * 指定头像的大小
   */
  size?: 'small' | 'basic' | 'middle' | 'large' | 'xlarge' | number;

  /**
   * React.ReactNode
   */
  children?: React.ReactNode;
}

declare const Avatar: React.ForwardRefRenderFunction<HTMLDivElement, IAvatarProps>;

export default Avatar;
