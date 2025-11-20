/**
 * Owner: odan.ou@kupotech.com
 */
import { NumberFormat } from '@kux/mui';
import { useSelector } from 'dva';
import React from 'react';

const SupplyFormat = (props) => {
  const currentLang = useSelector((state) => state.app.currentLang);
  const { value } = props;

  if (!value) return '--';

  const options = { maximumFractionDigits: 2 };
  if (+value >= 10 ** 9) {
    options.notation = 'compact';
  }

  return (
    <NumberFormat lang={currentLang} options={options}>
      {value}
    </NumberFormat>
  );
};

export default SupplyFormat;
