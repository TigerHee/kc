/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';
import { storiesOf } from '@storybook/react';
import TextArea from '../doc/textarea';

storiesOf('TextArea', module).add('basic', () => {
  return <TextArea />;
});
