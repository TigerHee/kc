/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';
import { storiesOf } from '@storybook/react';
import Drawer from '../doc/drawer';

storiesOf('Drawer', module).add('basic', () => {
  return <Drawer />;
});
