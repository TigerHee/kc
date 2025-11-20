import React, {useMemo} from 'react';

import {Select} from 'components/Common/Select';
import {FilterDateUnitPrefix} from 'constants/date';
import useLang from 'hooks/useLang';

const makeOptions = _t => [
  {
    label: _t('36d4dfb1e9454000a4a7', {
      num: 7,
    }),
    value: `${FilterDateUnitPrefix.Day}7`,
  },

  {
    label: _t('36d4dfb1e9454000a4a7', {
      num: 30,
    }),
    value: `${FilterDateUnitPrefix.Day}30`,
  },

  {
    label: _t('7c53ceba31ad4000a2d6', {num: 3}),
    value: `${FilterDateUnitPrefix.Month}3`,
  },
  {
    label: _t('7c53ceba31ad4000a2d6', {num: 6}),
    value: `${FilterDateUnitPrefix.Month}6`,
  },
  {
    label: _t('77f38e567dd84000a783', {num: 1}),
    value: `${FilterDateUnitPrefix.Year}1`,
  },
  {
    label: _t('m6TjFvWkxDKvWjD4wm7Xvi'),
    value: '',
  },
];

const DatePicker = ({value, onChange}) => {
  const {_t} = useLang();

  const options = useMemo(() => makeOptions(_t), [_t]);
  return (
    <Select
      options={options}
      defaultValue={''}
      value={value}
      onChange={onChange}
    />
  );
};

export default DatePicker;
