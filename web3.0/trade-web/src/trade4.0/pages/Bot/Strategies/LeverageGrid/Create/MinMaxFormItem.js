/**
 * Owner: mike@kupotech.com
 */
import React from 'react';
import { FormNumberInputItem } from 'Bot/components/Common/CForm';
import useUpdateLayoutEffect from 'Bot/hooks/useUpdateLayoutEffect';
import { _t } from 'Bot/utils/lang';
import { isNull } from 'Bot/helper';
import Decimal from 'decimal.js';

const minMaxRange = (lastTradedPrice, precision) => {
  lastTradedPrice = +lastTradedPrice;
  if (!lastTradedPrice) return { min: 0, max: 0 };
  // 1、区间上下限限制：下限最小值=当前价/5，上限最大值=当前价*5
  // 2、区间上限 > 区间下限/(1-2*单网格利润)
  return {
    min: Number(Decimal(lastTradedPrice).div(5).toFixed(precision, Decimal.ROUND_DOWN)),
    max: Number(Decimal(lastTradedPrice).times(5).toFixed(precision, Decimal.ROUND_DOWN)),
  };
};
const MinMaxFormItem = React.memo(
  ({ gridProfitRatio, form, symbolInfo, lastTradedPrice, down, up }) => {
    const { quota, pricePrecision: precision, priceIncrement } = symbolInfo;
    // 最低 最高 相互联动检验
    useUpdateLayoutEffect(() => {
      form.getFieldValue('down') && form.validateFields(['down'], { force: true });
      form.getFieldValue('up') && form.validateFields(['up'], { force: true });
    }, [down, up]);
    // 计算区间上下限的极范围
    const downUpRange = minMaxRange(lastTradedPrice, precision);

    const lowerPriceLimit = downUpRange.min;
    const minValidator = (rule, value, cb) => {
      if (!isNull(value)) {
        value = Number(value);
        // 最小值须大于
        if (lowerPriceLimit) {
          if (value < lowerPriceLimit) {
            cb(_t('downmustover', { val: lowerPriceLimit, quota }));
          }
        }
        if (up) {
          if (value >= Number(up)) {
            cb(_t('gridform10'));
          }
        }
      }

      cb();
    };

    const upperPriceLimit = downUpRange.max;
    const maxValidator = (rule, value, cb) => {
      if (!isNull(value)) {
        value = Number(value);

        // 最大值须小于
        if (upperPriceLimit) {
          if (value > upperPriceLimit) {
            // 区间上限须小于{val} {quota}
            cb(_t('upmustless', { val: upperPriceLimit, quota }));
          }
        }
        if (gridProfitRatio && down) {
          // 区间下限/(1-2*单网格利润)
          const minCanMax = Decimal(down)
            .div(Decimal.sub(1, Decimal(gridProfitRatio).times(2)))
            .toFixed(precision, Decimal.ROUND_UP);
          if (value < Number(minCanMax)) {
            // '区间上限需大于{val} {quota}',
            return cb(_t('gridform14', { val: minCanMax, quota }));
          }
        }
        if (down) {
          if (value <= Number(down)) {
            // 区间最高价不能低于区间最低价
            return cb(_t('gridform13'));
          }
        }
      }

      cb();
    };

    return (
      <>
        <FormNumberInputItem
          className="mb-8"
          name="down"
          placeholder={_t('futrgrid.gridform11')}
          unit={quota}
          maxPrecision={precision}
          step={priceIncrement}
          rules={[
            {
              required: true,
              validator: minValidator,
            },
          ]}
        />
        <FormNumberInputItem
          name="up"
          placeholder={_t('futrgrid.gridform5')}
          unit={quota}
          maxPrecision={precision}
          step={priceIncrement}
          rules={[
            {
              required: true,
              validator: maxValidator,
            },
          ]}
        />
      </>
    );
  },
);

export default MinMaxFormItem;
