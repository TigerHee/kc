/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';
import { storiesOf } from '@storybook/react';
import Tooltip from '../doc/tooltip';

storiesOf('Tooltip', module).add('basic', () => {
  return <Tooltip />;
});
