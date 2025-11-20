/**
 * Owner: mike@kupotech.com
 */
import React from 'react';
import AdvanceSettingWrap from 'Bot/components/Common/AdvanceSettingWrap';
import { isNull, isZero } from 'Bot/helper';
import { FormNumberInputItem } from 'Bot/components/Common/CForm';
import { _t } from 'Bot/utils/lang';

const infoContentKeys = [
  ['gridform21', 'gridformTip8'], // 止损价
  ['stopprofit', 'stopprofitpricehintlong'], // 止盈价
];
const AdvanceSetting = React.memo(({ symbolInfo, min, max }) => {
  const { pricePrecision, quota, priceIncrement } = symbolInfo;
  return (
    <AdvanceSettingWrap infoContentKeys={infoContentKeys}>
      <FormNumberInputItem
        className="mb-10"
        name="stopLossPrice"
        placeholder={_t('gridform211')}
        unit={quota}
        maxPrecision={pricePrecision}
        step={priceIncrement}
        rules={[
          {
            required: false,
            validator: (rule, value, cb) => {
              if (isNull(value)) {
                return cb();
              }
              value = Number(value);
              if (Number(min)) {
                if (Number(min) < value) {
                  return cb(_t('gridform22', { val: min }));
                }
              }
              if (isZero(value)) {
                return cb(_t('gridform8'));
              }
              cb();
            },
          },
        ]}
      />
      <FormNumberInputItem
        name="stopProfitPrice"
        unit={quota}
        placeholder={_t('stopprofit')}
        maxPrecision={pricePrecision}
        step={priceIncrement}
        rules={[
          {
            required: false,
            validator: (rule, value, cb) => {
              if (isNull(value)) {
                return cb();
              }
              value = Number(value);
              if (value <= Number(max)) {
                return cb(_t('clsgrid.stopprofitmust', { num: max }));
              }
              if (isZero(value)) {
                return cb(_t('gridform8'));
              }
              cb();
            },
          },
        ]}
      />
    </AdvanceSettingWrap>
  );
});

export default AdvanceSetting;
