/**
 * Owner: willen@kupotech.com
 */
import { useEffect, useMemo, useState } from 'react';
import { get } from '@tools/request';
import { kcsensorsManualTrack } from '@utils/sensors';

const TELEGRAM_SDK_URL = 'https://telegram.org/js/telegram-widget.js';
const GOOGLE_SDK_URL = 'https://accounts.google.com/gsi/client';
const APPLE_SDK_URL =
  'https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js';

const commonSensor = (category, resultType) => {
  kcsensorsManualTrack(
    { spm: ['thirdPartyLogin', '1'], data: { category, resultType } },
    'technology_event',
  );
};

const useOauthLogin = (register) => {
  // 三方登录相关配置（远程下发）
  const [oauthConfig, setOauthConfig] = useState({});
  // telegram sdk加载完成标识
  const [telegramReady, setTelegramReady] = useState(null);
  // google sdk加载完成标识
  const [googleReady, setGoogleReady] = useState(null);
  // apple sdk加载完成标识
  const [appleReady, setAppleReady] = useState(null);

  // 查询三方登录配置
  const queryConfig = async () => {
    try {
      const { data } = await get('/growth-config/get/client/config/codes', {
        businessLine: 'ucenter',
        codes: 'thirdPartyLoginConfig',
      });
      commonSensor('LOAD_OAUTH_CONFIG', 'success');
      setOauthConfig(data?.properties?.[0]?.backupValues || {});
    } catch (e) {
      commonSensor('LOAD_OAUTH_CONFIG', 'failed');
    }
  };

  // 加载相关JS SDK
  useEffect(() => {
    if (register) {
      commonSensor('LOAD_SDK_START', 'success');
      const regArr = register.split(',');
      queryConfig();
      // 加载 telegram sdk
      if (regArr.includes('TELEGRAM')) {
        setTelegramReady(false);
        const script = document.createElement('script');
        const dom = document.createElement('div');
        dom.id = 'telegram_login_container';
        script.src = TELEGRAM_SDK_URL;
        script.async = true;
        script.setAttribute('data-request-access', 'write');
        dom.style.display = 'none';
        dom.appendChild(script);
        document.body.appendChild(dom);
        script.onload = () => {
          commonSensor('LOAD_TELEGRAM', 'success');
          setTelegramReady(true);
        };
        script.onerror = () => {
          commonSensor('LOAD_TELEGRAM', 'failed');
          setTelegramReady(true);
        };
      }
      // 加载 google sdk
      if (regArr.includes('GOOGLE')) {
        setGoogleReady(false);
        const script = document.createElement('script');
        script.src = GOOGLE_SDK_URL;
        script.async = true;
        document.body.appendChild(script);
        script.onload = () => {
          commonSensor('LOAD_GOOGLE', 'success');
          setGoogleReady(true);
        };
        script.onerror = () => {
          commonSensor('LOAD_GOOGLE', 'failed');
          setGoogleReady(true);
        };
      }
      // 加载 apple sdk
      if (regArr.includes('APPLE')) {
        setAppleReady(false);
        (async () => {
          if (window?.System?.import) {
            // 使用systemjs加载
            try {
              window.AppleID = await window.System.import(APPLE_SDK_URL);
              commonSensor('LOAD_APPLE', 'success');
            } catch (e) {
              commonSensor('LOAD_APPLE', 'failed');
            } finally {
              setAppleReady(true);
            }
          } else {
            const script = document.createElement('script');
            script.src = APPLE_SDK_URL;
            script.async = true;
            document.body.appendChild(script);
            script.onload = () => {
              commonSensor('LOAD_APPLE', 'success');
              setAppleReady(true);
            };
            script.onerror = () => {
              commonSensor('LOAD_APPLE', 'failed');
              setAppleReady(true);
            };
          }
        })();
      }
    }
  }, [register]);

  return useMemo(() => {
    const sdkLoading =
      (typeof telegramReady === 'boolean' && !telegramReady) ||
      (typeof googleReady === 'boolean' && !googleReady) ||
      (typeof appleReady === 'boolean' && !appleReady);
    if (Object.keys(oauthConfig).length) {
      const outputObj = { oauthConfig, sdkLoading };
      if (telegramReady) {
        outputObj.TELEGRAM = {
          ready: !!(oauthConfig?.telegram_domain === window.location.host && window.Telegram),
          login: () => {
            return new Promise((resolve, reject) => {
              // sdk未加完成
              if (!window.Telegram) {
                commonSensor('TELEGRAM_RUN_STATUS', 'notLoaded');
                reject({ code: '-1', msg: 'sdk not loaded' });
              }
              // 当前domain不匹配
              else if (oauthConfig.telegram_domain !== window.location.host) {
                commonSensor('TELEGRAM_RUN_STATUS', 'notAllow');
                reject({ code: '-2', msg: 'domain is not allow' });
              } else {
                // 唤起Telegram登录框
                window.Telegram.Login.auth(
                  { bot_id: oauthConfig.telegram_robot_id, method: 'POST' },
                  (data) => {
                    if (data) {
                      commonSensor('TELEGRAM_RUN_STATUS', 'success');
                      resolve({ code: '200', msg: 'success', data });
                    } else {
                      commonSensor('TELEGRAM_RUN_STATUS', 'failed');
                      reject({ code: '-3', msg: 'login failed' });
                    }
                  },
                );
              }
            });
          },
        };
      }
      if (googleReady) {
        outputObj.GOOGLE = {
          ready: !!(oauthConfig?.google_domain === window.location.host && window.google),
          bind: ({ showPrompt, renderButtonDom, callback }) => {
            return new Promise((resolve, reject) => {
              // sdk未加完成
              if (!window.google) {
                commonSensor('GOOGLE_RUN_STATUS', 'notLoaded');
                reject({ code: '-1', msg: 'sdk not loaded' });
              }
              // 当前domain不匹配
              else if (oauthConfig.google_domain !== window.location.host) {
                commonSensor('GOOGLE_RUN_STATUS', 'notAllow');
                reject({ code: '-2', msg: 'domain is not allow' });
              } else {
                window.google.accounts.id.initialize({
                  client_id: oauthConfig.google_client_id,
                  callback(data) {
                    commonSensor('GOOGLE_RUN_STATUS', 'success');
                    callback({ code: '200', msg: 'success', data });
                  },
                });
                if (showPrompt) {
                  // 主动提示（页面右上角Google登录提示）
                  window.google.accounts.id.prompt();
                }
                if (renderButtonDom) {
                  // 绑定google登录按钮
                  window.google.accounts.id.renderButton(renderButtonDom, { type: 'standard' });
                }
                resolve();
              }
            });
          },
        };
      }
      if (appleReady) {
        outputObj.APPLE = {
          ready: !!(oauthConfig?.apple_domain === window.location.host && window.AppleID),
          login: () => {
            return new Promise((resolve, reject) => {
              // sdk未加完成
              if (!window.AppleID) {
                commonSensor('APPLE_RUN_STATUS', 'notLoaded');
                reject({ code: '-1', msg: 'sdk not loaded' });
              }
              // 当前domain不匹配
              else if (oauthConfig.apple_domain !== window.location.host) {
                commonSensor('APPLE_RUN_STATUS', 'notAllow');
                reject({ code: '-2', msg: 'domain is not allow' });
              } else {
                window.AppleID?.auth?.init({
                  clientId: oauthConfig.apple_client_id,
                  redirectURI: oauthConfig.apple_redirect_uri,
                  scope: 'name email',
                  usePopup: true,
                });
                try {
                  // 唤起Apple登录框
                  (async () => {
                    const data = await window.AppleID?.auth?.signIn?.();
                    commonSensor('APPLE_RUN_STATUS', 'success');
                    resolve({ code: '200', msg: 'success', data });
                  })();
                } catch (e) {
                  commonSensor('APPLE_RUN_STATUS', 'failed');
                  reject({ code: '-3', msg: 'login failed', e });
                }
              }
            });
          },
        };
      }
      return outputObj;
    }
    return { oauthConfig: {}, sdkLoading };
  }, [oauthConfig, telegramReady, googleReady, appleReady]);
};

export default useOauthLogin;
