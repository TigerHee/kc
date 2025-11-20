/**
 * Owner: mike@kupotech.com
 */
import React from 'react';
import DialogRef from 'Bot/components/Common/DialogRef';
import UpdateMargin from './UpdateMargin';
import { _t } from 'Bot/utils/lang';

const DialogRefWrap = ({ actionSheetRef, onFresh, apiConfig, hasPreCalcBlowUpPrice }) => {
  return (
    <DialogRef
      cancelText={null}
      onCancel={() => actionSheetRef.current.toggle()}
      onOk={() => actionSheetRef.current.confirm()}
      ref={actionSheetRef}
      title={_t('futrgrid.addmargin')}
      okText={_t('gridwidget6')}
      size="medium"
      maskClosable
      centeredFooterButton
    >
      <UpdateMargin
        onFresh={onFresh}
        actionSheetRef={actionSheetRef}
        apiConfig={apiConfig}
        hasPreCalcBlowUpPrice={hasPreCalcBlowUpPrice}
      />
    </DialogRef>
  );
};

export default DialogRefWrap;
