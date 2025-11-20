/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';

export interface IMenuItemProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * 内容
   */
  children?: React.ReactNode;

  /**
   * 菜单图标
   */
  icon: React.ReactNode;

  /**
   * 点击事件
   */
  onClick?: React.MouseEventHandler<HTMLDivElement>;

}

declare const MenuItem: React.ForwardRefRenderFunction<HTMLDivElement, IMenuItemProps>;

export default MenuItem;
