/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';
import { storiesOf } from '@storybook/react';
import ModalComps from '../doc/modalComps';

storiesOf('ModalComps', module).add('basic', () => {
  return <ModalComps />;
});
