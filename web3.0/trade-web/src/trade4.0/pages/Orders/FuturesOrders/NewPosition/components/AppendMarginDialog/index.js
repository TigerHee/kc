/**
 * Owner: clyne@kupotech.com
 */
import React, { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { _t } from 'utils/lang';
// import { trackExposeS } from 'utils/sensors';
// import { addMargin } from 'sensorsKey/trade';
import { AdaptiveModal } from '@/pages/Futures/import';
import Detail from './Detail';
import FormInput from './FormInput';
import { namespace } from '../../config';

const AppendMarginDialog = React.memo(() => {
  const dispatch = useDispatch();
  const inputRef = useRef();
  const visible = useSelector((state) => state[namespace].appendMarginVisible);
  const loading = useSelector((state) => state.loading.effects[`${namespace}/appendMargin`]);
  // React.useEffect(() => {
  //   if (visible) {
  //     trackExposeS(addMargin);
  //   }
  // }, [visible]);

  const handleCloseDialog = () => {
    dispatch({
      type: `${namespace}/update`,
      payload: {
        appendMarginVisible: false,
      },
    });
  };

  const onOkEvent = () => {
    if (inputRef.current) {
      inputRef.current.submit();
    }
  };

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
