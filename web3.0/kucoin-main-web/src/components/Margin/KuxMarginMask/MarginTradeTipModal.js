/**
 * Owner: Ray.Lee@kupotech.com
 */

import React, { memo } from 'react';
import { Dialog } from '@kux/mui';
import { _t } from 'src/tools/i18n';

/**
 * MarginTradeTipModal
 * 开启您的杠杆交易之旅 提示弹窗
 */
const MarginTradeTipModal = memo((props) => {
  const { open, ...restProps } = props;
  return (
    <Dialog
      open={open}
      size="basic"
      cancelText={_t('hq2AyTKuJR6uKyN9aJzPBD')}
      okText={_t('aRnwMHDubSc6mibmLEjnqK')}
      title={_t('r4BhZCnqqPejnc83cA8BpG')}
      {...restProps}
    >
      {_t('3zVcf47cgrTj43PNw2gP3c')}
    </Dialog>
  );
});

export default MarginTradeTipModal;
