
import JsBridge from "tools/jsBridge";
import { reportAppBridgeResponseError } from './sentry';
import { METHODS, SecVerifyResponse } from "../enums";
import { toast } from "@kux/design";
import { useVerification } from "../components/Verification/model";

export const isInApp = JsBridge.isApp();

const getAppVersion = () =>
  new Promise<string>((resolve, reject) => {
    setTimeout(() => {
      reject(new Error('getAppVersion timeout'));
    }, 2000);
    JsBridge.open(
      {
        type: 'func',
        params: {
          name: 'getAppVersion',
        },
      },
      (params: { data: string }) => {
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
const compareVersion = (v1: string, v2: string): number => {
  const _v1 = v1.split('.');
  const _v2 = v2.split('.');
  const _r = Number(_v1[0]) - Number(_v2[0]);

  return _r === 0 && v1 !== v2
    ? compareVersion(_v1.splice(1).join('.'), _v2.splice(1).join('.'))
    : _r;
};

export const isCompatibleAppVersion = async () => {
  try {
    const appVersion = await getAppVersion();
    return compareVersion(appVersion, '4.1.0') >= 0;
  } catch (error: any) {
    toast.error(error.message);
    return false;
  }
};

/** 低版本（< 4.1.0） app 不支持的验证方式 */
export const UNSUPPORTED_METHODS_LOWER_APP_VERSION: string[] = [
  METHODS.PASSKEY,
];

interface OpenNativeValidationProps {
  bizType: string;
  businessData: Record<string, any>;
  options: { token?: string, address?: string };
  onCancel: () => void;
  onSuccess: (params: SecVerifyResponse) => void;
  onUnavailable: () => void;
}

export const openNativeValidation = async ({
  bizType,
  businessData,
  options,
  onCancel,
  onSuccess,
  onUnavailable,
}: OpenNativeValidationProps) => {
  // app 环境下，需要存 bizType 和 options，后续流程中会使用
  useVerification.setState({ bizType, options });
  JsBridge.open(
    {
      type: 'func',
      params: {
        name: 'openSafeValidation',
        bizType,
        businessData: JSON.stringify({
          ...businessData,
          ...options,
        })
      },
    },
    ({ code, data, msg }) => {
      if (
        // ios 定义的错误码没问题，会在 code 里传回来
        +code === 89788 ||
        // android 定义的错误码会放在 msg 里传回来
        // 历史问题，不敢动，让 H5 这里做兼容处理
        +code === -1 && msg === '89788'
      ) {
        // 安全项不可用的编码，事件交给 web 端处理
        onUnavailable();
      } else if (code !== 0) {
        onCancel();
      } else {
        const { validationToken, sessionId, fingerprintId, isNeedLiveVerify, isNeedSelfService } = data || {};
        if (!validationToken || !sessionId || !fingerprintId) {
          reportAppBridgeResponseError({
            bizType,
            noToken: !validationToken,
            noSession: !sessionId,
            noFingerprint: !fingerprintId,
          });
        }
        onSuccess({
          headers: {
            'X-VALIDATION-TOKEN': validationToken,
            // app 端会多返回 2 个请求头
            'ORIGIN-APP-SESSION-ID': sessionId,
            'ORIGIN-APP-TOKEN-SM': fingerprintId,
          },
          data: {
            isNeedLiveVerify,
            isNeedSelfService,
          },
        });
      }
    },
  );
};