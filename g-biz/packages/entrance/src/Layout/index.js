/**
 * Owner: iron@kupotech.com
 */
import React from 'react';
import { ThemeProvider } from '@kux/mui';
import Layout, { withLayout } from './_Layout';

const LayoutWithTheme = (props) => {
  return (
    <ThemeProvider theme={props.theme || 'light'}>
      <Layout {...props} />
    </ThemeProvider>
  );
};

LayoutWithTheme.withLayout = withLayout;

export default LayoutWithTheme;
