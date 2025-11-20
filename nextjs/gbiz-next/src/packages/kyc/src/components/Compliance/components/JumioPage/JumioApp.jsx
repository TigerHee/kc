/**
 * Owner: tiger@kupotech.com
 */
import { useEffect, useState } from 'react';
import { isObject, isString } from 'lodash-es';
import { useSnackbar } from '@kux/mui';
import JsBridge from 'tools/jsBridge';
import { kcsensorsManualTrack } from 'packages/kyc/src/common/tools';
import { tenantConfig } from 'packages/kyc/src/config/tenant';
import { onAppsFlyerTrack, getIsSupportNfc } from 'kycCompliance/config';
import { Wrapper, StyledSpin } from '../commonStyle';
import useCommonData from '../../hooks/useCommonData';
import NFCNotSupport from '../NFCNotSupport';

export default ({ loading, jumioToken, jumioDataCenter, onNext, onPrePage, isJumioNfcAuth }) => {
  const { message } = useSnackbar();
  const { setOcrData, flowData } = useCommonData();
  const [isCanNFC, setCanNFC] = useState(true);

  // app回调
  const onAppCallback = (v) => {
    const { msg, code, data } = v;

    // 成功
    if (code === 0) {
      try {
        if (data && isObject(data)) {
          setOcrData(data);
        }
      } catch (error) {
        console.info('error === ', error);
      }

      // 泰国站加埋点
      kcsensorsManualTrack('page_click', [], {
        spm_id: 'kcWeb.B1KYCLifenessComplete.nextButton.1',
        kyc_standard: flowData.complianceStandardAlias,
      });
      if (tenantConfig.compliance.af_key_liveness_completed) {
        onAppsFlyerTrack(tenantConfig.compliance.af_key_liveness_completed);
      }

      onNext();
      return;
    }

    onPrePage();
    const errMsg = msg || (isString(data) ? data : '');
    if (errMsg) {
      message.error(errMsg);
    }
  };

  useEffect(() => {
    if (!loading && jumioToken && jumioDataCenter) {
      const onStartJumio = () => {
        const data = {
          token: jumioToken,
          dataCenter: jumioDataCenter,
          needNFC: Boolean(isJumioNfcAuth),
        };

        JsBridge.open(
          {
            type: 'func',
            params: {
              name: 'openAdvancedCertification',
              channel: 'jumio',
              data: JSON.stringify(data),
            },
          },
          onAppCallback,
        );
      };

      const onInit = async () => {
        if (isJumioNfcAuth) {
          const isSupportNfc = await getIsSupportNfc();
          if (isSupportNfc) {
            onStartJumio();
          } else {
            setCanNFC(false);
          }
        } else {
          onStartJumio();
        }
      };

      onInit();
    }
  }, [loading, jumioToken, jumioDataCenter, isJumioNfcAuth]);

  return (
    <Wrapper>
      <StyledSpin spinning={loading} size="small" />
      {!isCanNFC && <NFCNotSupport />}
    </Wrapper>
  );
};
