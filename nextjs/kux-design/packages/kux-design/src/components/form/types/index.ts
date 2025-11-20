/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';
import { FormInstance, FormProps as RcFormProps } from 'rc-field-form';

export { useForm, FormProvider, useWatch } from 'rc-field-form';

export interface IFormItemProps {
  children: React.ReactElement;

  label?: React.ReactNode;

  /**
   * 提示信息，在输入框下方展示。如果校验失败，将会优先展示错误信息
   */
  help?: React.ReactNode;

  labelCol?: object;

  wrapperCol?: object;

  noStyle?: boolean;

  /**
   * 布局方式
   */
  layout?: 'horizontal' | 'vertical';

  /**
   * 是否保持帮助信息挂载
   */
  keepHelpMounted?: boolean;

  /**
   * 验证状态
   */
  validateStatus?: 'success' | 'warning' | 'error' | 'validating' | 'info';

  /**
   * 是否必填
   */
  required?: boolean;

  /**
   * 验证规则
   */
  rules?: any[];

  /**
   * 触发验证的事件
   */
  trigger?: string;

  /**
   * 验证触发时机
   */
  validateTrigger?: string | string[];

  /**
   * 字段名
   */
  name?: string | string[];

  /**
   * 自定义类名
   */
  className?: string;
}

export interface IFormProps extends RcFormProps {
  /**
   * 表单名称
   */
  name?: string;

  /**
   * 布局方式
   */
  layout?: 'horizontal' | 'vertical';

  /**
   * 标签列配置
   */
  labelCol?: object;

  /**
   * 包装器列配置
   */
  wrapperCol?: object;

  /**
   * 必填标记
   */
  requiredMark?: boolean | 'optional';

  /**
   * 自定义类名
   */
  className?: string;

  /**
   * 子元素
   */
  children: React.ReactNode | ((values: any, form: FormInstance<any>) => React.ReactNode);
}

export interface IFormContextValue {
  labelCol?: object;
  wrapperCol?: object;
  layout?: 'horizontal' | 'vertical';
  name?: string;
  requiredMark?: boolean | 'optional';
  itemRef?: (name: any) => (node: any) => void;
  form?: FormInstance;
}

export interface IFormNoStyleItemContextValue {
  notifyParentMetaChange?: (meta: any, namePath: any) => void;
}

export interface IWithFormOptions extends IFormProps {
  [key: string]: any;
}

export interface IWithFormComponentProps<P = any, V = any> {
  form: FormInstance<V>;
  values: V;
}

export type WithFormComponentProps<P = any, V = any> = IWithFormComponentProps<P, V> & P;

export type WithFormComponent<P = any, V = any> = React.ComponentType<WithFormComponentProps<P, V>>;

export type WithFormReturn<P = any, V = any> = (Comp: WithFormComponent<P, V>) => React.ComponentType<P>; 