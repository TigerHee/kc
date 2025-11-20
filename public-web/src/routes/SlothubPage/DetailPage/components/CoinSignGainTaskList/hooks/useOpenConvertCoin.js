/*
 * Owner: harry.lai@kupotech.com
 * @Date: 2024-06-21 12:37:35
 * @LastEditors: harry.lai harry.lai@kupotech.com
 * @LastEditTime: 2024-06-22 14:40:07
 */
import { useMemoizedFn } from 'ahooks';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { evtEmitter } from 'src/helper';
import { useStore } from 'src/routes/SlothubPage/DetailPage/store';

const event = evtEmitter.getEvt();
const CONVERT_SUCCESS_EMIT_KEY = '__GEMSLOT_CONVERT_SUCCESS__';

export const useOpenConvertCoin = () => {
  const { state } = useStore();
  const { projectDetail, refreshProjectDetail } = state;
  const { currency } = projectDetail || {};
  const dispatch = useDispatch();

  useEffect(() => {
    event.on(CONVERT_SUCCESS_EMIT_KEY, refreshProjectDetail);
    return () => {
      event.off(CONVERT_SUCCESS_EMIT_KEY, refreshProjectDetail);
    };
  }, [refreshProjectDetail]);

  // 兑换
  const convert = useMemoizedFn(() => {
    dispatch({
      type: 'slothub/updateConvertDialogConfig',
      payload: {
        currency,
        open: true,
      },
    });
  });

  return convert;
};
