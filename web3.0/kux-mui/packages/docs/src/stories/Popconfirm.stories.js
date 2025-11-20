/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';
import { storiesOf } from '@storybook/react';
import Popconfirm from '../doc/popconfirm';

storiesOf('Popconfirm', module).add('basic', () => {
  return <Popconfirm />;
});
