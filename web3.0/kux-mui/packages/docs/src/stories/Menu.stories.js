/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';
import { storiesOf } from '@storybook/react';
import Menu from '../doc/menu';

storiesOf('Menu', module).add('basic', () => {
  return <Menu />;
});
