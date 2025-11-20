/**
 * Owner: gavin.liu1@kupotech.com
 */
import { isNil } from 'lodash';
import { _t } from 'utils/lang';

import Toast from '../../CryptoCup/common/Toast';
import { withEffect } from '../common/withEffect';
import { referFriendExpose } from '../config';

const getErrorCodeLabel = (code) => {
  const defaultLabel = withEffect(
    _t('jHm5FB57PX6z7wTvTP2y9X'),
    () => referFriendExpose(['ResultToast', '6'])
  )
  if (code === '401') {
    return '';
  }
  if (isNil(code)) {
    return defaultLabel;
  }
  const map = {
    400001: defaultLabel,
    // 活动已结束～
    500006: withEffect(
      _t('tL9WZs7PAbR13Mw2Ze2E4n'),
      () => referFriendExpose(['ResultToast', '4'])
    ),
    // 账号可能存在异常
    500007: withEffect(
      _t('53J7yMfGFhHxcSStbVSZDF'),
      () => referFriendExpose(['ResultToast', '5'])
    ),
    // 已经帮好友助力过啦～
    500030: withEffect(
      _t('qZXE3Agvdpr3tNmc9sSeAZ'),
      () => referFriendExpose(['ResultToast', '2'])
    ),
    // 助力次数已达上限～
    500031: withEffect(
      _t('viqGP7eedMcR36cbstBkSM'),
      () => referFriendExpose(['ResultToast', '3'])
    ),
  };
  return map?.[code] || defaultLabel;
};

export const toastError = (err) => {
  let label;
  if (typeof err === 'string' || typeof err === 'number') {
    label = getErrorCodeLabel(err);
  } else {
    label = getErrorCodeLabel(err?.code);
  }

  if (label) {
    Toast(label);
  }
};
