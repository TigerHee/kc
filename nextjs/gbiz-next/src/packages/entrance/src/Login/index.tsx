/**
 * Owner: sean.shi@kupotech.com
 */
import React from 'react';
import clsx from 'clsx';
import { Drawer, ThemeProvider, useTheme, Snackbar } from '@kux/mui';
import useIsMobile from '../hooks/useIsMobile';
import noop from 'lodash-es/noop';
import { isEmpty } from 'lodash-es';
import Layout from '../Layout';
import FusionSignInComponent, { IFusionSignInProps } from './FusionSignIn';
import {
  AccountInput as AccountInputComponent,
  IAccountInputProps as IAccountInputPropsOri,
} from '../components/AccountInput';
import ErrorBoundary, { SCENE_MAP } from '../components/ErrorBoundary';
import styles from './index.module.scss';
import { LoginStoreProvider, useLoginStore } from './model';
import { SignupStoreProvider, useSignupStore } from '../Signup/model';

const { SnackbarProvider } = Snackbar;
const { withLayout } = Layout;

export type ILoginProps = IFusionSignInProps;
export type IAccountInputProps = IAccountInputPropsOri & { theme?: 'light' | 'dark' };
export type IAccountInputWithDrawerProps = React.FC<IAccountInputProps & { open: boolean; onClose: () => void }>;

export const AccountInputDrawerWithTheme: IAccountInputWithDrawerProps = props => {
  const { open, theme, onSuccess, onClose, ...restProps } = props;

  const isH5 = useIsMobile();

  const handleSuccess: Required<IAccountInputProps>['onSuccess'] = values => {
    onSuccess?.(values);
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Drawer
      className={clsx(styles.extendDrawer)}
      show={open}
      onClose={handleClose}
      anchor={isH5 ? 'bottom' : 'right'}
      theme={theme}
      back={false}
      headerBorder={false}
    >
      <AccountInput {...restProps} onSuccess={handleSuccess} />
    </Drawer>
  );
};

const FusionSignIn: React.FC<IFusionSignInProps> = (props = {}) => {
  return (
    <ErrorBoundary scene={SCENE_MAP.login.fusionSignIn}>
      <ThemeProvider theme={props?.theme || 'light'}>
        <SnackbarProvider>
          <LoginStoreProvider>
            <FusionSignInComponent {...props} />
          </LoginStoreProvider>
        </SnackbarProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

const LoginWithTheme: React.FC<IFusionSignInProps> = (props = {}) => {
  return <FusionSignIn {...props} />;
};

const LayoutWrapperLogin = withLayout(LoginWithTheme, { centerKey: 'login' });

type LoginDrawerWithThemeProps = IFusionSignInProps & { open?: boolean; show?: boolean } & {
  drawerClassName?: string;
};

const LoginDrawerWithTheme: React.FC<LoginDrawerWithThemeProps> = props => {
  const {
    onSuccess = noop,
    onForgetPwdClick = noop,
    verifyCanNotUseClick,
    BoxProps,
    showLoginSafeWord,
    signOrDownClick,
    loginKey,
    inputAccountTitleClassName,
    trackingConfig = {},
    theme,
    open,
    show,
    onClose,
    drawerClassName = '',
    ...restProps
  } = props;

  // zustand 获取 userInfo
  const userInfo = useSignupStore(state => state.userInfo);
  const reset = useLoginStore(state => state.reset);

  const _theme = useTheme();
  const isH5 = useIsMobile();

  const handleClose = () => {
    if (onSuccess && !isEmpty(userInfo)) {
      onSuccess({
        ...userInfo,
        finishUpgrade: true,
      });
    } else {
      reset?.();
      onClose?.();
    }
  };

  return (
    <Drawer
      className={clsx(styles.extendDrawer, drawerClassName)}
      show={open || show}
      onClose={handleClose}
      anchor={isH5 ? 'bottom' : 'right'}
      theme={_theme}
      back={false}
      headerBorder={false}
    >
      <FusionSignIn
        loginKey={loginKey}
        showLoginSafeWord={showLoginSafeWord}
        onSuccess={onSuccess}
        onClose={handleClose}
        onForgetPwdClick={onForgetPwdClick}
        verifyCanNotUseClick={verifyCanNotUseClick}
        signOrDownClick={signOrDownClick}
        inputAccountTitleClassName={inputAccountTitleClassName}
        BoxProps={{ ...BoxProps, style: { width: '100%', height: '100%', ...BoxProps?.style } }}
        trackingConfig={trackingConfig}
        theme={theme}
        withDrawer
        {...restProps}
      />
    </Drawer>
  );
};

export const LoginDrawer: React.FC<IFusionSignInProps> = props => (
  <ErrorBoundary scene={SCENE_MAP.login.loginDrawer}>
    <ThemeProvider theme={props?.theme || 'light'}>
      <SnackbarProvider>
        <LoginStoreProvider>
          <SignupStoreProvider>
            <LoginDrawerWithTheme {...props} />
          </SignupStoreProvider>
        </LoginStoreProvider>
      </SnackbarProvider>
    </ThemeProvider>
  </ErrorBoundary>
);

export const LoginNoLayout: React.FC<IFusionSignInProps> = props => <FusionSignIn {...props} noLayout />;

export const AccountInput: React.FC<IAccountInputProps> = props => (
  <ErrorBoundary scene={SCENE_MAP.login.accountInput}>
    <ThemeProvider theme={props?.theme || 'light'}>
      <SnackbarProvider>
        <LoginStoreProvider>
          <AccountInputComponent {...props} />
        </LoginStoreProvider>
      </SnackbarProvider>
    </ThemeProvider>
  </ErrorBoundary>
);

export const AccountInputWithDrawer: IAccountInputWithDrawerProps = props => (
  <ErrorBoundary scene={SCENE_MAP.login.accountInputWithDrawer}>
    <ThemeProvider theme={props?.theme || 'light'}>
      <SnackbarProvider>
        <LoginStoreProvider>
          <AccountInputDrawerWithTheme {...props} />
        </LoginStoreProvider>
      </SnackbarProvider>
    </ThemeProvider>
  </ErrorBoundary>
);

export default LayoutWrapperLogin;
