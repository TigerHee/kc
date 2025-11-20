/**
 * Owner: willen@kupotech.com
 */
import { toast } from '@kux/design';
import { delay } from 'lodash-es';
import { useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';

let _message = null;

export const message = {
  success: (msg, opts) => toast.success(msg, opts),
  info: (msg, opts) => _message.info(msg, opts),
  error: (msg, opts) => toast.error(msg, opts),
  warning: (msg, opts) => toast.warn(msg, opts),
};

/** @deprecated 弃用了，后续用新组件库的 toast */
const Toast = ({ toastConfig }) => {
  const { type, message: msg } = toastConfig;

  const dispatch = useDispatch();

  useEffect(() => {
    if (toast[type]) {
      toast[type](msg);
    } else if (msg) {
      toast.info(msg);
    }
    delay(() => {
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
