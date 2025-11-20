/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';

export interface ISpinProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * 内容
   */
  children?: React.ReactNode;

  /**
   * 菜单图标
   */
  spinning: boolean;

  /**
   * 点击事件
   */
  size?: 'xsmall' | 'small' | 'basic';

  type?: 'normal' | 'brand';
}

declare const Spin: React.ForwardRefRenderFunction<HTMLDivElement, ISpinProps>;

export default Spin;
