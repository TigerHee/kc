/**
 * Owner: mike@kupotech.com
 */
import React, { useState, useMemo } from 'react';
import { FormNumberInputItem } from 'Bot/components/Common/CForm';
import useUpdateLayoutEffect from 'Bot/hooks/useUpdateLayoutEffect';
import { Parameter } from './Widgets';
import { Flex } from 'Bot/components/Widgets';
import { _t } from 'Bot/utils/lang';
import { calcMinMax, minMaxRange } from '../util';
import { isNull } from 'Bot/helper';
import ToggleAIParamsButton from 'Bot/components/Common/ToggleAIParamsButton';
import { useModel } from './model';

const ToggleAuto = ({ fee, form }) => {
  const {
    commonSetting: { fillAIParamsBtnActive },
    setCommonSetting,
  } = useModel();
  const handler = () => {
    if (!fillAIParamsBtnActive) {
      // 填充
      form.setFieldsValue({
        min: fee.min,
        max: fee.max,
        placeGrid: fee.placeGrid,
      });
    } else {
      // 清空
      form.resetFields();
    }
    setCommonSetting({ fillAIParamsBtnActive: !fillAIParamsBtnActive });
  };

  return <ToggleAIParamsButton active={fillAIParamsBtnActive} onClick={handler} />;
};

// mode ['extend']
// checkRange
// extend模式需要校验checkRange
const MinMaxFormItem = React.memo(
  ({ symbolInfo, fee, form, min, max, lastTradedPrice, mode, checkRange, noRangeLabel }) => {
    const { quota, pricePrecision, priceIncrement } = symbolInfo;
    const { gridProfitRatio } = fee;
    // 最低 最高 相互联动检验
    useUpdateLayoutEffect(() => {
      form.getFieldValue('max') !== undefined &&
        form.validateFields(['max'], { triggerName: 'onChange' });
    }, [min]);
    useUpdateLayoutEffect(() => {
      form.getFieldValue('min') !== undefined &&
        form.validateFields(['min'], { triggerName: 'onChange' });
    }, [max]);

    // 计算上下限的极范围
    const downUpRange = useMemo(() => {
      return minMaxRange(lastTradedPrice, pricePrecision);
    }, [lastTradedPrice, pricePrecision]);

    // 计算有最小区间的时候的 max 的最小值
    const minCanMax = useMemo(() => {
      return calcMinMax(min, pricePrecision, gridProfitRatio);
    }, [min, pricePrecision, gridProfitRatio]);

    const minValidator = (rule, value, cb) => {
      if (!isNull(value)) {
        value = Number(value);
        // 最小值须大于
        // 扩展模式不需要这个判断
        if (mode !== 'extend' && downUpRange.min) {
          if (value < downUpRange.min) {
            cb(_t('downmustover', { val: downUpRange.min, quota }));
          }
        }
        if (max) {
          if (value >= Number(max)) {
            cb(_t('gridform10'));
          }
        }
        // 扩展模式 下限需要小于指定值
        if (mode === 'extend') {
          if (value > checkRange.min) {
            cb(
              _t('4LdDyud9dR2Np4zGCwQe28', {
                val: checkRange.min,
                quota,
              }),
            );
          }
        }
      }

      cb();
    };
    const maxValidator = (rule, value, cb) => {
      if (!isNull(value)) {
        value = Number(value);
        // notmorelimit
        // 最大值须小于
        // 扩展模式不需要这个判断
        if (mode !== 'extend' && downUpRange.max) {
          if (value > downUpRange.max) {
            cb(_t('upmustless', { val: downUpRange.max, quota }));
          }
        }
        if (min) {
          if (value <= Number(min)) {
            cb(_t('gridform10'));
          }
          // 扩展模式不需要这个判断 多余
          if (mode !== 'extend') {
            if (Number(minCanMax) > value) {
              cb(_t('gridform14', { val: minCanMax, quota }));
            }
          }
        }
        // 扩展模式 上限需要大于指定值
        if (mode === 'extend') {
          if (value < checkRange.max) {
            cb(_t('gridform14', { val: checkRange.max, quota }));
          }
        }
      }
      cb();
    };

    return (
      <>
        {!noRangeLabel && (
          <Flex vc sb mb={8}>
            <Parameter />
            <ToggleAuto form={form} fee={fee} />
          </Flex>
        )}
        <FormNumberInputItem
          className="mb-8"
          name="min"
          placeholder={_t('futrgrid.gridform11')}
          unit={quota}
          maxPrecision={pricePrecision}
          step={priceIncrement}
          rules={[
            {
              required: true,
              validator: minValidator,
            },
          ]}
        />
        <FormNumberInputItem
          name="max"
          placeholder={_t('futrgrid.gridform5')}
          unit={quota}
          maxPrecision={pricePrecision}
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
