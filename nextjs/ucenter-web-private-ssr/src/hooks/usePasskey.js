/**
 * Owner: eli.xiang@kupotech.com
 */
import { useMemo, useState } from 'react';

import { createExtended, parseExtendedCreationOptionsFromJSON } from 'utils/webauthn-json';

import { getPasskeyRegisterOptionsApi, passkeyRegisterApi } from 'services/ucenter/passkey';
import { sentryReport } from '@/core/telemetryModule';

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

export const PasskeyRegisterStatus = {
  READY: 1,
  LOADING: 2,
  SUCCESS: 3,
  ERROR: 4,
};

export default function usePasskeyLogin() {
  const [currentPasskeyStatus, setCurrentPasskeyStatus] = useState(PasskeyRegisterStatus.READY);
  const passkeyRegister = async (verifyResult) => {
    console.log('passkeyRegister verifyResult:', verifyResult);
    try {
      setCurrentPasskeyStatus(PasskeyRegisterStatus.LOADING);
      const optionsRes = await getPasskeyRegisterOptionsApi();
      const optionsResData = JSON.parse(optionsRes?.data);
      if (optionsResData) {
        console.log('optionsRes optionsRes:', optionsRes);
        const publicKey = { ...optionsResData };
        console.log('publicKey 1111:', publicKey);
        const cco = parseExtendedCreationOptionsFromJSON({
          publicKey: { ...optionsResData },
        });
        console.log('create cco:', cco);
        const createRes = await createExtended(cco);
        console.log('create res:', createRes);
        const webPasskeyRes = createRes?.toJSON();

        console.log('create res.toJSON():', webPasskeyRes);
        if (webPasskeyRes) {
          const webPasskeyResJsonString = JSON.stringify(webPasskeyRes);
          const passkeyRegisterRes = await passkeyRegisterApi(
            {
              credentialResponse: webPasskeyResJsonString,
            },
            verifyResult?.headers,
          );
          console.log('passkeyRegisterRes:', passkeyRegisterRes);
          setCurrentPasskeyStatus(PasskeyRegisterStatus.SUCCESS);
        }
      } else {
        setCurrentPasskeyStatus(PasskeyRegisterStatus.ERROR);
      }
    } catch (error) {
      sentryReport({
        level: 'warning',
        message: `passkey create error: ${error?.message}`,
        tags: {
          errorType: 'passkey_create_error',
        },
      });
      console.error('error in register passkey:', error);
      setCurrentPasskeyStatus(PasskeyRegisterStatus.ERROR);
    }
  };

  const loading = useMemo(() => {
    return currentPasskeyStatus === PasskeyRegisterStatus.LOADING;
  }, [currentPasskeyStatus]);

  return {
    currentPasskeyStatus,
    loading,
    passkeyRegister,
  };
}
