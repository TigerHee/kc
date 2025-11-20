/**
 * Owner: sean.shi@kupotech.com
 */
import React from 'react';
import { ThemeProvider } from '@kux/mui';
import Layout from '../Layout';
import FusionSignIn from './FusionSignIn';

const { withLayout } = Layout;

const LoginWithTheme = (props = {}) => {
  return (
    <ThemeProvider theme={props?.theme || 'light'}>
      <FusionSignIn {...props} />
    </ThemeProvider>
  );
};

const LayoutWrapperLogin = withLayout(LoginWithTheme, { centerKey: 'login' });

export default LayoutWrapperLogin;
