import React, { useState } from 'react';
import { Select } from '@krn/ui';
import { ScrollView, View, Text } from 'react-native';
import styled from '@emotion/native';

const options = [...Array(3).keys()].map((item) => {
  return {
    label: '选项' + (item + 1),
    value: item,
  };
});

const SelectBox = styled.View`
  border-width: 1px;
  border-style: solid;
  border-radius: 8px;
  margin-bottom: 20px;
  border-color: ${({ theme }) => theme.colorV2.icon40};
`;

export default () => {
  const [v1, setV1] = useState('');
  const [v2, setV2] = useState([]);

  return (
    <ScrollView>
      <View style={{ marginBottom: 4 }}>
        <Text>单选：</Text>
      </View>
      <SelectBox>
        <Select value={v1} onChange={setV1} options={options} />
      </SelectBox>

      <View style={{ marginBottom: 4 }}>
        <Text>多选：</Text>
      </View>
      <SelectBox>
        <Select value={v2} onChange={setV2} options={options} multiple />
      </SelectBox>
    </ScrollView>
  );
};
