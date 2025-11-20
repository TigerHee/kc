/**
 * Owner: sean.shi@kupotech.com
 */
import React from 'react';
import { ThemeProvider, Snackbar } from '@kux/mui';
import Layout from '../Layout';
import FusionSignIn, { FusionSignInProps } from './FusionSignIn';
import { LoginStoreProvider } from '../Login/model';
import ErrorBoundary, { SCENE_MAP } from '../components/ErrorBoundary';

const { SnackbarProvider } = Snackbar;
const { withLayout } = Layout;

type LoginWithThemeProps = FusionSignInProps & {
  theme?: 'light' | 'dark';
};

const LoginWithTheme: React.FC<LoginWithThemeProps> = (props = {}) => {
  return (
    <ErrorBoundary scene={SCENE_MAP.loginCL.loginWithTheme}>
      <ThemeProvider theme={props?.theme || 'light'}>
        <SnackbarProvider>
          <LoginStoreProvider>
            <FusionSignIn {...props} />
          </LoginStoreProvider>
        </SnackbarProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

const LayoutWrapperLogin = withLayout(LoginWithTheme, { centerKey: 'login' });

export default LayoutWrapperLogin;
