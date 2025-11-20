/**
 * Owner: iron@kupotech.com
 */
import React, { useEffect, useState } from 'react';
import noop from 'lodash/noop';
import { useTranslation } from '@tools/i18n';

import './gt.js';

import { GEE_TEST_LANGS } from './config';

function GeeTest(props = {}) {
  const {
    gt,
    product = 'bind',
    challenge,
    https = true,
    success,
    new_captcha,
    area,
    next_width = '300px',
    bg_color = 'black',
    onSuccess = noop,
    onClose = noop,
    onError = noop,
  } = props;

  const { i18n } = useTranslation();
  const { language } = i18n || {}; // 当前语言
  const currentLang = GEE_TEST_LANGS[language] || 'en'; // geeTest 语言参数

  const { reset, setReset } = useState(false);

  const initGeetest = () => {
    window.initGeetest &&
      window.initGeetest(
        {
          gt,
          lang: currentLang,
          product,
          challenge,
          https,
          new_captcha,
          offline: !success,
          area,
          next_width,
          bg_color,
          api_server: 'api.geevisit.com',
        },
        (captchaObj) => {
          if (product !== 'bind') {
            captchaObj.appendTo('#captchaBox'); // 将验证按钮插入到宿主页面中captchaBox元素内
          }
          captchaObj
            .onReady(() => {
              captchaObj.verify();
            })
            .onSuccess(() => {
              onSuccess(captchaObj.getValidate());
            })
            .onClose(() => {
              onClose();
              captchaObj.reset();
              captchaObj.destroy();
            })
            .onError((error) => {
              onError();
              if (error.code === 'error_12') {
                // 极验错误后应重置，可再次唤起极验
                setReset(true);
              } else {
                captchaObj.reset();
                captchaObj.destroy();
              }
            });
        },
      );
  };

  useEffect(() => {
    if (gt || reset) {
      initGeetest();
    }
  }, [gt, reset]);

  return <div id="captchaBox" />;
}

export default GeeTest;
