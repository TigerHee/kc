/**
 * Owner: vijay.zhou@kupotech.com
 */
import ReactDOM from 'react-dom';
import JsBridge from '@tools/bridge';
import SecurityVerifyModal from '../components/SecurityVerifyModal';
import getPreVerifyResult from './getPreVerifyResult';
import withProvider from './withProvider';
import * as sensors from './sensors';
import { METHODS } from '../constants';
import { reportAppBridgeError, reportAppBridgeResponseError } from './sentry';

const isInApp = JsBridge.isApp();

const getAppVersion = () =>
  new Promise((resolve) => {
    JsBridge.open(
      {
        type: 'func',
        params: {
          name: 'getAppVersion',
        },
      },
      (params) => {
        resolve(params.data);
      },
    );
  });

/**
 * 判断两个版本字符串的大小
 * @param  {string} v1 原始版本
 * @param  {string} v2 目标版本
 * @return {number} 如果原始版本大于目标版本，则返回大于0的数值, 如果原始小于目标版本则返回小于0的数值。
 */
const compareVersion = (v1, v2) => {
  const _v1 = v1.split('.');
  const _v2 = v2.split('.');
  const _r = _v1[0] - _v2[0];

  return _r === 0 && v1 !== v2
    ? compareVersion(_v1.splice(1).join('.'), _v2.splice(1).join('.'))
    : _r;
};
/**
 *
 * @param bizType 业务场景枚举，业务方提供
 * @param theme 主题模式，不传默认白天
 */
export default async function goVerify({
  bizType,
  businessData = {},
  theme = 'light',
  errorRender,
}) {
  let permitValidateType;
  if (isInApp) {
    const appVersion = await getAppVersion();
    if (compareVersion(appVersion, '4.1.0') >= 0) {
      return new Promise((resolve, reject) => {
        try {
          JsBridge.open(
            {
              type: 'func',
              params: {
                name: 'openSafeValidation',
                bizType,
                businessData: JSON.stringify(businessData),
              },
            },
            ({ code, data }) => {
              if (code !== 0) {
                resolve(null);
              } else {
                const { validationToken, sessionId, fingerprintId } = data || {};
                if (!validationToken || !sessionId || !fingerprintId) {
                  reportAppBridgeResponseError({
                    bizType,
                    noToken: !validationToken,
                    noSession: !sessionId,
                    noFingerprint: !fingerprintId,
                  });
                }
                resolve({
                  headers: {
                    'X-VALIDATION-TOKEN': validationToken,
                    // app 端会多返回 2 个请求头
                    'ORIGIN-APP-SESSION-ID': sessionId,
                    'ORIGIN-APP-TOKEN-SM': fingerprintId,
                  },
                });
              }
            },
          );
        } catch (err) {
          reportAppBridgeError({ bizType, msg: err?.msg ?? err?.message });
          reject(err);
        }
      });
    }
    permitValidateType = [
      METHODS.EMAIL,
      METHODS.SMS,
      METHODS.WITHDRAW_PASSWORD,
      METHODS.GOOGLE_2FA,
    ];
  }
  sensors.initialized({ bizType });
  const container = document.createElement('div');
  container.setAttribute('data-testid', 'security-verify-modal-root');
  const { error, needVerify, token, transactionId, methods, supplement } = await getPreVerifyResult(
    bizType,
    businessData,
    permitValidateType,
  );

  if (!needVerify && token) {
    sensors.noVerify({ bizType, transactionId });
    return { headers: { 'X-VALIDATION-TOKEN': token } };
  }

  // 需要渲染弹窗时，才把 container 添加到dom
  document.body.append(container);

  return new Promise((resolve) => {
    const handleDestroy = () => {
      ReactDOM.unmountComponentAtNode(container);
      container.remove();
    };
    const Modal = withProvider(SecurityVerifyModal, { theme });
    ReactDOM.render(
      <Modal
        bizType={bizType}
        transactionId={transactionId}
        error={error}
        methods={methods}
        supplement={supplement}
        errorRender={errorRender}
        onSuccess={(token) =>
          resolve(
            token
              ? {
                  headers: {
                    'X-VALIDATION-TOKEN': token,
                  },
                }
              : null,
          )
        }
        onDestroy={handleDestroy}
      />,
      container,
    );
  }).catch((err) => {
    console.error(err);
  });
}
