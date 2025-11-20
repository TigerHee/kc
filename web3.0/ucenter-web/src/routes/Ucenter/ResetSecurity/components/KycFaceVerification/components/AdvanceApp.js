import JsBridge from '@knb/native-bridge';
import { useEffect } from 'react';
import { getAdvanceToken } from 'src/services/kyc';
import ExLoading from '../../ExLoading';

export default function AdvanceApp({ token, onSuccess, onFail }) {
  useEffect(async () => {
    const livenessData = await getAdvanceToken({ token });
    const advanceToken = livenessData?.data?.advanceConfig?.license;
    JsBridge.open(
      {
        type: 'func',
        params: {
          name: 'faceRecognition',
          channel: 'advance',
          advanceToken,
        },
      },
      (res) => {
        const { data, code, msg } = res || {};
        const advanceLivenessId = data?.advanceLivenessId;
        // code: 0成功拿到人脸识别照， -1失败
        if (code === 0) {
          onSuccess(advanceLivenessId);
        } else {
          onFail();
        }
      },
    );
  }, []);

  return <ExLoading loading={true} />;
}
