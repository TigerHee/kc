/**
 * Owner: iron@kupotech.com
 */
import React, { memo, useCallback, useEffect } from 'react';
import { isString, omitBy } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';

import { ThemeProvider, Snackbar, Notification } from '@kux/mui';
import GoogleCaptcha from '../GoogleCaptcha';
import GeeTest from '../GeeTest';
import ImageCaptcha from '../ImageCaptcha';
import { useLang } from '../../hookTool';
import { kcsensorsClick } from '../../common/tools';

const { SnackbarProvider } = Snackbar;
const { NotificationProvider } = Notification;
// 校验key 常量
const geeTestKey = 'geetest';
const googleKey = 'recaptcha';
const image = 'image';
const VALIDATE_MAP = {
  [googleKey]: 'reCAPTCHA',
  [geeTestKey]: 'GEETEST',
  [image]: 'IMAGE',
};

function HumanCaptcha(props = {}) {
  const {
    sitekey = GOOGLE_CAPTCHA_SITE_KEY,
    bizType,
    namespace,
    onClose,
    nowPage = '',
    isNew = false,
  } = props;

  const {
    googleCaptchaVisible,
    captchInit = {},
    imageCaptchaVisible = false,
    imgSrc = '',
    checkLoading = false,
  } = useSelector((state) => state[namespace] || {});
  const dispatch = useDispatch();

  const { captchaType = 'default', challenge = '' } = captchInit;

  const { t } = useLang();

  const handleSuccess = async (response) => {
    try {
      const { captchaType, gt, challenge } = captchInit;
      const payload = {
        bizType,
        captchaType: VALIDATE_MAP[captchaType],
        secret: gt || challenge,
        response: isString(response) ? response : JSON.stringify(response),
        lang: t('locale'),
      };
      // 过滤空值
      const oimtNotNull = omitBy(payload, (item) => {
        if (item === '' || item == null) {
          return true;
        }
        return false;
      });
      await dispatch({
        type: `${namespace}/captchaVerify`,
        payload: oimtNotNull,
      });
      dispatch({ type: `${namespace}/captchaSuccess` });
      // 成功的上报
      if (nowPage === 'signUp') {
        const sucEventName = isNew ? 'newRobotSuccess' : 'robotSuccess';
        kcsensorsClick([sucEventName, '1']);
      }
    } catch (err) {
      if (captchaType === 'image') {
        dispatch({
          type: `${namespace}/update`,
          payload: {
            checkLoading: false,
          },
        });
        dispatch({ type: `${namespace}/getImage`, payload: { challenge } });
      } else {
        dispatch({ type: `${namespace}/captchaClose` });
        handleError();
      }
      // 失败的上报
      if (nowPage === 'signUp') {
        const failEventName = isNew ? 'newRobotFail' : 'robotfail';
        kcsensorsClick([failEventName, '1']);
      }
    }
  };

  const handleError = () => {
    onClose && typeof onClose === 'function' && onClose();
  };

  const handleClose = () => {
    dispatch({ type: `${namespace}/captchaClose`, payload: { namespace } });
    handleError();
  };

  const imgRefresh = () => {
    dispatch({ type: `${namespace}/getImage`, payload: { challenge } });
  };

  const captchaJSX = {
    default: null,
    [geeTestKey]: (
      <GeeTest
        {...captchInit}
        onSuccess={handleSuccess}
        onClose={handleClose}
        onError={handleError}
      />
    ),
    [googleKey]: (
      <GoogleCaptcha
        {...captchInit}
        sitekey={sitekey}
        visible={googleCaptchaVisible}
        onSuccess={handleSuccess}
        onClose={handleClose}
      />
    ),
    [image]: null,
  };

  const Captcha = useCallback(() => {
    return captchaJSX[captchaType];
  }, [captchaType]);

  useEffect(() => {
    if (googleCaptchaVisible && isNew && nowPage === 'signUp') {
      kcsensorsClick(['newSignupRobotTrigger', '1']);
    }
  }, [googleCaptchaVisible, isNew]);

  return (
    <>
      <Captcha />
      <ImageCaptcha
        {...captchInit}
        visible={imageCaptchaVisible}
        imgSrc={imgSrc}
        loading={checkLoading}
        imgRefresh={imgRefresh}
        onSuccess={handleSuccess}
        onClose={handleClose}
      />
    </>
  );
}
export default memo((props) => {
  return (
    <ThemeProvider theme={props.theme || 'light'}>
      <SnackbarProvider>
        <NotificationProvider>
          <HumanCaptcha {...props} />
        </NotificationProvider>
      </SnackbarProvider>
    </ThemeProvider>
  );
});
