/**
 * Owner: garuda@kupotech.com
 * 计算器 ROE Form input 控件
 */

import React, { useCallback } from 'react';

import Form from '@mui/Form';

import FormNumberItem from './FormNumberItem';
import SizeRate from './SizeRate';

import { _t } from '../../../builtinCommon';
import { getPlaceholder } from '../../../utils';
import { FormItemLabel } from '../../commonStyle';
import { ROE_RATES, ROE_STEP } from '../config';

const { useFormInstance } = Form;
const ROEField = () => {
  const form = useFormInstance();
  const rateRef = React.useRef(null);

  const validator = (__, value) => {
    if (!value) {
      return Promise.reject(_t('calc.input.empty.roe'));
    }
    return Promise.resolve();
  };

  const helperText = React.useMemo(() => {
    const errors = form.getFieldError('profitRate');
    if (errors && errors.length) {
      return errors[0];
    }
    return false;
    // 不需要监控 form
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Size 输入框变动时，重置百分比选择
  const handleChange = useCallback(() => {
    if (rateRef && rateRef.current) {
      rateRef.current.reset();
    }
  }, []);

  return (
    <FormNumberItem
      name={'profitRate'}
      label={
        <FormItemLabel>
          <span className="label">{_t('calc.roe')}</span>
        </FormItemLabel>
      }
      validator={validator}
      unit={'%'}
      step={ROE_STEP}
      placeholder={getPlaceholder(ROE_STEP)}
      inputProps={{
        helperText,
        onChange: handleChange,
      }}
      footer={<SizeRate name={'profitRate'} rates={ROE_RATES} />}
    />
  );
};

export default React.memo(ROEField);
