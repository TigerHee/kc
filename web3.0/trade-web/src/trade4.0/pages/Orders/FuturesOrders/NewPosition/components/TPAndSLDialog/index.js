/**
 * Owner: clyne@kupotech.com
 */
import React, { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useI18n, AdaptiveModal, useVerify } from '@/pages/Futures/import';
// import { trackExposeS } from 'utils/sensors';
// import { positionStopLoss } from 'sensorsKey/trade';
import PLForm from './PLForm';
import { namespace } from '../../config';
import { BIClick, POSITIONS, getSLAndSPPosType } from 'src/trade4.0/meta/futuresSensors/list';

const TakeProfitStopLossDialog = () => {
  const { _t } = useI18n();
  const { checkVerify } = useVerify();
  const ref = useRef();
  const dispatch = useDispatch();
  const visible = useSelector((state) => state[namespace].PLVisible);
  const positionItem = useSelector((state) => state[namespace].positionItem);
  const sensorType = getSLAndSPPosType(positionItem);
  React.useEffect(() => {
    if (visible) {
      BIClick([POSITIONS.BLOCK_ID, POSITIONS.SL_SP_EXPOSE], { type: sensorType });
    }
  }, [sensorType, visible]);

  const handleCloseDialog = (e) => {
    if (e && e.preventDefault) {
      e.preventDefault();
      e.stopPropagation();
    }
    dispatch({
      type: `${namespace}/update`,
      payload: {
        PLVisible: false,
      },
    });
  };

  const handleSubmit = (values) => {
    BIClick([POSITIONS.BLOCK_ID, POSITIONS.SL_SP_SUBMIT], { type: sensorType });
    handleCloseDialog();
    checkVerify(() => {
      dispatch({
        type: `${namespace}/createStopOrderFromShortcut`,
        payload: {
          ...values,
          sensorType,
        },
      });
    });
  };

  const formSubmitEvent = () => {
    if (ref && ref.current) {
      ref.current.submit();
    }
  };

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
