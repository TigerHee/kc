/**
 * Owner: clyne@kupotech.com
 */
import { useCallback } from 'react';
import { useDispatch } from 'dva';
import { useMessage } from '@/hooks/futures/useMessage';
import useI18n from '@/hooks/futures/useI18n';
import { useGetCurrentSymbol } from 'src/trade4.0/hooks/common/useSymbol';
import { namespace } from '../config';
import { futuresSensors } from 'src/trade4.0/meta/sensors';

export const useAsync = () => {
  const { _t } = useI18n();
  const dispatch = useDispatch();
  const { message } = useMessage();
  const currentSymbol = useGetCurrentSymbol();
  // const { checked } = usePnlAlert();

  const asyncSymbol = useCallback(async () => {
    try {
      const {
        success,
        msg,
        message: _msg,
      } = await dispatch({
        type: `${namespace}/asyncPnlAlert`,
        payload: {
          symbol: currentSymbol,
          // enable: checked,
        },
      });
      if (success) {
        message.success(_t('success'));
      } else {
        message.error(msg || _msg || _t('setting.pnl.async.fail'), 'error');
      }
    } finally {
      // 埋点
      futuresSensors.pnlAlert.pnlAction('3');
    }
  }, [_t, currentSymbol, dispatch, message]);

  return { asyncSymbol };
};
