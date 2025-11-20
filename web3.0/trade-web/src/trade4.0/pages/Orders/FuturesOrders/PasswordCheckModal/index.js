/**
 * Owner: clyne@kupotech.com
 */
import React, { memo, forwardRef, useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useSnackbar } from '@kux/mui/hooks';
import { isFunction } from 'lodash';
import { _t } from 'utils/lang';
import Dialog from '@/components/AdaptiveModal';
import Verify, { VERIFY_END_EVENT_NAME } from '@/pages/OrderForm/components/Verify';
import { event } from '@/utils/event';
import useMemoizedFn from '@/hooks/common/useMemoizedFn';

const PasswordCheckModal = () => {
  const dispatch = useDispatch();
  const open = useSelector((state) => state.futures_orders.checkPasswordVisible);
  const checkPasswordFinishCallback = useSelector(
    (state) => state.futures_orders.checkPasswordFinishCallback,
  );
  const checkPasswordFinishCancelCallback = useSelector(
    (state) => state.futures_orders.checkPasswordFinishCancelCallback,
  );
  const { message } = useSnackbar();

  useEffect(() => {
    if (open) {
      event.on(VERIFY_END_EVENT_NAME, finishEvent);
      return () => {
        event.off(VERIFY_END_EVENT_NAME);
      };
    }
  }, [open, finishEvent]);

  const handleClose = useCallback(() => {
    dispatch({
      type: 'futures_orders/update',
      payload: {
        checkPasswordVisible: false,
      },
    });
    isFunction(checkPasswordFinishCancelCallback) && checkPasswordFinishCancelCallback();
  }, [dispatch, checkPasswordFinishCancelCallback]);

  const finishEvent = useMemoizedFn(async ({ res }) => {
    if (res?.code === '200') {
      await dispatch({
        type: 'futures_orders/update',
        payload: {
          checkPasswordVisible: false,
        },
      });
      isFunction(checkPasswordFinishCallback) && checkPasswordFinishCallback();
    } else {
      message.error(res?.msg);
    }
  });

  return (
    <Dialog
      open={open}
      footer={null}
      title={_t('security.input.pwd')}
      disableBackdropClick
      onClose={handleClose}
      destroyOnClose
    >
      <Verify isModal onFinish={finishEvent} visible />
    </Dialog>
  );
};

export default memo(forwardRef(PasswordCheckModal));
