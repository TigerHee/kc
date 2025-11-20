/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';
import { storiesOf } from '@storybook/react';
import Uploader from '../doc/uploader';

storiesOf('Uploader', module).add('basic', () => {
  return <Uploader />;
});
