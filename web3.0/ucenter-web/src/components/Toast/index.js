/**
 * Owner: willen@kupotech.com
 */
import { useSnackbar } from '@kux/mui';
import _ from 'lodash';
import { useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';

let _message = null;

export const message = {
  success: (msg, opts) => _message?.('success', msg, opts),
  info: (msg, opts) => _message?.('info', msg, opts),
  error: (msg, opts) => _message?.('error', msg, opts),
  warning: (msg, opts) => _message?.('warning', msg, opts),
  loading: (msg, opts) => _message?.('loading', msg, opts),
};

const Toast = ({ toastConfig }) => {
  const { type, message: msg } = toastConfig;

  const { message } = useSnackbar();
  const dispatch = useDispatch();

  useEffect(() => {
    if (message[type]) {
      message[type](msg);
    } else if (msg) {
      message.info(msg);
    }
    _.delay(() => {
      dispatch({ type: 'app/update', payload: { toastConfig: {} } });
    }, 3000);
  }, [msg]);

  _message = (type, msg, opts) => {
    dispatch({
      type: 'app/setToast',
      payload: {
        type: type,
        message: msg,
        ...opts,
      },
    });
  };

  return null;
};

export default connect(({ app }) => {
  return { toastConfig: app.toastConfig };
})(Toast);
