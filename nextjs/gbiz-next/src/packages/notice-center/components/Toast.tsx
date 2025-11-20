/**
 * Owner: willen@kupotech.com
 */
import { useSnackbar } from '@kux/mui-next';
import _ from 'lodash-es';
import { useEffect } from 'react';
import { useNoticeNoticeStore } from '../models/notice';

const Toast = ({ toastConfig }) => {
  const { type, message: msg } = toastConfig;
  const { updateNoticeNotice } = useNoticeNoticeStore(state => state);

  const { message } = useSnackbar();

  useEffect(() => {
    if (message[type]) {
      message[type](msg);
    } else if (msg) {
      message.info(msg);
    }
    _.delay(() => {
      updateNoticeNotice({ toastConfig: {} });
    }, 3000);
  }, [msg]);

  return null;
};

export default Toast;
