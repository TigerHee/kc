import React from 'react';
import { Tabs } from '@krn/ui';
import styled from '@emotion/native';
import { Text, View } from 'react-native';

const { Tab } = Tabs;

const Wrapper = styled.View`
  margin-top: 10px;
  margin-bottom: 10px;
`;

export default () => {
  const [value, setValue] = React.useState('index1');
  
  return (
    <>
      <Text>Normal Size</Text>
        <Tabs value={value} onChange={(val) => setValue(val)}>
          <Tab label="Order book" value="index1" />
          <Tab label="Trades" value="index2" />
        </Tabs>
      <Wrapper>
        <Tabs value={value} onChange={(val) => setValue(val)}>
          <Tab label="Order book" value="index1" />
          <Tab label="Trades" value="index2" />
          <Tab label={<Text style={{ color: '#f00' }}>Depth123132</Text>} value="index3" />
          <Tab label="Trades4" value="index4" />
          <Tab label="Depth5" value="index5" />
        </Tabs>
      </Wrapper>
      <Text>Large Size（不自动居中）</Text>
      <Wrapper>
        <Tabs autoCentered={false} size="large" value={value} onChange={(val) => setValue(val)}>
          <Tab label="Order book" value="index1" />
          <Tab label="Trades" value="index2" />
          <Tab label="Depth" value="index3" />
          <Tab label="Trades4" value="index4" />
          <Tab label="Depth5" value="index5" />
        </Tabs>
      </Wrapper>
    </>
  );
};
