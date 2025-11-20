/**
 * Owner: mike@kupotech.com
 */
import React from 'react';
import DialogRef from 'Bot/components/Common/DialogRef';
import { _t } from 'Bot/utils/lang';

export default (onOk) => {
  return DialogRef.info({
    title: _t('closechoosedialog1'),
    content: <p>{_t('clsgrid.notOpentoclose')}</p>,
    cancelText: _t('cancel'),
    okText: _t('confirm'),
    onOk,
    maskClosable: true,
    size: 'medium',
  });
};
