/**
 * Owner: eli.xiang@kupotech.com
 */
import { useState, useCallback } from 'react';
import {
  // base64UrlToBase64,
  // createExtended,
  getExtended,
  // parseExtendedCreationOptionsFromJSON,
  parseExtendedRequestOptionsFromJSON,
} from '../common/webauthn-json';
import { sentryReport } from '../common/tools';

import { startAssertionUsingGet1, passLoginUsingPost } from '../api/ucenter'

// function base64ToJson(base64UrlStr) {
//   try {
//     const base64String = base64UrlToBase64(base64UrlStr);
//     const decodedString = atob(base64String);
//     // 解析 JSON
//     const jsonObject = JSON.parse(decodedString);
//     return jsonObject;
//   } catch (error) {
//     console.log('convert base64string to json error:', error);
//     return '';
//   }
// }

export const PasskeyLoginStatus = {
  READY: 1,
  LOADING: 2,
  SUCCESS: 3,
  ERROR: 4,
};

export default function usePasskeyLogin() {
  const [currentPasskeyStatus, setCurrentPasskeyStatus] = useState(PasskeyLoginStatus.READY);

  const passkeyAuth = useCallback(async (account: { account?: string } = {}) => {
    try {
      const authnOptions = await startAssertionUsingGet1(account);
      const authnData = JSON.parse(authnOptions?.data || '{}');
      if (account?.account && !authnData?.allowCredentials?.length) {
        // 输入了账号，接口未返回 allowCredentials ，认为该账号未注册passkey，中断passkey登录流程
        return null;
      }
      // console.log('account', account);
      // console.log('authnData:', authnData);
      setCurrentPasskeyStatus(PasskeyLoginStatus.LOADING);
      const request = {
        publicKey: { ...authnData },
      };
      const cco = parseExtendedRequestOptionsFromJSON(request);
      const res = await getExtended(cco);
      const jsonRes = res.toJSON();
      if (jsonRes) {
        const credentialResponse = JSON.stringify(jsonRes);
        // console.log('credentialResponse:', credentialResponse);
        const passkeyLoginRes = await passLoginUsingPost({ credentialResponse });
        // console.log('passkeyLoginRes:', passkeyLoginRes);
        setCurrentPasskeyStatus(PasskeyLoginStatus.SUCCESS);
        return passkeyLoginRes;
      }
    } catch (error: any) {
      console.log('passkey login Auth error:', error);
      sentryReport({
        level: 'warning',
        message: `passkey login error: ${error?.message}`,
        tags: {
          errorType: 'passkey_login_error',
        },
      });
      setCurrentPasskeyStatus(PasskeyLoginStatus.ERROR);
    }
  }, []);

  return {
    currentPasskeyStatus,
    passkeyAuth,
  };
}
