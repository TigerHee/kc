/**
 * Owner: clyne@kupotech.com
 */
import React, { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { _t } from 'utils/lang';
import AdaptiveModal from '@/components/AdaptiveModal';
import FuturesRiskLimitContent from './FuturesRiskLimitContent';

const FuturesRiskLimitModal = () => {
  const dispatch = useDispatch();
  const contentRef = useRef();
  const onlyRiskLimitChangeVisible = useSelector(
    (state) => state.futuresSetting.onlyRiskLimitChangeVisible,
  );
  const loading = useSelector(
    (state) => state.loading.effects['futuresSetting/postChangeRiskLimit'],
  );
  const onCancel = () => {
    dispatch({
      type: 'futuresSetting/update',
      payload: { onlyRiskLimitChangeVisible: false },
    });
  };

  const submitEvent = async () => {
    if (contentRef.current) {
      await contentRef.current.submit();
    }
  };

  return (
    <AdaptiveModal
      onClose={onCancel}
      onOk={submitEvent}
      open={onlyRiskLimitChangeVisible}
      okButtonProps={{ loading, disabled: loading }}
      title={_t('trade.settingFutures.title')}
    >
      <FuturesRiskLimitContent onOk={onCancel} ref={contentRef} />
    </AdaptiveModal>
  );
};

export default FuturesRiskLimitModal;
