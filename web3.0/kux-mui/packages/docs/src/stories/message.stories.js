/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';
import { storiesOf } from '@storybook/react';
import Message from '../doc/message';

storiesOf('Message', module).add('basic', () => {
  return <Message />;
});
