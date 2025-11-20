/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';

export type buttonSizeType = 'basic' | 'large' | 'small' | 'mini';

export type buttonVariantType = 'text' | 'outlined' | 'contained' | 'icon';

export interface IButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * 按钮内容
   */
  children?: React.ReactNode;

  /**
   * 是否禁用，默认false
   */
  disabled?: boolean;

  /**
   * 是否与容器等宽，默认undefined
   */
  fullWidth?: boolean;

  /**
   * 是否加载中，默认false
   */
  loading?: boolean;

  /**
   * 按钮的大小，默认为 'basic'
   */
  size?: buttonSizeType;

  /**
   * 按钮前侧的图标节点
   */
  startIcon?: React.ReactNode;

  /**
   * 按钮后侧的图标节点
   */
  endIcon?: React.ReactNode;

  /**
   * 按钮的类型，默认值为 'contained'
   */
  variant?: buttonVariantType;

  /**
   * 按钮的主题，默认值为 'primary'
   */
  type?: 'primary' | 'default' | 'secondary';

  /**
   * 按钮类型，默认 "button"
   */
  htmlType?: 'button' | 'submit';
}

declare const Button: React.ForwardRefRenderFunction<HTMLButtonElement, IButtonProps>;

export default Button;
