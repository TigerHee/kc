import React from 'react';
import { Input } from '@krn/ui';
import { View, Text, Pressable, Image } from 'react-native';
import { showToast } from '@krn/bridge';
import searchImg from 'assets/light/search.png';
import styled from '@emotion/native';

const ExImage = styled.Image`
  width: 20px;
  height: 20px;
  margin-right: 9px;
`;

export default () => {
  const [value, setValue] = React.useState('hello');

  return (
    <View>
      <Input placeholder="Place holder" label="Label large" size="large" />
      <Input placeholder="Place holder" label="Label medium" size="medium" />
      <Input placeholder="Place holder" label="Label small" size="small" />
    </View>
  );
};
