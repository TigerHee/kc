import React, {memo} from 'react';
import {View} from 'react-native';
import {css} from '@emotion/native';

import Selector from 'components/Common/Selector';
import useLang from 'hooks/useLang';

const options = [
  {
    label: '≥ 7d',
    value: '7',
  },
  {
    label: '≥ 30d',
    value: '30',
  },
  {
    label: '≥ 90d',
    value: '90',
  },

  {
    label: '≥ 180d',
    value: '180',
  },
];
const RangeSelector = memo(({value, onChange}) => {
  const {_t} = useLang();
  return (
    <View
      style={css`
        margin-top: 16px;
        margin-bottom: 24px;
      `}>
      <Selector
        title={_t('aba03b78f7904000a3c9')}
        options={options}
        multiple={false}
        value={value}
        onChange={onChange}
      />
    </View>
  );
});

export default RangeSelector;
