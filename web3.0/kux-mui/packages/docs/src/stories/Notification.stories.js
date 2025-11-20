/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';
import { storiesOf } from '@storybook/react';
import Notification from '../doc/notification';

storiesOf('Notification', module).add('basic', () => {
  return <Notification />;
});
