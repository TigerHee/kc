/**
 * Owner: mike@kupotech.com
 */
import React from 'react';
import { FormNumberInputItem } from 'Bot/components/Common/CForm';
import { _t, _tHTML } from 'Bot/utils/lang';
import { isNull } from 'Bot/helper';
import Decimal from 'decimal.js';
import { minPriceRatio } from '../config';

// 最低价
const MinPrice = ({ symbolInfo, lastTradedPrice }) => {
  const currentSymbolPrice = Number(lastTradedPrice || 0);

  let minLimitPrice = Decimal(currentSymbolPrice)
    .times(minPriceRatio)
    .toFixed(symbolInfo.pricePrecision, Decimal.ROUND_UP);
  minLimitPrice = Number(minLimitPrice);

  const validator = (rule, value, cb) => {
    if (!isNull(value)) {
      value = Number(value);

      if (value > currentSymbolPrice) {
        return cb(_t('minpricelesscurrent'));
      }
      if (value < minLimitPrice && minLimitPrice) {
        return cb(
          _t('infinity.minmustover', {
            num: `${minLimitPrice} ${symbolInfo.quota}`,
          }),
        );
      }
    }
    cb();
  };
  return (
    <FormNumberInputItem
      className="mb-8"
      name="down"
      placeholder={_t('minprice')}
      step={symbolInfo.priceIncrement}
      unit={symbolInfo.quota}
      rules={[
        {
          required: true,
          validator,
        },
      ]}
      maxPrecision={symbolInfo.pricePrecision}
    />
  );
};

export default MinPrice;
