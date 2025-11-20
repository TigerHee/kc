/**
 * Owner: mike@kupotech.com
 */
import React from 'react';
import useUpdateLayoutEffect from 'Bot/hooks/useUpdateLayoutEffect';
import { Text } from 'Bot/components/Widgets';
import { FormNumberInputItem } from 'Bot/components/Common/CForm';
import { _t, _tHTML } from 'Bot/utils/lang';
import { isNull } from 'Bot/helper';
import isInteger from 'lodash/isInteger';

const getGridNumText = (minGridNum, maxGridNum) => {
  let rangeText = null;
  if (minGridNum && maxGridNum) {
    if (maxGridNum === minGridNum) {
      rangeText = maxGridNum;
    } else {
      rangeText = `${minGridNum} - ${maxGridNum}`;
    }
  }
  return {
    parentheses: rangeText ? `(${rangeText})` : '',
    text: rangeText || '',
  };
};
const GridNumFormItem = React.memo(({ symbolInfo, form, maxGridNum, minGridNum = 2 }) => {
  maxGridNum = maxGridNum || 100;
  const { quota } = symbolInfo;
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
            cb(_t('gridform175', { max: maxGridNum })); // 挂单数量为{max}
          } else {
            // 范围提示
            cb(_t('gridform17', { min: minGridNum, max: maxGridNum })); // 挂单数量须要此范围{min}-{max}
          }
        }
      }
      if (!isInteger(value)) {
        cb(_t('gridform18'));
      }
    }
    cb();
  };
  const rangeText = getGridNumText(minGridNum, maxGridNum);
  return (
    <>
      <Text as="div" fs={14} color="text" lh="130%" fw={500} mb={8}>
        {_t('futrgrid.formgridnum')}
        {rangeText.parentheses}
      </Text>
      <FormNumberInputItem
        className="mb-8"
        name="gridNum"
        placeholder={rangeText.text}
        rules={[
          {
            required: true,
            validator,
          },
        ]}
        min={minGridNum}
        max={maxGridNum}
        maxPrecision={0}
      />
    </>
  );
});

export default GridNumFormItem;
