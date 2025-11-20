/**
 * Owner: will.wang@kupotech.com
 */
import { useSnackbar } from '@kux/mui-next';
import bridge from 'gbiz-next/bridge';

// 自适应toast, app内使用原生toast，h5使用组件库toast
const useAdaptiveToast = () => {
  const { message } = useSnackbar();

  // 入参支持string 或 object
  return (params) => {
    let msg = '';
    let type = 'success';
    let options = {};
    if (typeof params === 'string') {
      msg = params;
    } else {
      const { msg: _msg, type: _type, ..._options } = params || {};
      msg = _msg;
      type = _type;
      options = _options;
    }
    if (!msg) return;
    if (bridge.isApp()) {
      bridge.open({ type: 'func', params: { name: 'showToast', value: msg } });
    } else {
      if (message[type]) {
        message[type]?.(msg, options);
      } else {
        message.success(msg, options);
      }
    }
  };
};

export default useAdaptiveToast;
