import React from 'react';
import { Tabs } from '@krn/ui';
import styled from '@emotion/native';
import { Text } from 'react-native';

const { Tab } = Tabs;

const Wrapper = styled.View`
  flex-direction: row;
  margin-top: 10px;
  margin-bottom: 10px;
`;

export default () => {
  const [value, setValue] = React.useState('index1');
  return (
    <>
      <Text>Normal Size</Text>
      <Wrapper>
        <Tabs variant="border" value={value} onChange={(val) => setValue(val)}>
          <Tab label="Not Triggered(2)" value="index1" />
          <Tab label="Open Orders(3)" value="index2" />
          <Tab label="Open Orders(3)" value="index3" />
          <Tab label="Trades4" value="index4" />
          <Tab label="Depth4" value="index5" />
        </Tabs>
      </Wrapper>
      <Text>Large Size</Text>
      <Wrapper>
        <Tabs size="large" variant="border" value={value} onChange={(val) => setValue(val)}>
          <Tab label="Not Triggered(2)" value="index1" />
          <Tab label="Open Orders(3)" value="index2" />
          <Tab label="Open Orders(3)" value="index3" />
          <Tab label="Trades4" value="index4" />
          <Tab label="Depth4" value="index5" />
        </Tabs>
      </Wrapper>
    </>
  );
};
