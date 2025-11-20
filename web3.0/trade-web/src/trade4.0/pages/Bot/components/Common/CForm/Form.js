/**
 * Owner: mike@kupotech.com
 */
import React from 'react';
import Form from '@kux/mui/Form';
import styled from '@emotion/styled';

const _Form = styled(Form)`
  div.KuxForm-itemHelp {
    min-height: 12px;
  }
`;
_Form.FormItem = Form.FormItem;
_Form.FormProvider = Form.FormProvider;
_Form.withForm = Form.withForm;
_Form.useForm = Form.useForm;
_Form.useWatch = Form.useWatch;
_Form.useFormInstance = Form.useFormInstance;

export default _Form;
