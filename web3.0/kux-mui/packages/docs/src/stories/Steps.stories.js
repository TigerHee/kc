/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';
import { storiesOf } from '@storybook/react';
import Steps from '../doc/steps';

storiesOf('Steps', module).add('basic', () => {
  return <Steps />;
});
