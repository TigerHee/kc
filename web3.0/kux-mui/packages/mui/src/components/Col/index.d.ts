/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';

type ColSpanType = number;

type FlexType = number | 'none' | 'auto' | string;

export interface ColSize {
  flex?: FlexType;
  span?: ColSpanType;
  order?: ColSpanType;
  offset?: ColSpanType;
  push?: ColSpanType;
  pull?: ColSpanType;
}

export interface IColProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * flex 布局属性
   */
  flex?: FlexType;

  /**
   * 栅格占位格数，为 0 时相当于 display: none
   */
  span?: ColSpanType;

  /**
   * 栅格顺序，默认是0
   */
  order?: ColSpanType;

  /**
   * 栅格左侧的间隔格数，间隔内不可以有栅格，默认是0
   */
  offset?: ColSpanType;

  /**
   * 栅格向右移动格数，默认是0
   */
  push?: ColSpanType;

  /**
   * 栅格向左移动格数，默认是0
   */
  pull?: ColSpanType;

  /**
   * 屏幕 <= 768px 响应式栅格，可为栅格数或一个包含其他属性的对象
   */
  sm?: ColSpanType | ColSize;

  /**
   * 屏幕 <= 1024px 响应式栅格，可为栅格数或一个包含其他属性的对象
   */
  md?: ColSpanType | ColSize;

  /**
   * 屏幕 > 1024 响应式栅格，可为栅格数或一个包含其他属性的对象
   */
  lg?: ColSpanType | ColSize;
}

declare const Col: React.ForwardRefRenderFunction<HTMLDivElement, IColProps>;

export default Col;
