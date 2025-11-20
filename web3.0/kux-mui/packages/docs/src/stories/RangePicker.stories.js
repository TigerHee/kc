/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';
import { storiesOf } from '@storybook/react';
import RangePicker from '../doc/rangepicker';

storiesOf('RangePicker', module).add('basic', () => {
  return <RangePicker />;
});
