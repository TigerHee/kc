/**
 * Owner: clyne@kupotech.com
 */
import { useDispatch, useSelector } from 'dva';
import { useCallback } from 'react';
import { useMessage } from '@/hooks/futures/useMessage';
import useI18n from '@/hooks/futures/useI18n';

import { useDialog } from './usePnlForm';
import { usePnlAlertFunc } from './usePnlAlert';
import { namespace } from '../config';
import { futuresSensors } from 'src/trade4.0/meta/sensors';

export const usePnlList = () => {
  const list = useSelector((state) => state[namespace].pnlAlertList);
  return { list };
};

export const useListOperation = (data) => {
  const dispatch = useDispatch();
  const { setDialog } = useDialog();
  const { message } = useMessage();
  const { getPnlAlertList, currentSymbol: symbol } = usePnlAlertFunc();
  const { _t } = useI18n();
  const { id } = data;

  /**
   * 删除
   */
  const onDelete = useCallback(async () => {
    try {
      const { success, msg } = await dispatch({
        type: `${namespace}/deletePnlAlertConfig`,
        payload: { id, symbol },
      });
      if (success) {
        message.success(_t('success'));
        getPnlAlertList();
      } else {
        message.error(msg || _t('setting.pnl.delete.fail', 'error'));
      }
    } finally {
      // 埋点
      futuresSensors.pnlAlert.pnlAction('6');
    }
  }, [dispatch, id, symbol, getPnlAlertList, message, _t]);

  const onEdit = useCallback(() => {
    // 先赋值，在open
    dispatch({
      type: `${namespace}/update`,
      payload: {
        pnlAlertInfo: data,
      },
    });
    setDialog(true);
    // 埋点
    // trackClick([PNL_NOTICE, '5']);
  }, [data, dispatch, setDialog]);

  return { onDelete, onEdit };
};
