/**
 * Owner: iron@kupotech.com
 */
import React, { forwardRef } from 'react';
import { Input } from '@kux/mui';
import noop from 'lodash/noop';

function InputEye(props = {}, ref) {
  const { onChange = noop, ...others } = props;

  const InputChange = (e) => {
    onChange(e.target.value);
  };

  return <Input {...others} ref={ref} onChange={InputChange} />;
}

export default forwardRef(InputEye);
