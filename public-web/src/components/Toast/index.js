/**
 * Owner: willen@kupotech.com
 */
import { useSnackbar } from '@kufox/mui';
import _ from 'lodash';
import { useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';

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

  return null;
};

export default connect(({ app }) => {
  return { toastConfig: app.toastConfig };
})(Toast);
