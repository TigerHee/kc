/**
 * Owner: garuda@kupotech.com
 */
import React from 'react';

import { map, find } from 'lodash';

import Form from '@mui/Form';

import { formatNumberKMB } from '../../../builtinCommon';

import ButtonGroup, { Button } from '../../ButtonGroup';

const { useFormInstance, useWatch } = Form;
const SizeRate = ({ name, rates, formatLabel }, ref) => {
  const form = useFormInstance();
  const [rate, setRate] = React.useState(0);

  const sizeFieldValue = useWatch(name, form);

  const handleRateChange = (e, v) => {
    let value = v;
    if (!v) {
      value = rate || 10;
    }
    form.setFieldsValue({ [name]: value });
  };

  React.useImperativeHandle(ref, () => ({
    reset: () => {
      setRate(0);
    },
  }));

  React.useEffect(() => {
    if (find(rates, (item) => item.value === Number(sizeFieldValue))) {
      setRate(Number(sizeFieldValue));
    } else {
      setRate(0);
    }
  }, [rates, sizeFieldValue]);

  return (
    <ButtonGroup value={rate} onChange={handleRateChange}>
      {map(rates, ({ value, label }) => (
        <Button key={value} value={value}>
          {formatLabel ? formatNumberKMB(label, { formatProps: { dropZ: true } }) : label}
        </Button>
      ))}
    </ButtonGroup>
  );
};

export default React.memo(React.forwardRef(SizeRate));
