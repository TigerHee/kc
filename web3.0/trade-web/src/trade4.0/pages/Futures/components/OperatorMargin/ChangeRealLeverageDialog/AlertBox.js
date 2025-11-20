/**
 * Owner: garuda@kupotech.com
 * 调整真实杠杆-提示信息
 */
import React, { useMemo } from 'react';

import { _t } from 'utils/lang';
import {
  // multiply,
  greaterThanOrEqualTo,
} from 'utils/operation';

import KuxAlert from '@mui/Alert';

import { styled } from '@/style/emotion';


const AlertBox = styled.div`
  // margin-top: 12px;
  width: 100%;
`;

const Alert = styled(KuxAlert)`
  margin-top: 12px;
  .KuxAlert-icon {
    padding-left: 0 !important;
    padding-right: 8px !important;
  }
`;

const LeverageForm = ({ isError, leverage }) => {
  // 这里固定超过 10X 展示 warning 消息
  const isWarning = useMemo(() => {
    if (greaterThanOrEqualTo(leverage)(10)) {
      return true;
    }
    return false;
  }, [leverage]);

  return (
    <AlertBox>
      {isError ? <Alert className="alert-box" showIcon type="error" title={isError} /> : null}
      {isWarning ? (
        <Alert className="alert-box" showIcon type="warning" title={_t('high.leverage.tips')} />
      ) : null}
    </AlertBox>
  );
};

export default React.memo(LeverageForm);
