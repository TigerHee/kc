/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';
import { storiesOf } from '@storybook/react';
import Popover from '../doc/popover';

storiesOf('Popover', module).add('basic', () => {
  return <Popover />;
});
