/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';

export type sizeType = 'small' | 'basic';

export interface ICircleProgressProps {
  /**
   * 大小，可选 small | basic
   */
  size: sizeType;

  /**
   * 百分比
   */
  percent?: number;

  /**
   * 状态
   */
  error?: boolean;

  /**
   * 是否显示进度数值或状态图标
   */
  showInfo: boolean;

  /**
   * 自定义内容的模板函数
   */
  format?: (percent: number) => React.ReactNode;
}

declare const CircleProgress: React.ForwardRefRenderFunction<HTMLDivElement, ICircleProgressProps>;

export default CircleProgress;
