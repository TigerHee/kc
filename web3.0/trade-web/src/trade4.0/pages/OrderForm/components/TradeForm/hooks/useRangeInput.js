/*
 * @owner: odan.ou@kupotech.com
 */
import React, { useMemo, useCallback } from 'react';
import { multiply } from 'helper';
import { isMinStep } from '@/utils/format';
import { _t } from 'src/utils/lang';
import Unit from '../components/Unit';
import { PercentButtonsSuffix } from '../style';

const rangeValidator = (_, val) => {
  let errorStr = '';
  if (!val || val > 20 || val < 0.1) {
    errorStr = _t('trd.form.tso.ratio.range');
  } else if (!isMinStep(val, 0.1)) {
    errorStr = _t('trd.form.step.amount.mode.err', { amount: '0.1%' });
  }
  return errorStr ? Promise.reject(errorStr) : Promise.resolve();
};

// 比率范围
const useRangeInput = (conf) => {
  const { name, setFieldsValue, validator = rangeValidator } = conf;
  const onChange = useCallback((val) => {
    setFieldsValue({
      [name]: multiply(val, 100),
    });
  }, [setFieldsValue, name]);
  const btns = useMemo(() => {
    const multis = [0.01, 0.05];
    return <PercentButtonsSuffix multis={multis} onChange={onChange} />;
  }, [onChange]);

  return {
    formItemProps: {
      name,
      rules: [
        {
          validator,
        },
      ],
    },
    inputProps: {
      unit: <Unit coinName="%" />,
      controls: false,
      suffix: btns,
    },
  };
};

export default useRangeInput;
