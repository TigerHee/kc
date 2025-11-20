/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';
import { storiesOf } from '@storybook/react';
import Transitions from '../doc/transitions';

storiesOf('Transitions', module).add('basic', () => {
  return <Transitions />;
});
