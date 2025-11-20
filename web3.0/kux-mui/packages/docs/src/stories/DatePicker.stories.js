/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';
import { storiesOf } from '@storybook/react';
import DatePicker from '../doc/datepicker';

storiesOf('DatePicker', module).add('basic', () => {
  return <DatePicker />;
});
