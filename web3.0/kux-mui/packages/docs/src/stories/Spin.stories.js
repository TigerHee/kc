/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';
import { storiesOf } from '@storybook/react';
import Spin from '../doc/spin';

storiesOf('Spin', module).add('basic', () => {
  return <Spin />;
});
