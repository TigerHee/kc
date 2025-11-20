import React, { useState } from 'react';
import { Select } from '@krn/ui';
import { ScrollView, View, Text } from 'react-native';
import styled from '@emotion/native';

const options = [...Array(6).keys()].map((item) => {
  return {
    label: '选项' + (item + 1),
    value: item,
  };
});

const SelectBox = styled.View`
  margin-bottom: 20px;
`;

export default () => {
  const [v1, setV1] = useState('');
  const [v2, setV2] = useState([]);

  return (
    <ScrollView>
      <View style={{ marginBottom: 4 }}>
        <Text>单选：</Text>
      </View>

      <View style={{ marginBottom: 4 }}>
        <Text>一行3个</Text>
      </View>
      <SelectBox>
        <Select listDirection="row" colNumber={3} value={v1} onChange={setV1} options={options} />
      </SelectBox>

      <View style={{ marginBottom: 4 }}>
        <Text>一行2个</Text>
      </View>
      <SelectBox>
        <Select listDirection="row" colNumber={2} value={v1} onChange={setV1} options={options} />
      </SelectBox>

      <View style={{ marginBottom: 4 }}>
        <Text>一行4个</Text>
      </View>
      <SelectBox>
        <Select
          listDirection="row"
          colNumber={4}
          layoutPercentConfig={{
            marginLeft: 2,
            marginTop: 4,
          }}
          value={v1}
          onChange={setV1}
          options={options}
        />
      </SelectBox>

      <View style={{ marginBottom: 4 }}>
        <Text>多选：</Text>
      </View>
      <SelectBox>
        <Select listDirection="row" value={v2} onChange={setV2} options={options} multiple />
      </SelectBox>
    </ScrollView>
  );
};
