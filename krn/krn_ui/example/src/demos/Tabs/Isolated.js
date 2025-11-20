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
        <Tabs variant="isolated" value={value} onChange={(val) => setValue(val)}>
          <Tab label="Order book" value="index1" />
          <Tab label="Trades Trades" value="index2" />
          <Tab label="Depth Trades" value="index3" />
          <Tab label="Trades4" value="index4" />
          <Tab label="Depth4" value="index5" />
        </Tabs>
      </Wrapper>
      <Text>Large Size</Text>
      <Wrapper>
        <Tabs size="large" variant="isolated" value={value} onChange={(val) => setValue(val)}>
          <Tab label="Order book" value="index1" />
          <Tab label="Trades" value="index2" />
          <Tab label="Depth" value="index3" />
          <Tab label="Trades4" value="index4" />
          <Tab label="Depth4" value="index5" />
        </Tabs>
      </Wrapper>
    </>
  );
};
