/**
 * Owner: iron@kupotech.com
 */
import React from 'react';
import { ThemeProvider } from '@kux/mui';

import Footer from './Footer';

export default (props) => {
  return (
    <ThemeProvider theme={props.theme || 'light'}>
      <Footer {...props} />
    </ThemeProvider>
  );
};
