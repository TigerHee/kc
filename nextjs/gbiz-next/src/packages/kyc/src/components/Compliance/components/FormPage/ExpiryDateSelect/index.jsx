/**
 * Owner: tiger@kupotech.com
 * 证件到期日选择
 */
// eslint-disable-next-line no-restricted-imports
import moment from 'moment';
import { useEffect } from 'react';
import { Select, styled } from '@kux/mui';
import clsx from 'clsx';
import { EXPIRY_DATE_CODE } from '../../../config';
import useLang from '../../../../../hookTool/useLang';
import useCommonData from '../../../hooks/useCommonData';
import KycDatePicker from '../KycDatePicker';

const Wrapper = styled.div`
  .KuxSelect-root {
    margin-bottom: 0;
  }
  &.isShowPicker {
    .KuxSelect-root {
      margin-bottom: 24px;
    }
  }
`;

// const { FormItem } = Form;
export const expiryDateTypeKey = 'expiryDateType';
// 长期有效的值
export const MAX_DATE_VAL = 253370736000000;
// 指定日期
export const expiryDateType1 = 1;
// 长期有效
export const expiryDateType2 = 2;

export default ({ value, onChange, extraInitialValue, complianceMetaCode, form, ...otherProps }) => {
  const { onCacheFormData, formData } = useCommonData();
  const { _t } = useLang();

  useEffect(() => {
    if (+value === MAX_DATE_VAL) {
      onCacheFormData({ [expiryDateTypeKey]: expiryDateType2 });
    }
  }, [value]);

  const type = formData[expiryDateTypeKey] || expiryDateType1;
  const isShowPicker = type === expiryDateType1;

  return (
    <Wrapper
      className={clsx({
        isShowPicker,
      })}
    >
      <Select
        label={_t('cXkqU5X5M53kwUiWJs5aes')}
        options={[
          { label: _t('uTpvUs3TbNmZcBWpaFXA4P'), value: expiryDateType1 }, // 指定类型
          { label: _t('dUZNBxiyfmjpzLZFciU4A9'), value: expiryDateType2 }, // 长期有效
        ]}
        size="xlarge"
        labelProps={{ shrink: true }}
        fullWidth
        value={type}
        onChange={v => {
          const obj = { [expiryDateTypeKey]: v };
          if (v === expiryDateType1) {
            form.setFieldsValue({ [EXPIRY_DATE_CODE]: '' });
          } else {
            form.setFieldsValue({ [EXPIRY_DATE_CODE]: moment(MAX_DATE_VAL) });
          }

          onCacheFormData(obj);
        }}
        isShowPicker
      />
      {isShowPicker && (
        <KycDatePicker
          value={value}
          onChange={onChange}
          minDate={moment().subtract(5, 'years')}
          maxDate={moment().add(100, 'years')}
          {...otherProps}
        />
      )}
    </Wrapper>
  );
};
