/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';

export interface IDrawerProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Drawer内容
   */
  children?: React.ReactNode;

  /**
   * 是否显示
   */
  show: boolean;

  /**
   * 按钮的主题，默认值为 'primary'
   */
  anchor?: 'top' | 'left' | 'right' | 'bottom';

  /**
   * 关闭时触发的回调函数
   */
  onClose?: () => void;

  /**
  * header 边线，默认 true
  */
  headerBorder?: boolean;

  /**
   * 显示返回箭头，默认 false
   */
  back?: boolean;

  /**
   * 标题
   */
  title: ReactNode;

  /**
   * 点击返回
   */
  onBack?: React.MouseEventHandler<HTMLDivElement>;

  /**
   * 额外的 header 属性，参考 ModalHeader
   */
  headerProps?: ModalHeader;
}

declare const Drawer: React.ForwardRefRenderFunction<HTMLDivElement, IDrawerProps>;

export default Drawer;
