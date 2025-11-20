/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';
import { storiesOf } from '@storybook/react';
import Slider from '../doc/slider';

storiesOf('Slider', module).add('basic', () => {
  return <Slider />;
});
