/**
 * Owner: tiger@kupotech.com
 */
import React from 'react';
import PropTypes from 'prop-types';
import { ThemeProvider, Snackbar, Notification } from '@kux/mui';
// import * as captchaLocales from '@packages/captcha/src/locale';
import CommonCaptcha from './components/CommonCaptcha/index';

const { SnackbarProvider } = Snackbar;
const { NotificationProvider } = Notification;

// addI18nResourceBundle(captchaLocales, 'captcha');

const Captcha = ({
  currentLang,
  bizType,
  onValidateSuccess,
  onValidateError,
  open,
  onClose,
  ...otherProps
}) => {
  return (
    <CommonCaptcha
      currentLang={currentLang}
      bizType={bizType}
      onValidateSuccess={onValidateSuccess}
      onValidateError={onValidateError}
      open={open}
      onClose={onClose}
      {...otherProps}
    />
  );
};

Captcha.propTypes = {
  currentLang: PropTypes.string, // 当前语言
  bizType: PropTypes.string.isRequired, // 人机校验初始化查询业务类型
  onValidateSuccess: PropTypes.func.isRequired, // 校验成功回调
  open: PropTypes.bool.isRequired, // 是否打开人机校验
  onClose: PropTypes.func.isRequired, // 取消回调
  onValidateError: PropTypes.func, // 校验失败回调
  onGoogleCaptchaVisibleChange: PropTypes.func, // reCaptcha显隐变化回调
};

Captcha.defaultProps = {
  currentLang: '',
  onValidateError: function onValidateError() {},
  onGoogleCaptchaVisibleChange: () => {},
};

export default (props) => {
  return (
    <ThemeProvider theme={props.theme || 'light'}>
      <SnackbarProvider>
        <NotificationProvider>
          <Captcha {...props} />
        </NotificationProvider>
      </SnackbarProvider>
    </ThemeProvider>
  );
};
