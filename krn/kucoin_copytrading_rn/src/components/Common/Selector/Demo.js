import React, {useState} from 'react';
import {Text, View} from 'react-native';

import Selector from '.';

export const SelectorDemo = () => {
  const [value, setValue] = useState('');

  const options = [
    {
      label: 'High profit',
      value: 'High profit',
    },
    {
      label: 'Rising star',
      value: 'Rising star',
    },
    {
      label: 'Aggressive',
      value: 'Aggressive',
    },

    {
      label: 'Most Popular',
      value: 'Most Popular',
    },
  ];

  return (
    <View style={{marginTop: 12}}>
      <Selector
        title="请选择用户标签"
        options={options}
        multiple={true}
        value={value}
        onChange={setValue}
      />

      <Text style={{margin: 12}}>你选择了：{value?.join?.(',')}</Text>
    </View>
  );
};
