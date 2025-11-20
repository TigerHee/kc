/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';

export interface IClassNamesType {
  // 容器
  container?: string;

  // 输入框
  input?: string;

  // 清除按钮
  clearIcon?: string;

  // 展示密码的按钮
  togglePwdIcon?: string;
}

export interface IInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /**
   * 输入框内容
   */
  value?: string;

  /**
   * 输入框内容变化时的回调
   */
  onChange?: React.MouseEventHandler<HTMLInputElement>;

  /**
   * 选择框的大小，默认为middle
   */
  size: 'small' | 'middle' | 'large';

  /**
   * 选择框的空值提示语
   */
  placeholder?: string;

  /**
   * 是否为错误状态的布尔值，默认为false
   */
  error?: boolean;

  /**
   * DOM属性，输入框类型
   */
  type?: string;

  /**
   * 是否展示可以清除内容的图标
   */
  allowClear?: boolean;

  /**
   * 是否禁用输入框，默认为false
   */
  disabled?: boolean;

  /**
   * 用于定制组件每个组成部分的样式
   * 注意：样式如果与组件已存在样式重复时，样式需要加!important
   */
  classNames?: IClassNamesType;

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

  onEnterPress?: (event: React.KeyboardEventHandler<HTMLInputElement>) => void;

  minRows?: number;

  maxRows?: number;
}

export declare const TextArea: React.FC<IInputProps>;
