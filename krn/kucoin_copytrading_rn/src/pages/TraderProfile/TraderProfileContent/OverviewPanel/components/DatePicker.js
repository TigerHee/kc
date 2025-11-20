import React from 'react';

import {Select} from 'components/Common/Select';
import useLang from 'hooks/useLang';
import {makeOverViewDatePeriodOptions} from '../constant';

const DatePicker = ({value, onChange}) => {
  const {_t} = useLang();
  const options = makeOverViewDatePeriodOptions({_t});

  return <Select options={options} value={value} onChange={onChange} />;
};

export default DatePicker;
