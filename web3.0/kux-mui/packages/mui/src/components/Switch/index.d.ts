/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';

export type switchSizeType = 'small' | 'basic' | 'large';

export interface ISwitchProps {
  /**
   * 指定当前是否选中
   */
  checked?: boolean;

  /**
   * 初始是否选中
   */
  defaultChecked?: boolean;

  /**
   * 是否禁用，默认false
   */
  disabled?: false;

  /**
   * switch 的大小，默认是basic
   */
  size: switchSizeType;

  /**
   * 状态发生变化时的回掉
   */
  onChange?: (status: boolean) => void;
}

declare const Switch: React.ForwardRefRenderFunction<HTMLDivElement, ISwitchProps>;

export default Switch;
