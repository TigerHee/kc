/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';
import { storiesOf } from '@storybook/react';
import Dropdown from '../doc/dropdown';

storiesOf('Dropdown', module).add('basic', () => {
  return <Dropdown />;
});
