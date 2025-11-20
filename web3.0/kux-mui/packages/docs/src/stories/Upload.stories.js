/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';
import { storiesOf } from '@storybook/react';
import Upload from '../doc/upload';

storiesOf('Upload', module).add('basic', () => {
  return <Upload />;
});
