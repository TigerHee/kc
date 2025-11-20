/**
 * Owner: Ray.Lee@kupotech.com
 */
import React, { memo } from 'react';
import Alert from '@mui/Alert';
import { _t } from 'utils/lang';

/**
 * NoBalance
 * 没有资产时展示，固定文案
 */
const NoBalance = (props) => {
  const { ...restProps } = props;
  return (
    <Alert
      showIcon
      type="warning"
      title={_t('bZpA9FqeqBX2TAXdUVmoPP')}
      size="small"
      style={{ marginTop: '8px' }}
      {...restProps}
    />
  );
};

export default memo(NoBalance);
