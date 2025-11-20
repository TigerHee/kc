import { ThemeProvider, Snackbar, Notification } from '@kux/mui';
import { SignupPageLayout as OriginalSignupPageLayout, type SignupPageLayoutProps, FusionSignUp } from './PageLayout';
import { SignupStoreProvider } from './model';

const { SnackbarProvider } = Snackbar;
const { NotificationProvider } = Notification;

export type ISignupProps = SignupPageLayoutProps & { theme?: 'light' | 'dark' };

export const SignUpNoLayout = ({ theme, ...others }: ISignupProps) => {
  return (
    <ThemeProvider theme={theme || 'light'}>
      <SnackbarProvider>
        <SignupStoreProvider>
          <FusionSignUp noLayout {...others} />
        </SignupStoreProvider>
      </SnackbarProvider>
    </ThemeProvider>
  );
};

export const SignupPageLayout = ({ theme, ...others }: ISignupProps) => {
  return (
    <ThemeProvider theme={theme || 'light'}>
      <SnackbarProvider>
        <NotificationProvider>
          <SignupStoreProvider>
            <OriginalSignupPageLayout {...others} />
          </SignupStoreProvider>
        </NotificationProvider>
      </SnackbarProvider>
    </ThemeProvider>
  );
};
