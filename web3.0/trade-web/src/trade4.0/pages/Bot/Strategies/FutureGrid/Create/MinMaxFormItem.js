/**
 * Owner: mike@kupotech.com
 */
import React from 'react';
import { FormNumberInputItem } from 'Bot/components/Common/CForm';
import useUpdateLayoutEffect from 'Bot/hooks/useUpdateLayoutEffect';
import { _t } from 'Bot/utils/lang';
import { calcMinMax, minMaxRange } from '../util';
import { isNull } from 'Bot/helper';

const MinMaxFormItem = React.memo(
  ({ direction, limitPrice, form, symbolInfo, lastTradedPrice, lowerPrice, upperPrice }) => {
    const { quota, precision, priceIncrement } = symbolInfo;
    const minCanMax = calcMinMax(lowerPrice, precision);
    // 最低 最高 相互联动检验
    // 爆仓价格变化需要动态校验 限制
    useUpdateLayoutEffect(() => {
      form.getFieldValue('lowerPrice') && form.validateFields(['lowerPrice'], { force: true });
      form.getFieldValue('upperPrice') && form.validateFields(['upperPrice'], { force: true });
    }, [limitPrice]);
    // 计算区间上下限的极范围
    const downUpRange = minMaxRange(lastTradedPrice, precision);
    // limitPrice是根据交易对+方向算出的价格限制
    // downUpRange 是本地写死的区间范围限制
    // 他们合并哈
    let lowerPriceLimit = downUpRange.min;
    if (downUpRange.min && direction === 'long' && limitPrice) {
      // 下限至少大于最大的那个限制
      lowerPriceLimit = Math.max(downUpRange.min, limitPrice);
    }

    const minValidator = (rule, value, cb) => {
      if (!isNull(value)) {
        value = Number(value);
        // 最小值须大于
        if (lowerPriceLimit) {
          if (value < lowerPriceLimit) {
            cb(_t('downmustover', { val: lowerPriceLimit, quota }));
          }
        }
        if (upperPrice) {
          if (value >= Number(upperPrice)) {
            cb(_t('gridform10'));
          }
        }
      }
      cb();
    };
    // limitPrice是根据交易对+方向算出的价格限制
    // downUpRange 是本地写死的区间范围限制
    // 他们合并哈
    let upperPriceLimit = downUpRange.max;
    if (downUpRange.max && direction === 'short' && limitPrice) {
      // 上限需小于最小的那个限制
      upperPriceLimit = Math.min(downUpRange.max, limitPrice);
    }
    const maxValidator = (rule, value, cb) => {
      if (!isNull(value)) {
        value = Number(value);

        // 最大值须小于
        if (upperPriceLimit) {
          if (value > upperPriceLimit) {
            cb(_t('upmustless', { val: upperPriceLimit, quota }));
          }
        }

        if (lowerPrice) {
          if (value <= Number(lowerPrice)) {
            return cb(_t('gridform10'));
          }
          if (Number(minCanMax) > value) {
            return cb(_t('gridform14', { val: minCanMax, quota }));
          }
        }
      }

      cb();
    };

    return (
      <>
        <FormNumberInputItem
          className="mb-8"
          name="lowerPrice"
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
          name="upperPrice"
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
