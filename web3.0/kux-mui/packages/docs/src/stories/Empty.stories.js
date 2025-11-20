/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';
import { storiesOf } from '@storybook/react';
import Empty from '../doc/empty';

storiesOf('Empty', module).add('basic', () => {
  return <Empty />;
});
