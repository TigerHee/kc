/**
 * Owner: tiger@kupotech.com
 */
import React, { memo, useEffect, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { isEmpty, isString, isFunction, omitBy } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from '@tools/i18n';

import GoogleCaptcha from '../GoogleCaptcha';
import GeeTest from '../GeeTest';
import ImageCaptcha from '../ImageCaptcha';
import HCaptcha from '../HCaptcha';

import {
  VALIDATE_MAP,
  recaptchaKey,
  geeTestKey,
  image,
  hCaptchaKey,
  getReCaptchaSitekey,
  MODEL_NAMESPACE,
} from '../../config';

function CommonCaptcha(props = {}) {
  const {
    bizType,
    onValidateSuccess,
    onValidateError,
    open,
    onClose,
    onGoogleCaptchaVisibleChange,
  } = props;
  const {
    googleCaptchaVisible,
    captchaInit = {},
    imageCaptchaVisible = false,
    imgSrc = '',
    checkLoading = false,
  } = useSelector((state) => state[MODEL_NAMESPACE] || {});
  const dispatch = useDispatch();
  const showCaptcha = useMemo(() => open && !isEmpty(bizType), [open, bizType]);
  const { captchaType = 'default', challenge = '' } = captchaInit; // 人机校验初始化数据
  const reCaptchaSitekey = getReCaptchaSitekey(); // 谷歌人机校验 sitekey
  const { i18n } = useTranslation();
  const { language: currentLang } = i18n || {}; // 当前语言

  const handleSuccess = async (response) => {
    try {
      const { captchaType, gt, challenge } = captchaInit;
      const payload = {
        bizType,
        captchaType: VALIDATE_MAP[captchaType],
        secret: gt || challenge,
        response: isString(response) ? response : JSON.stringify(response),
        lang: currentLang,
      };
      // 过滤空值
      const oimtNotNull = omitBy(payload, (item) => {
        if (item === '' || item == null) {
          return true;
        }
        return false;
      });
      await dispatch({
        type: `${MODEL_NAMESPACE}/captchaVerify`,
        payload: oimtNotNull,
      });
      await dispatch({ type: `${MODEL_NAMESPACE}/captchaSuccess` });
      // 成功
      if (onClose && isFunction(onClose)) {
        onClose(captchaType);
      }
      if (onValidateSuccess && isFunction(onValidateSuccess)) {
        onValidateSuccess(captchaType);
      }
    } catch (err) {
      if (captchaType === image) {
        dispatch({
          type: `${MODEL_NAMESPACE}/update`,
          payload: {
            checkLoading: false,
          },
        });
        dispatch({ type: `${MODEL_NAMESPACE}/getImage`, payload: { challenge } });
      } else {
        dispatch({ type: `${MODEL_NAMESPACE}/captchaClose` });
        handleError();
      }
      // 失败
      if (onValidateError && isFunction(onValidateError)) {
        onValidateError(captchaType);
      }
    }
  };

  const handleError = useCallback(() => {
    onClose && typeof onClose === 'function' && onClose(captchaType);
  }, [onClose, captchaType]);

  const handleClose = () => {
    dispatch({ type: `${MODEL_NAMESPACE}/captchaClose`, payload: { MODEL_NAMESPACE } });
    handleError();
  };

  const imgRefresh = () => {
    dispatch({ type: `${MODEL_NAMESPACE}/getImage`, payload: { challenge } });
  };

  const captchaJSX = {
    default: null,
    [geeTestKey]: (
      <GeeTest
        {...captchaInit}
        onSuccess={handleSuccess}
        onClose={handleClose}
        onError={handleError}
      />
    ),
    [recaptchaKey]: (
      <GoogleCaptcha
        {...captchaInit}
        sitekey={reCaptchaSitekey}
        visible={googleCaptchaVisible}
        onSuccess={handleSuccess}
        onClose={handleClose}
      />
    ),
    [image]: (
      <ImageCaptcha
        {...captchaInit}
        visible={imageCaptchaVisible}
        imgSrc={imgSrc}
        loading={checkLoading}
        imgRefresh={imgRefresh}
        onSuccess={handleSuccess}
        onClose={handleClose}
      />
    ),
    [hCaptchaKey]: (
      <HCaptcha
        onVerify={handleSuccess}
        onClose={handleClose}
        captchaInit={captchaInit}
        currentLang={currentLang}
      />
    ),
  };

  useEffect(() => {
    if (open && !isEmpty(bizType)) {
      // 派发初始化
      dispatch({
        type: `${MODEL_NAMESPACE}/captchaInit`,
        payload: {
          bizType,
          handleError,
        },
      });
    } else {
      // 重置
      dispatch({
        type: `${MODEL_NAMESPACE}/captchaClose`,
      });
    }
    return () => {
      dispatch({
        type: `${MODEL_NAMESPACE}/captchaClose`,
      });
    };
  }, [open, bizType, dispatch]);

  useEffect(() => {
    if (onGoogleCaptchaVisibleChange && isFunction(onGoogleCaptchaVisibleChange)) {
      onGoogleCaptchaVisibleChange(googleCaptchaVisible);
    }
  }, [googleCaptchaVisible, onGoogleCaptchaVisibleChange]);

  return showCaptcha ? captchaJSX[captchaType] : null;
}

CommonCaptcha.propTypes = {
  bizType: PropTypes.string.isRequired, // 人机校验初始化查询业务类型
  onValidateSuccess: PropTypes.func.isRequired, // 校验成功回调
  onClose: PropTypes.func.isRequired, // 点击关闭回调
  onValidateError: PropTypes.func, // 校验失败回调
  onGoogleCaptchaVisibleChange: PropTypes.func, // reCaptcha显隐变化回调
};

CommonCaptcha.defaultProps = {
  onValidateError: function onValidateError() {},
  onGoogleCaptchaVisibleChange: () => {},
};

export default memo(CommonCaptcha);
