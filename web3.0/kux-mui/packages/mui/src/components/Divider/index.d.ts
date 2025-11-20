/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';

export interface IDividerProps {
  /**
   * 水平还是垂直类型
   */
  type?: 'horizontal' | 'vertical';

  /**
   * 分割线标题的位置，type为horizontal有效
   */
  orientation?: 'left' | 'center' | 'right';
}

declare const Divider: React.ForwardRefRenderFunction<HTMLDivElement, IDividerProps>;

export default Divider;
