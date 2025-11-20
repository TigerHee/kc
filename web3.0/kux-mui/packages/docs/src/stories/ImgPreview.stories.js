/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';
import { storiesOf } from '@storybook/react';
import ImgPreview from '../doc/imgPreview';

storiesOf('ImgPreview', module).add('basic', () => {
  return <ImgPreview />;
});
