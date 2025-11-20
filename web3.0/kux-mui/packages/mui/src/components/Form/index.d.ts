/**
 * Owner: victor.ren@kupotech.com
 */
import RcForm, { FormInstance, FormProps } from 'rc-field-form';
import { FieldProps } from 'rc-field-form/es/Field';
import React from 'react';

export { useForm, FormProvider, useWatch } from 'rc-field-form';

export interface IFormItemClassNames {
  container?: string;
  error: string;
  label?: string;
}

export interface IFormItemProps extends FieldProps {
  /**
   * 重置样式的class名类型
   */
  classNames: IFormItemClassNames;

  children: React.ReactChildren;

  label?: React.ReactNode;

  /**
   * 提示信息，在输入框下方展示。如果校验失败，将会优先展示错误信息
   */
  help?: React.ReactNode;

  labelCol?: object;

  wrapperCol?: object;

  noStyle?: boolean;
}

export declare const Form: typeof RcForm & {
  FormItem: React.ComponentType<IFormItemProps>;
  withForm: typeof withForm;
  FormProvider: FormProvider;
  useForm: typeof useForm;
  useWatch: typeof useWatch;
};

// 表单项组件，用于渲染表单的某个输入框和Label内容
export declare const FormItem: React.ComponentType<IFormItemProps>;

/**
 * Form高阶组件，在组件上层封装了Form组件的使用
 * 通过withForm，在内层组件中可以访问到form实例和表单值对象
 */
export declare const withForm: <P = {}, V = {}>(
  options: FormProps<V>,
) => (Comp: React.ComponentType<P & { form: FormInstance<V>; values: V }>) => React.ReactElement;
