/**
 * Owner: tiger@kupotech.com
 */
import React, { memo, useEffect, useMemo, useCallback } from 'react';
import { isEmpty, isString, omitBy } from 'lodash-es';
import { useSnackbar } from '@kux/mui-next';
import { useTranslation } from 'tools/i18n';
import { useCaptchaStore } from '../../model';

import GoogleCaptcha from '../GoogleCaptcha';
import GeeTest from '../GeeTest';
import ImageCaptcha from '../ImageCaptcha';
import HCaptcha from '../HCaptcha';

import { VALIDATE_MAP, recaptchaKey, geeTestKey, image, hCaptchaKey, getReCaptchaSitekey } from '../../config';

export interface CommonCaptchaProps {
  bizType: string;
  onValidateSuccess: (type: string) => void;
  onClose?: (type?: string) => void;
  onValidateError?: (type: string) => void;
  onGoogleCaptchaVisibleChange?: (visible: boolean) => void;
  open?: boolean;
  [key: string]: any; // 允许透传额外 props
}

const CommonCaptcha: React.FC<CommonCaptchaProps> = ({
  bizType,
  onValidateSuccess,
  onClose,
  onValidateError = () => {},
  onGoogleCaptchaVisibleChange = () => {},
  open = false,
  ...restProps
}) => {
  const { message } = useSnackbar();

  const googleCaptchaVisible = useCaptchaStore(state => state.googleCaptchaVisible);
  const captchaInit = useCaptchaStore(state => state.captchaInit);
  const imageCaptchaVisible = useCaptchaStore(state => state.imageCaptchaVisible);
  const imgSrc = useCaptchaStore(state => state.imgSrc);
  const checkLoading = useCaptchaStore(state => state.checkLoading);
  const captchaVerify = useCaptchaStore(state => state.captchaVerify);
  const captchaSuccess = useCaptchaStore(state => state.captchaSuccess);
  const captchaClose = useCaptchaStore(state => state.captchaClose);
  const initCaptcha = useCaptchaStore(state => state.initCaptcha);
  const getImage = useCaptchaStore(state => state.getImage);
  const update = useCaptchaStore(state => state.update);

  const showCaptcha = useMemo(() => open && !isEmpty(bizType), [open, bizType]);

  const { captchaType = 'default', challenge = '', gt = '' } = captchaInit || {};
  const reCaptchaSitekey = getReCaptchaSitekey();

  const { i18n } = useTranslation('captcha');
  const { language: currentLang } = i18n || {};

  const handleSuccess = async (response: any) => {
    try {
      const payload = {
        bizType,
        captchaType: VALIDATE_MAP[captchaType],
        secret: gt || challenge,
        response: isString(response) ? response : JSON.stringify(response),
        lang: currentLang,
      };
      const payloadCleaned = omitBy(payload, item => item === '' || item == null);
      await captchaVerify?.(payloadCleaned);
      await captchaSuccess?.();

      onClose?.(captchaType);
      onValidateSuccess?.(captchaType);
    } catch (error) {
      const err = error as { msg?: string };
      if (captchaType === image) {
        update?.({ checkLoading: false });
        await getImage?.({ challenge });
      } else {
        captchaClose?.();
        handleError();
        if (err.msg) {
          message.error(err.msg);
        }
      }

      onValidateError?.(captchaType);
    }
  };

  const handleError = useCallback(() => {
    onClose?.(captchaType);
  }, [onClose, captchaType]);

  const handleClose = () => {
    captchaClose?.();
    handleError();
  };

  const imgRefresh = () => {
    getImage?.({ challenge });
  };
  const captchaJSX: Record<string, React.ReactNode> = {
    default: null,
    [geeTestKey]: (
      <GeeTest {...captchaInit} onSuccess={handleSuccess} onClose={handleClose} onError={handleError} {...restProps} />
    ),
    [recaptchaKey]: (
      <GoogleCaptcha
        {...captchaInit}
        sitekey={reCaptchaSitekey}
        visible={googleCaptchaVisible || false}
        onSuccess={handleSuccess}
        onClose={handleClose}
        {...restProps}
      />
    ),
    [image]: (
      <ImageCaptcha
        {...captchaInit}
        visible={imageCaptchaVisible || false}
        imgSrc={imgSrc}
        loading={checkLoading}
        imgRefresh={imgRefresh}
        onSuccess={handleSuccess}
        onClose={handleClose}
        {...restProps}
      />
    ),
    [hCaptchaKey]: <HCaptcha onVerify={handleSuccess} onClose={handleClose} captchaInit={captchaInit} {...restProps} />,
  };

  useEffect(() => {
    if (open && !isEmpty(bizType)) {
      initCaptcha?.({ bizType, handleError });
    } else {
      captchaClose?.();
    }

    return () => {
      captchaClose?.();
    };
  }, [open, bizType]);

  useEffect(() => {
    onGoogleCaptchaVisibleChange?.(googleCaptchaVisible || false  );
  }, [googleCaptchaVisible, onGoogleCaptchaVisibleChange]);

  return showCaptcha ? <>{captchaJSX[captchaType]}</> : null;
};

export default memo(CommonCaptcha);
