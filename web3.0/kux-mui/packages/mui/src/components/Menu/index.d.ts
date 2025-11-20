/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';

export interface IMenuProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * 内容
   */
  children?: React.ReactNode;

  /**
   * 选中的key
   */
  selectedKeys?: string[];
  
  /**
   * 默认选中的key
   */
  defaultSelectedKeys?: string[];

  /**
  * 尺寸
  */
  size?: string;

  /**
  * 选中事件
  */
  onSelect?: React.MouseEventHandler<HTMLDivElement>;
}

declare const Menu: React.ForwardRefRenderFunction<HTMLDivElement, IMenuProps>;

export default Menu;
