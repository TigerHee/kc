/**
 * Owner: mike@kupotech.com
 */
import React from 'react';
import FormWrapper from './FormComponent/FormWrapper';
import Form from './Form';
/**
 * @description: 组件库withForm有问题， 有校验问题
 * @param {*} options
 * @return {*}
 */
function withForm(options) {
  return (Comp) => {
    return (props) => {
      const [form] = Form.useForm();
      const formParams = Form.useWatch([], form) ?? {};
      return (
        <FormWrapper {...options} form={form} activeTooltipCheck={false}>
          <Comp form={form} {...formParams} {...props} />
        </FormWrapper>
      );
    };
  };
}

export default withForm;
