/**
 * Owner: victor.ren@kupotech.com
 */
import React, { useMemo, useImperativeHandle } from 'react';
import FieldForm from 'rc-field-form';
import { clx } from '@/common/style';
import { IFormProps } from '../types';
import { FormContext } from '../context/form-context';
import useForm from '../hooks/use-form';

export interface FormRef {
  [key: string]: any;
}

export const Form = React.forwardRef<FormRef, IFormProps>(
  ({ 
    labelCol, 
    wrapperCol, 
    layout = 'vertical', 
    name, 
    form, 
    requiredMark, 
    className, 
    children,
    ...restProps 
  }, ref) => {
    const [wrapForm] = useForm(form);
    const { __INTERNAL__ } = wrapForm;
    __INTERNAL__.name = name;

    const formContentValue = useMemo(() => {
      return {
        labelCol,
        wrapperCol,
        layout,
        name,
        requiredMark,
        itemRef: __INTERNAL__.itemRef,
        form: wrapForm,
      };
    }, [labelCol, wrapperCol, layout, name, requiredMark, __INTERNAL__.itemRef, wrapForm]);

    useImperativeHandle(ref, () => wrapForm);

    const formClassName = clx(
      'kux-form',
      `kux-form--${layout}`,
      className
    );

    return (
      <FormContext.Provider value={formContentValue}>
        <FieldForm
          id={name}
          {...restProps}
          name={name}
          form={wrapForm}
          className={formClassName}
        >
          {typeof children === 'function' ? children : children}
        </FieldForm>
      </FormContext.Provider>
    );
  }
);

Form.displayName = 'Form'; 