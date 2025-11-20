/**
 * Owner: mike@kupotech.com
 */
import React from 'react';
import { FormNumberInputItem } from 'Bot/components/Common/CForm';
import { _t, _tHTML } from 'Bot/utils/lang';
import { isNull } from 'Bot/helper';

// 单网格利润率
const PerGridPR = ({ PRRange }) => {
  const [low, up] = PRRange;
  const gridPrStr = `${low}% ~ ${up}%`;
  const validator = (rule, value, cb) => {
    if (!isNull(value)) {
      value = Number(value);

      if (value < low || value > up) {
        cb(_t('pergridprlimit', { range: gridPrStr }));
      }
    }
    cb();
  };
  return (
    <FormNumberInputItem
      name="gridProfitRatio"
      placeholder={`${_t('pergridpr')}(${gridPrStr})`}
      unit="%"
      rules={[
        {
          required: true,
          validator,
        },
      ]}
      maxPrecision={2}
    />
  );
};

export default PerGridPR;
