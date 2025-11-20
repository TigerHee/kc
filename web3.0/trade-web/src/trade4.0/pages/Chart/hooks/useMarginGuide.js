/**
 * Owner: borden@kupotech.com
 */
import { useMemo, useContext, useCallback } from 'react';
import { useDispatch } from 'dva';
import { useSnackbar } from '@kux/mui/hooks';
import { WrapperContext } from '@/pages/Chart/config';
import { BORROW_TYPE } from '@/pages/OrderForm/config';
import useMarginModel from '@/hooks/useMarginModel';
import useIsMargin from '@/hooks/useIsMargin';
import useSensorFunc from '@/hooks/useSensorFunc';
import { getSingleModule } from '@/layouts/utils';
import { _t } from 'utils/lang';

export const useMarginGuideInit = () => {
  const screen = useContext(WrapperContext);
  const isMargin = useIsMargin();
  const { isSingle } = getSingleModule();

  const showMarginGuide = useMemo(() => {
    if (isMargin && screen !== 'md' && screen !== 'sm' && !isSingle) {
      return true;
    }
    return false;
  }, [screen, isMargin, isSingle]);

  return { showMarginGuide };
};

export const useMarginGuide = () => {
  const dispatch = useDispatch();
  const sensorFunc = useSensorFunc();
  const { message } = useSnackbar();
  const { isAutoRepay, borrowType } = useMarginModel(['isAutoRepay', 'borrowType']);

  // 借币还币
  const openMarginModal = useCallback(
    (modalType, type) => {
      sensorFunc(['marginStepTutorial', type, 'go']);
      dispatch({
        type: 'marginMeta/updateMarginModalConfig',
        payload: {
          open: true,
          modalType,
        },
      });
    },
    [sensorFunc],
  );

  const openTransferModal = useCallback(() => {
    sensorFunc(['marginStepTutorial', 'transfer', 'go']);

    dispatch({
      type: 'transfer/updateTransferConfig',
      payload: {
        visible: true,
      },
    });
  }, [sensorFunc]);

  const openAutoRepayConfirm = useCallback(() => {
    sensorFunc(['marginStepTutorial', 'repay', 'auto']);

    if (isAutoRepay) {
      message.info(_t('autopayback.open.tip'));
    } else {
      dispatch({
        type: 'marginMeta/update',
        payload: {
          autoRepayConfirmOpen: true,
        },
      });
    }
  }, [sensorFunc, isAutoRepay]);

  const openAutoBorrowConfirm = useCallback(() => {
    sensorFunc(['marginStepTutorial', 'borrow', 'auto']);

    if (borrowType === BORROW_TYPE.auto) {
      message.info(_t('autoBorrow.open.tip'));
    } else {
      dispatch({
        type: 'trade/update',
        payload: {
          autoBorrowConfirmModalOpen: true,
        },
      });
    }
  }, [sensorFunc, borrowType]);

  return { openMarginModal, openTransferModal, openAutoRepayConfirm, openAutoBorrowConfirm };
};
