/**
 * Owner: garuda@kupotech.com
 */
import React from 'react';

import Form from '@mui/Form';
import Tooltip from '@mui/Tooltip';

import { CheckBoxItem, SpanUnderline } from '../commonStyle';

const { FormItem } = Form;

const AdvancedCheckBoxItem = ({ name, disabled, title, label, className }) => {
  return (
    <FormItem classNames={className} noStyle name={name} valuePropName="checked">
      <CheckBoxItem disabled={disabled}>
        <Tooltip title={title}>
          <SpanUnderline>{label}</SpanUnderline>
        </Tooltip>
      </CheckBoxItem>
    </FormItem>
  );
};

export default React.memo(AdvancedCheckBoxItem);
