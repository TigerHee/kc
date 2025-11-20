/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';

export interface IInputNumberProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /**
   * 输入框内容
   */
  value?: string | number;

  /**
   * 输入框默认内容
   */
  defaultValue?: string;

  /**
   * 输入框内容变化时的回调
   */
  onChange?: React.MouseEventHandler<HTMLInputElement>;

  /**
   * 选择框的大小，默认为basic
   */
  size: 'small' | 'medium' | 'large';

  /**
   * 选择框的空值提示语
   */
  placeholder?: string;

  /**
   * 输入框失去焦的回调
   */
  onBlur?: React.MouseEventHandler<HTMLInputElement>;

  /**
   * 精度
   */
  autoFixPrecision?: number;

  /**
   * 是否自动格式化精度
   */
  autoFixPrecision?: boolean;

  /**
   * 按下回车键的回调
   */
  onEnterPress?: (event: React.KeyboardEventHandler<HTMLInputElement>) => void;

  /**
   * 携带的单位
   */
  unit: string;

  /**
   * 最小值
   */
  min: number;

  /**
   * 最大值
   */
  max: number;
}

export declare const InputNumber: React.ForwardRefRenderFunction<HTMLDivElement, IInputNumberProps>;
