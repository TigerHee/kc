/*
 * owner: borden@kupotech.com
 */
import React, { forwardRef } from 'react';
import { DatePicker } from '@kux/mui';

const MuiDatePicker = forwardRef((props, ref) => {
  return <DatePicker ref={ref} popupClassName="kux-trade4-datePicker-popup" {...props} />;
});

export default MuiDatePicker;
