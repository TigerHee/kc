/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';
import { storiesOf } from '@storybook/react';
import Theme from '../doc/theme';

storiesOf('Theme', module).add('basic', () => {
  return <Theme />;
});
