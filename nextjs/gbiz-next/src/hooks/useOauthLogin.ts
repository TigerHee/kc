/**
 * Owner: willen@kupotech.com
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import { pull } from 'tools/request';
import { kcsensorsManualTrack } from 'tools/sensors';
import loadScript from 'tools/loadScript';
import { IS_CLIENT_ENV } from 'kc-next/env';

const TELEGRAM_SDK_URL = 'https://telegram.org/js/telegram-widget.js';
const GOOGLE_SDK_URL = 'https://accounts.google.com/gsi/client';
const APPLE_SDK_URL = 'https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js';

const commonSensor = (category: string, resultType: string) => {
  kcsensorsManualTrack({ spm: ['thirdPartyLogin', '1'], data: { category, resultType } }, 'technology_event');
};

interface OauthConfig {
  telegram_domain?: string;
  telegram_robot_id?: string;
  google_domain?: string;
  google_client_id?: string;
  apple_domain?: string;
  apple_client_id?: string;
  apple_redirect_uri?: string;
}

interface TelegramSDK {
  Login: {
    auth: (params: { bot_id: string; method: 'POST' }, callback: (data: any) => void) => void;
  };
}

interface GoogleSDK {
  accounts: {
    id: {
      initialize: (params: { client_id: string; callback: (data: any) => void }) => void;
      prompt: () => void;
      renderButton: (dom: HTMLElement | null, params: { type: 'standard' }) => void;
    };
  };
}

interface AppleIDSDK {
  auth: {
    init: (params: { clientId: string; redirectURI: string; scope: string; usePopup: boolean }) => void;
    signIn: () => Promise<any>;
  };
}

interface OauthOutput {
  oauthConfig: OauthConfig;
  sdkLoading: boolean;
  TELEGRAM?: {
    ready: boolean;
    login: () => Promise<any>;
  };
  GOOGLE?: {
    ready: boolean;
    bind: (params: {
      showPrompt?: boolean;
      renderButtonDom: HTMLElement | null;
      callback: (data: any) => void;
    }) => Promise<void>;
  };
  APPLE?: {
    ready: boolean;
    login: () => Promise<any>;
  };
}

const useOauthLogin = (register: string | undefined): OauthOutput => {
  // 三方登录相关配置（远程下发）
  const [oauthConfig, setOauthConfig] = useState<OauthConfig>({});
  // telegram sdk加载完成标识
  const [telegramReady, setTelegramReady] = useState<boolean | null>(null);
  // google sdk加载完成标识
  const [googleReady, setGoogleReady] = useState<boolean | null>(null);
  // apple sdk加载完成标识
  const [appleReady, setAppleReady] = useState<boolean | null>(null);

  // 查询三方登录配置
  const queryConfig = async () => {
    try {
      const { data } = await pull('/growth-config/get/client/config/codes', {
        businessLine: 'ucenter',
        codes: 'thirdPartyLoginConfig',
      });
      commonSensor('LOAD_OAUTH_CONFIG', 'success');
      setOauthConfig((data?.properties?.[0]?.backupValues || {}) as OauthConfig);
    } catch (e) {
      commonSensor('LOAD_OAUTH_CONFIG', 'failed');
    }
  };
  const queryConfigRef = useRef(queryConfig);
  queryConfigRef.current = queryConfig;

  useEffect(() => {
    queryConfigRef.current();
  }, []);

  // 加载相关JS SDK
  useEffect(() => {
    if (register && IS_CLIENT_ENV) {
      commonSensor('LOAD_SDK_START', 'success');
      const regArr = register.split(',');
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

  const ret = useMemo(() => {
    const sdkLoading =
      (typeof telegramReady === 'boolean' && !telegramReady) ||
      (typeof googleReady === 'boolean' && !googleReady) ||
      (typeof appleReady === 'boolean' && !appleReady);
    if (Object.keys(oauthConfig).length) {
      const outputObj: OauthOutput = { oauthConfig, sdkLoading };
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
                window.Telegram.Login.auth({ bot_id: oauthConfig.telegram_robot_id || '', method: 'POST' }, data => {
                  if (data) {
                    commonSensor('TELEGRAM_RUN_STATUS', 'success');
                    resolve({ code: '200', msg: 'success', data });
                  } else {
                    commonSensor('TELEGRAM_RUN_STATUS', 'failed');
                    reject({ code: '-3', msg: 'login failed' });
                  }
                });
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
                  client_id: oauthConfig.google_client_id || '',
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
                  clientId: oauthConfig.apple_client_id || '',
                  redirectURI: oauthConfig.apple_redirect_uri || '',
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

  return ret;
};

export default useOauthLogin;
