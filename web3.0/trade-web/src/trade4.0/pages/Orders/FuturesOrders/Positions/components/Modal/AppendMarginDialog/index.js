/**
 * Owner: clyne@kupotech.com
 */
import React, { useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { _t } from 'utils/lang';
import AdaptiveModal from '@/components/AdaptiveModal';
import Detail from './Detail';
import FormInput from './FormInput';
import { futuresSensors } from 'src/trade4.0/meta/sensors';

const AppendMarginDialog = React.memo(() => {
  const dispatch = useDispatch();
  const inputRef = useRef();
  const visible = useSelector((state) => state.futures_orders.appendMarginVisible);
  const loading = useSelector((state) => state.loading.effects['futures_orders/appendMargin']);

  useEffect(() => {
    futuresSensors.position.addMarginExpose.click();
  }, []);

  const handleCloseDialog = () => {
    dispatch({
      type: 'futures_orders/update',
      payload: {
        appendMarginVisible: false,
      },
    });
  };

  const onOkEvent = () => {
    if (inputRef.current) {
      futuresSensors.position.addMarginCommit.click();
      inputRef.current.submit();
    }
  };

  useEffect(() => {
    if (!visible && inputRef.current) {
      inputRef.current.reset();
    }
  }, [visible]);

  return (
    <AdaptiveModal
      okText={_t('security.form.btn')}
      onOk={onOkEvent}
      open={visible}
      onClose={handleCloseDialog}
      title={_t('append.margin.title')}
      okLoading={loading}
      destroyOnClose
    >
      <Detail>
        <FormInput ref={inputRef} />
      </Detail>
    </AdaptiveModal>
  );
});

export default AppendMarginDialog;
