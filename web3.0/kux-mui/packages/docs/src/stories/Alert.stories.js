/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';
import { storiesOf } from '@storybook/react';
import Alert from '../doc/alert';

storiesOf('Alert', module).add('basic', () => {
  return <Alert />;
});
