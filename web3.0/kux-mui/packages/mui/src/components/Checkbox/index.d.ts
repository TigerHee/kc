/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';

export type CheckboxValueType = string | number | boolean;

export interface ICheckBoxProps {
  /**
   * 失效状态
   */
  disabled?: boolean;

  /**
   * input[type="checkbox"] 的 name 属性
   */
  name?: string;

  /**
   * 变化时回调函数
   */
  onChange?: (e: T) => void;

  /**
   * 指定当前是否选中
   */
  checked?: boolean;

  /**
   * 初始是否选中
   */
  defaultChecked?: boolean;

  /**
   * 设置 indeterminate 状态，只负责样式控制
   */
  indeterminate?: boolean;

  /**
   * React.ReactNode
   */
  children?: React.ReactNode;
}

export interface CheckboxOptionType {
  /**
   * Checkbox 的内容
   */
  label: React.ReactNode;

  /**
   * Checkbox 的value
   */
  value: CheckboxValueType;

  /**
   * 失效状态
   */
  disabled?: boolean;

  /**
   * 变化时的回调
   */
  onChange?: (e: CheckboxChangeEvent) => void;
}

export interface IGroupProps {
  /**
   * 默认选中的选项
   */
  defaultValue?: Array<CheckboxValueType>;

  /**
   * 指定选中的选项
   */
  value?: Array<CheckboxValueType>;

  /**
   * 整组失效
   */
  disabled?: boolean;

  /**
   * CheckboxGroup 下所有 input[type="checkbox"] 的 name 属性
   */
  name?: string;

  /**
   * 指定可选项
   */
  options?: Array<CheckboxOptionType | string | number>;

  /**
   * 变化时回调函数
   */
  onChange?: (checkedValue: Array<CheckboxValueType>) => void;
}

declare const Checkbox: React.ForwardRefRenderFunction<HTMLInputElement, ICheckBoxProps> & {
  Group: React.ForwardRefRenderFunction<HTMLDivElement, IGroupProps>;
};

export default Checkbox;
