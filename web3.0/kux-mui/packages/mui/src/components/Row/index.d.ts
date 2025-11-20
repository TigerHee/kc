/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';

type Breakpoint = 'lg' | 'md' | 'sm';

type Gutter = number | undefined | Partial<Record<Breakpoint, number>>;

export interface IRowProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * 栅格间隔，可以写成像素值或支持响应式的对象写法来设置水平间隔 { xs: 8, sm: 16, md: 24}。或者使用数组形式同时设置 [水平间距, 垂直间距]
   */
  gutter?: Gutter | [Gutter, Gutter];

  /**
   * 垂直对齐方式
   */
  align?: 'flex-start' | 'center' | 'flex-end' | 'space-around' | 'space-between';

  /**
   * 水平排列方式
   */
  justify?: 'flex-start' | 'center' | 'flex-end' | 'baseline' | 'stretch';

  /**
   * 是否自动换行
   */
  wrap?: boolean;
}

declare const Row: React.ForwardRefRenderFunction<HTMLDivElement, IRowProps>;

export default Row;
