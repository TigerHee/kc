/*
 * @Owner: mike@kupotech.com
 */
import React from 'react';
import { useModel } from '../model';
import { _t, _tHTML } from 'Bot/utils/lang';
import { formatSubmitData } from 'Martingale/config';
import { getLabelShow } from './InputSheet';
import OrderSureSheetTemp from 'FutureMartingale/components/OrderSureSheetTemp';

const OrderSure = React.memo(({ sheetRef }) => {
  const { formData, symbolInfo, clear } = useModel();
  return (
    <OrderSureSheetTemp
      sheetRef={sheetRef}
      formData={formData}
      symbolInfo={symbolInfo}
      clear={clear}
      formatSubmitData={formatSubmitData}
      getLabelShow={getLabelShow}
      resultType="martingale"
    />
  );
});

export default OrderSure;
