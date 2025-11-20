/**
 * Owner: garuda@kupotech.com
 * 调整杠杆-提示信息
 */
import React from 'react';

import Alert from '@mui/Alert';

import { KuxAlertWrapper } from '../commonStyle';

const LeverageForm = ({ isError }) => {
  return isError ? (
    <KuxAlertWrapper>
      <Alert className="alert-box" showIcon type="error" title={isError} />
    </KuxAlertWrapper>
  ) : null;
};

export default React.memo(LeverageForm);
