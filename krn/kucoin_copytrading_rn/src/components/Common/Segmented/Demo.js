import React from 'react';
import {Text} from 'react-native';

import Segmented from '.';
export const SegmentedDemo = () => {
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
    <>
      <Text style={{margin: 12}}>Segmented | 分段控制器</Text>
      <Segmented options={options} />
    </>
  );
};
