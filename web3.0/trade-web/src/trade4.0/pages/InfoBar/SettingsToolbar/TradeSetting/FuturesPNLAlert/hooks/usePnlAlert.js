/**
 * Owner: clyne@kupotech.com
 */
import { useDispatch, useSelector } from 'dva';
import { useCallback } from 'react';
import { useGetCurrentSymbol } from 'src/trade4.0/hooks/common/useSymbol';
import { namespace } from '../config';
import { futuresSensors } from 'src/trade4.0/meta/sensors';

export const usePnlAlert = () => {
  const dispatch = useDispatch();
  const checked = useSelector((state) => state[namespace].pnlAlertState);
  const currentSymbol = useGetCurrentSymbol();
  const { getPnlAlertList } = usePnlAlertFunc();
  // onchange
  const onChange = useCallback(
    async (v) => {
      await dispatch({
        type: `${namespace}/pnlAlertSwitchUpdate`,
        payload: {
          enable: v,
          symbol: currentSymbol,
        },
      });

      getPnlAlertList();
      // 埋点
      futuresSensors.pnlAlert.pnlAction('2', { status: v ? 'open' : 'close' });
    },
    [currentSymbol, dispatch, getPnlAlertList],
  );
  return { checked, onChange };
};

export const usePnlAlertFunc = () => {
  const dispatch = useDispatch();
  const currentSymbol = useGetCurrentSymbol();
  const isLogin = useSelector((state) => state.user.isLogin);

  const getPnlAlertConfig = useCallback(() => {
    if (isLogin) {
      dispatch({
        type: `${namespace}/getPnlAlertConfig`,
        payload: {
          symbol: currentSymbol,
        },
      });
    }
  }, [currentSymbol, dispatch, isLogin]);

  const getPnlAlertList = useCallback(() => {
    if (isLogin) {
      dispatch({
        type: `${namespace}/getPnlAlertList`,
        payload: {
          symbol: currentSymbol,
        },
      });
    }
  }, [currentSymbol, dispatch, isLogin]);

  return { getPnlAlertConfig, getPnlAlertList, currentSymbol };
};
