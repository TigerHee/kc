/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';
import FieldForm from 'rc-field-form';
import classNames from 'clsx';
import { composeClassNames } from 'styles/index';
import { KuFoxFormContext } from './aux';
import useForm from './formHooks/useForm';
import getFormClassName from './classNames';

const useClassName = (state) => {
  const { classNames: classNamesFromProps, layout } = state;
  const slots = {
    form: ['form', layout && `${layout}Form`],
  };
  return composeClassNames(slots, getFormClassName, classNamesFromProps);
};

const Form = React.forwardRef(
  ({ labelCol, wrapperCol, layout, name, form, requiredMark, className, ...restProps }, ref) => {
    const [wrapForm] = useForm(form);
    const { __INTERNAL__ } = wrapForm;
    __INTERNAL__.name = name;

    const formContentValue = React.useMemo(() => {
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

    React.useImperativeHandle(ref, () => wrapForm);

    const _classNames = useClassName({ ...restProps, layout });

    return (
      <KuFoxFormContext.Provider value={formContentValue}>
        <FieldForm
          id={name}
          {...restProps}
          name={name}
          form={wrapForm}
          className={classNames(className, _classNames.form)}
        />
      </KuFoxFormContext.Provider>
    );
  },
);

Form.defaultProps = {
  layout: 'vertical',
};

export default Form;
