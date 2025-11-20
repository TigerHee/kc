/**
 * Owner: borden@kupotech.com
 */
import React, { useEffect, memo } from 'react';
import Spin from '@mui/Spin';

import Html from '@/components/Html';
import { _t } from 'utils/lang';
import { DialogWrapper } from './style';

/**
 * 答题协议
 */
const DialogAgreement = (props) => {
  const { title, agreementContent, agreementApi, agreementApiLoading, ...restProps } = props;

  useEffect(() => {
    agreementApi && agreementApi();
  }, []);

  return (
    <DialogWrapper
      okText={_t('confirmed')}
      title={title}
      size="large"
      cancelText=""
      maxWidth="lg"
      okButtonProps={{
        fullWidth: true,
      }}
      {...restProps}
    >
      <Spin spinning={agreementApiLoading}>
        <div>
          <Html>{agreementContent}</Html>
        </div>
      </Spin>
    </DialogWrapper>
  );
};

export default memo(DialogAgreement);
