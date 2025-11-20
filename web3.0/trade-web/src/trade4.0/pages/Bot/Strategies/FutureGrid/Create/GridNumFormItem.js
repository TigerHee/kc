/**
 * Owner: mike@kupotech.com
 */
import React from 'react';
import useUpdateLayoutEffect from 'Bot/hooks/useUpdateLayoutEffect';
import { Text } from 'Bot/components/Widgets';
import { FormNumberInputItem } from 'Bot/components/Common/CForm';
import { _t, _tHTML } from 'Bot/utils/lang';
import { isNull } from 'Bot/helper';
import { calcGridNumRange, minCustomInverstGridNumber } from '../util';

const GridNumFormItem = React.memo(({ symbolInfo, form, upperPrice, lowerPrice }) => {
  const { precision, quota } = symbolInfo;
  const { rangeText, maxGridNum, minGridNum } = calcGridNumRange(upperPrice, lowerPrice, precision);
  const gridNumPlaceholderText = rangeText;
  // maxGridNum变化需要动态教研这个字段
  useUpdateLayoutEffect(() => {
    form.getFieldValue('gridNum') && form.validateFields(['gridNum'], { force: true });
  }, [maxGridNum]);

  const validator = (rule, value, cb) => {
    if (!isNull(value)) {
      value = Number(value);
      if (maxGridNum) {
        if (maxGridNum < value || value < minGridNum) {
          if (minGridNum === maxGridNum) {
            // 相等的提示
            cb(_t('gridform175', { max: maxGridNum }));
          } else {
            // 范围提示
            cb(_t('gridform17', { min: minGridNum, max: maxGridNum }));
          }
        }
      }
    }
    cb();
  };

  return (
    <>
      <Text as="div" fs={14} color="text" lh="130%" fw={500} mb={8}>
        {gridNumPlaceholderText}
      </Text>
      <FormNumberInputItem
        className="mb-8"
        name="gridNum"
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
    </>
  );
});

export default GridNumFormItem;
