/*
 * @Owner: mike@kupotech.com
 */
import React from 'react';
import { useModel } from '../model';
import { getLabelShow } from './InputSheet';
import { formatSubmitData } from 'FutureMartingale/config';
import { _t, _tHTML } from 'Bot/utils/lang';
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
      resultType="FUTURES_MARTIN_GALE"
    />
  );
});

export default OrderSure;
