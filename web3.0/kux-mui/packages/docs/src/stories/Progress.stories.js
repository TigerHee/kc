/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';
import { storiesOf } from '@storybook/react';
import Progress from '../doc/progress';

storiesOf('Progress', module).add('basic', () => {
  return <Progress />;
});
