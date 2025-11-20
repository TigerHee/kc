/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';
import { storiesOf } from '@storybook/react';
import Carousel from '../doc/carousel';

storiesOf('Carousel', module).add('basic', () => {
  return <Carousel />;
});
