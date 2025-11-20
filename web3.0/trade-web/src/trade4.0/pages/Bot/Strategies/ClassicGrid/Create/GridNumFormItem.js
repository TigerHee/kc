/**
 * Owner: mike@kupotech.com
 */
import React from 'react';
import useUpdateLayoutEffect from 'Bot/hooks/useUpdateLayoutEffect';
import { Flex, Text } from 'Bot/components/Widgets';
import { FormNumberInputItem } from 'Bot/components/Common/CForm';
import { _t, _tHTML } from 'Bot/utils/lang';
import { calcMaxGridNum } from '../util';
import { isNull, formatNumber } from 'Bot/helper';
import { minCustomInverstGridNumber, maxCustomInverstGridNumber } from '../config';
import classNames from 'classnames';

const getErrors = (form, fields = []) => {
  const getName = (name) => {
    if (Array.isArray(name)) {
      return name.toString();
    }
    return name;
  };
  const errors = {};
  form.getFieldsError(fields).forEach((field) => {
    if (field.errors.length) {
      errors[getName(field.name)] = true;
    }
  });
  return errors;
};
// 处理最大挂单数量 文字提示
const maxGridNumHandler = ({ form, min, max, pricePrecision, gridProfitRatio }) => {
  min = +min;
  max = +max;
  let maxGridNum = maxCustomInverstGridNumber;
  const { min: hasMinErrors, max: hasMaxErrors } = getErrors(form, ['min', 'max']);

  if (hasMinErrors || hasMaxErrors) {
    maxGridNum = maxCustomInverstGridNumber;
  } else if (!min || !max || min > max) {
    maxGridNum = maxCustomInverstGridNumber;
  } else {
    const tmaxGridNum = calcMaxGridNum(max, min, pricePrecision, gridProfitRatio);
    if (!tmaxGridNum) {
      maxGridNum = maxCustomInverstGridNumber;
    } else {
      maxGridNum = tmaxGridNum;
    }
  }

  maxGridNum = +maxGridNum;

  let gridNumPlaceholderText;
  let gridNumPlaceholderRange = `${minCustomInverstGridNumber}-${maxCustomInverstGridNumber}`;
  if (maxGridNum < minCustomInverstGridNumber) {
    gridNumPlaceholderText = _t('gridform15');
  } else if (maxGridNum === minCustomInverstGridNumber) {
    gridNumPlaceholderText = `${_t('gridform1555')} ${minCustomInverstGridNumber}`;
    gridNumPlaceholderRange = minCustomInverstGridNumber;
  } else if (maxGridNum !== minCustomInverstGridNumber) {
    gridNumPlaceholderText = `${_t('gridform1555')}(${minCustomInverstGridNumber}-${maxGridNum})`;
    gridNumPlaceholderRange = `${minCustomInverstGridNumber}-${maxGridNum}`;
  }
  return {
    maxGridNum,
    gridNumPlaceholderText,
    gridNumPlaceholderRange,
  };
};

const GridNumFormItem = React.memo(
  ({
    form,
    min,
    max,
    gridProfit,
    fee,
    symbolInfo,
    levelPrice,
    isShowGridInterval = true,
    isShowLabel = true,
    className,
  }) => {
    levelPrice = +levelPrice;
    const { gridProfitRatio } = fee;
    const { pricePrecision, quota } = symbolInfo;

    const { maxGridNum, gridNumPlaceholderText } = maxGridNumHandler({
      form,
      min,
      max,
      pricePrecision,
      gridProfitRatio,
    });

    // maxGridNum变化需要动态教研这个字段
    useUpdateLayoutEffect(() => {
      form.getFieldValue('placeGrid') !== undefined &&
        form.validateFields(['placeGrid'], { triggerName: 'onChange' });
    }, [maxGridNum, min, max]);

    const validator = (rule, value, cb) => {
      if (!isNull(value)) {
        value = Number(value);
        if (maxGridNum) {
          if (maxGridNum < value || value < minCustomInverstGridNumber) {
            if (minCustomInverstGridNumber === maxGridNum) {
              // 相等的提示
              cb(_t('gridform175', { max: maxGridNum }));
            } else {
              // 范围提示
              cb(
                _t('gridform17', {
                  min: minCustomInverstGridNumber,
                  max: maxGridNum,
                }),
              );
            }
          }
        }
      }
      cb();
    };

    return (
      <div className={className}>
        {isShowLabel && (
          <Text as="div" fs={14} color="text" lh="130%" fw={500} mb={8}>
            {gridNumPlaceholderText}
          </Text>
        )}

        <FormNumberInputItem
          className="mb-8"
          name="placeGrid"
          placeholder={gridNumPlaceholderText}
          rules={[
            {
              required: true,
              validator,
            },
          ]}
          min={minCustomInverstGridNumber}
          max={maxGridNum}
          maxPrecision={0}
        />

        {isShowGridInterval && (
          <Flex vc sb fs={12} color="text40" mb={8} lh="130%">
            <span>{_tHTML('clsgrid.griddiff', { quota })}</span>
            <span>{formatNumber(levelPrice, pricePrecision)}</span>
          </Flex>
        )}

        <Flex vc sb fs={12} color="text40" lh="130%" className="grid-profit">
          <span className="nowrap">{_t('persellprofits')}</span>
          <span className="right">{gridProfit}</span>
        </Flex>
      </div>
    );
  },
);

export default GridNumFormItem;
