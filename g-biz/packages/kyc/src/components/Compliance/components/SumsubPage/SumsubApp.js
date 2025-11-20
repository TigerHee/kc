/**
 * Owner: tiger@kupotech.com
 */
import { useEffect } from 'react';
import { isString } from 'lodash';
import { useSnackbar } from '@kux/mui';
import JsBridge from '@tools/bridge';
import { Wrapper, StyledSpin } from '@kycCompliance/components/commonStyle';

export default ({ loading, sumsubToken, sumsubRegionCode, idDocType, onNext, onPrePage }) => {
  const { message } = useSnackbar();

  // app回调
  const onAppCallback = (v) => {
    const { msg, code, data } = v;
    // 成功
    if (code === 0) {
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
    if (!loading && sumsubToken) {
      const data = {
        token: sumsubToken,
        country: sumsubRegionCode,
        idDocType,
      };

      JsBridge.open(
        {
          type: 'func',
          params: {
            name: 'openAdvancedCertification',
            channel: 'sumsub',
            data: JSON.stringify(data),
          },
        },
        onAppCallback,
      );
    }
  }, [loading, sumsubToken, sumsubRegionCode, idDocType]);

  return (
    <Wrapper>
      <StyledSpin spinning={loading} size="large" />
    </Wrapper>
  );
};
