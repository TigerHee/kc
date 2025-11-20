/**
 * Owner: tiger@kupotech.com
 */
import React, { useEffect, useState } from 'react';
import noop from 'lodash-es/noop';
import * as Sentry from '@sentry/nextjs';
import { useTranslation } from 'tools/i18n';
import { GEE_TEST_LANGS } from './config';

interface GeeTestProps {
  gt?: string;
  product?: string;
  challenge?: string;
  https?: boolean;
  success?: boolean;
  new_captcha?: boolean;
  area?: string;
  next_width?: string;
  bg_color?: string;
  onSuccess?: (validate: any) => void;
  onClose?: () => void;
  onError?: () => void;
}

declare global {
  interface Window {
    initGeetest?: (config: any, callback: (captchaObj: any) => void) => void;
  }
}

const sentryReport = (opt: Sentry.Event) => {
  try {
    Sentry.captureEvent?.(opt);
  } catch (e) {
    console.log(e);
  }
};

const GeeTest: React.FC<GeeTestProps> = ({
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
}) => {
  const { i18n } = useTranslation('captcha');
  const currentLang = GEE_TEST_LANGS[i18n?.language] || 'en';
  const [reset, setReset] = useState(false);

  useEffect(() => {
    if (!gt && !reset) return;

    import('./gt.js').then(module => {
      if (!module || !module.default) {
        sentryReport({
          level: 'error',
          message: `geetest import gt.js error ${gt}`,
          tags: {
            errorType: 'geetest_import_error',
          },
        });
        onError?.();
        return;
      }
      const initGeetest = module.default();
      if (!initGeetest) {
        sentryReport({
          level: 'error',
          message: `geetest initGeetest error ${gt}`,
          tags: {
            errorType: 'geetest_init_error',
          },
        });
        onError?.();
        return;
      }

      initGeetest(
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
        captchaObj => {
          if (product !== 'bind') {
            captchaObj.appendTo('#captchaBox');
          }

          captchaObj
            .onReady(() => captchaObj.verify())
            .onSuccess(() => onSuccess?.(captchaObj.getValidate()))
            .onClose(() => {
              onClose?.();
              captchaObj.reset?.();
              captchaObj.destroy?.();
            })
            .onError((error: any) => {
              onError?.();
              if (error.code === 'error_12') {
                setReset(true);
              } else {
                captchaObj.reset?.();
                captchaObj.destroy?.();
              }
            });
        }
      );
    });
  }, [gt, reset]);

  return <div id="captchaBox" />;
};

export default GeeTest;
