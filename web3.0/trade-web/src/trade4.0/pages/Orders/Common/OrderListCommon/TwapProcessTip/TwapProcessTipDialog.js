/*
 * Owner: harry.lai@kupotech.com
 * @Author: harry.lai harry.lai@kupotech.com
 * @Date: 2024-05-13 19:59:43
 * @LastEditors: harry.lai harry.lai@kupotech.com
 * @LastEditTime: 2024-05-14 18:26:45
 * @FilePath: /kucoin-main-web/src/routes/OrderPage/components/TwapProcessTip/Dialog.js
 */
import React, { memo } from 'react';
import { Dialog } from '@kux/mui';
import { _t } from 'utils/lang';
import { TIP_TEXT_STATUS_MAP } from './constants';
import { convertSecondsToHMS } from '../../presenter/time-util';

const TwapProcessTipDialog = (props) => {
  const { status, usedDurationSec, visible, toggle } = props;
  const [hour, min, sec] = convertSecondsToHMS(usedDurationSec);


  return (
    <Dialog
      open={visible}
      onCancel={toggle}
      onOk={toggle}
      size="basic"
      cancelText=""
      okText={_t('ujNoFGRzi475x6ADnkkquG')}
      title={TIP_TEXT_STATUS_MAP[status]}
    >
      <span>
        {' '}
        {_t('8JsG3EXdtVjxEiSpw9LcCh', {
          hour,
          min,
          sec,
        })}
      </span>
    </Dialog>
  );
};

export default memo(TwapProcessTipDialog);
