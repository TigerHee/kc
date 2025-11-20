/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';

export interface IClickAwayListenerProps {
  children?: React.ReactNode;

  /**
   * 默认false
   */
  disableReactTree?: boolean;

  /**
   * 鼠标触发的事件，默认 'onClick'
   */
  mouseEvent?: boolean;

  /**
   * 移动端触摸时触发的事件，默认 'onTouchEnd'
   */
  touchEvent?: boolean;

  /**
   * 点击children以外的DOM元素时的回调
   */
  onClickAway?: (event: React.MouseEvent | React.TouchEvent) => void;
}

declare const ClickAwayListener: React.FC<IClickAwayListenerProps>;

export default ClickAwayListener;
