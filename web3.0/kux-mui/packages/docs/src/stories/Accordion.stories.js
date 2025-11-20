/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';
import { storiesOf } from '@storybook/react';
import Accordion from '../doc/accordion';

storiesOf('Accordion', module).add('basic', () => {
  return <Accordion />;
});
