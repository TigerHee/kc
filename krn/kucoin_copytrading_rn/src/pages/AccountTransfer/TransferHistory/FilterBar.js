import React, {useState} from 'react';
import {css} from '@emotion/native';

import {Select} from 'components/Common/Select';
import {FilterBarWrap} from './styles';

const OPTIONS = [
  {
    label: '近7日',
    value: 7,
  },

  {
    label: '近30日',
    value: 30,
  },

  {
    label: '近90日',
    value: 90,
  },
  {
    label: '近半年',
    value: 180,
  },
];

const FilterBar = () => {
  const [val, setVal] = useState(30);
  return (
    <FilterBarWrap>
      <Select
        style={css`
          margin-left: 16px;
        `}
        options={OPTIONS}
        defaultValue={30}
        value={val}
        onChange={setVal}
      />
    </FilterBarWrap>
  );
};

export default FilterBar;
