import React from 'react';
import { Drawer, Button } from '@krn/ui';
import { ScrollView, Text, View } from 'react-native';
import styled from '@emotion/native';

const Wrapper = styled.View`
  padding: 12px 16px;
`;

export default () => {
  const [show, setShow] = React.useState(false);
  return (
    <View>
      <Button onPress={() => setShow(true)}>显示抽屉</Button>
      <Drawer show={show} onClose={() => setShow(false)} title="Title">
        <ScrollView style={{ height: 150 }}>
          <Wrapper>
            <Text>Top</Text>
            <Text>Hello</Text>
            <Text>Hello</Text>
            <Text>Hello</Text>
            <Text>Hello</Text>
            <Text>Hello</Text>
            <Text>Hello</Text>
            <Text>Hello</Text>
            <Text>Hello</Text>
            <Text>Hello</Text>
            <Text>Hello</Text>
            <Text>Bottom</Text>
          </Wrapper>
        </ScrollView>
      </Drawer>
    </View>
  );
};
