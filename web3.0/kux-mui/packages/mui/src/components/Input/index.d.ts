/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';

export interface IInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /**
   * 选择框的大小，默认为middle
   */
  size?: 'small' | 'medium' | 'large' | 'xlarge';

  /**
   * 选择框的空值提示语
   */
  placeholder?: string;

  /**
   * 是否为错误状态的布尔值，默认为false
   */
  error?: boolean;

  /**
   * 是否展示可以清除内容的图标
   */
  allowClear?: boolean;

  /**
   * DOM属性，输入框类型
   */
  type?: string;

  /**
   * 添加在输入框后侧的内容，带分割线
   */
  addonAfter?: React.ReactNode;

  /**
   * 添加在输入框前侧的内容，带分割线
   */
  addonBefore?: React.ReactNode;

  /**
   * 添加在输入框前侧的内容，不带分割线
   */
  prefix?: React.ReactNode;

  /**
   * 添加在输入框后侧的内容，不带分割线
   */
  suffix?: React.ReactNode;

  /**
   * 输入框内容
   */
  value?: string | number;

  /**
   * 默认值
   */
  defaultValue?: string | number;

  /**
   * 是否禁用输入框，默认为false
   */
  disabled?: boolean;

  /**
   * label文字
   */
  label?: React.ReactNode;

  /**
   * label 文字属性描述 shrink className style
   */
  labelProps?: Object;

  /**
   * 输入框内容变化时的回调
   */
  onChange?: React.MouseEventHandler<HTMLInputElement>;

  /**
   * 回车Enter事件
   */
  onEnterPress?: (event: React.KeyboardEventHandler<HTMLInputElement>) => void;

  /**
   * input 原生属性
   */
  inputProps?: object;
}

export declare const Input: React.FC<IInputProps>;
