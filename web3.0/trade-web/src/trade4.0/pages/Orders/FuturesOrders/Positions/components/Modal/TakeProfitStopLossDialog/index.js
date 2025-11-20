/**
 * Owner: clyne@kupotech.com
 */
import React, { useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { _t } from 'utils/lang';
import AdaptiveModal from '@/components/AdaptiveModal';
import useInitTradePassword from '@/pages/Orders/FuturesOrders/hooks/common/useInitTradePassword';
import PLForm from './PLForm';
import { futuresSensors } from 'src/trade4.0/meta/sensors';

const TakeProfitStopLossDialog = () => {
  const ref = useRef();
  const dispatch = useDispatch();
  const visible = useSelector((state) => state.futures_orders.PLVisible);
  useEffect(() => {
    futuresSensors.position.stopLPExpose.click();
  }, []);
  const { getPasswordStatus } = useInitTradePassword();
  const handleCloseDialog = (e) => {
    if (e && e.preventDefault) {
      e.preventDefault();
      e.stopPropagation();
    }
    dispatch({
      type: 'futures_orders/update',
      payload: {
        PLVisible: false,
      },
    });
  };

  const handleSubmit = async (values) => {
    futuresSensors.position.stopLPCreate.click();
    handleCloseDialog();
    const hasCheckPassword = await getPasswordStatus();
    if (!hasCheckPassword) {
      dispatch({
        type: 'futures_orders/update',
        payload: {
          checkPasswordVisible: true,
          checkPasswordFinishCallback: () => {
            dispatch({
              type: 'futures_orders/createStopOrderFromShortcut',
              payload: {
                ...values,
              },
            });
          },
          checkPasswordFinishCancelCallback: () => {},
        },
      });
      return;
    }
    dispatch({
      type: 'futures_orders/createStopOrderFromShortcut',
      payload: {
        ...values,
      },
    });
  };

  const formSubmitEvent = () => {
    if (ref && ref.current) {
      ref.current.submit();
    }
  };

  useEffect(() => {
    if (!visible && ref.current) {
      ref.current.reset();
    }
  }, [visible]);

  return (
    <AdaptiveModal
      open={visible}
      onClose={() => {
        handleCloseDialog();
      }}
      destroyOnClose
      title={_t('stopClose.profitLoss')}
      onOk={formSubmitEvent}
      okText={_t('security.form.btn')}
    >
      <PLForm ref={ref} onSubmit={handleSubmit} />
    </AdaptiveModal>
  );
};

export default React.memo(TakeProfitStopLossDialog);
