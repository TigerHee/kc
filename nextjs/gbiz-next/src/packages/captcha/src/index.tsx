/**
 * Owner: tiger@kupotech.com
 */
import React from 'react';
import { CacheProvider, ThemeProvider, Snackbar, Notification } from '@kux/mui-next';
import useLang from 'hooks/useLang';
import CommonCaptcha, { CommonCaptchaProps } from './components/CommonCaptcha';
import { CaptchaStoreProvider } from './model';

const { SnackbarProvider } = Snackbar;
const { NotificationProvider } = Notification;

type CaptchaProps = CommonCaptchaProps & {
  currentLang?: string; // 当前语言
}

const Captcha: React.FC<CaptchaProps> = ({
  currentLang = '',
  bizType,
  onValidateSuccess,
  onValidateError = () => {},
  onGoogleCaptchaVisibleChange = () => {},
  open,
  onClose,
  ...otherProps
}) => {
  return open ? (
    <CommonCaptcha
      currentLang={currentLang}
      bizType={bizType}
      onValidateSuccess={onValidateSuccess}
      onValidateError={onValidateError}
      onGoogleCaptchaVisibleChange={onGoogleCaptchaVisibleChange}
      open={open}
      onClose={onClose}
      {...otherProps}
    />
  ) : null;
};

const CaptchaWithProvider: React.FC<CaptchaProps> = props => {
  const { isRTL } = useLang();

  return (
    <CaptchaStoreProvider>
      <CacheProvider isRTL={isRTL}>
        <ThemeProvider theme={props.theme || 'light'}>
          <SnackbarProvider>
            <NotificationProvider>
              <Captcha {...props} />
            </NotificationProvider>
          </SnackbarProvider>
        </ThemeProvider>
      </CacheProvider>
    </CaptchaStoreProvider>
  );
};

export default CaptchaWithProvider;
