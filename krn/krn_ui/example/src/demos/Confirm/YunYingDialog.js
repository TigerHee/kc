import React from 'react';
import { Confirm, Button } from '@krn/ui';
import { View } from 'react-native';
import styled from '@emotion/native';

const CustomContent = styled.Pressable`
  background: #01bc8d;
  width: 85%;
  height: 370px;
  border-radius: 16px;
  overflow: hidden;
`;

export default () => {
  const [show, setShow] = React.useState(false);
  return (
    <View>
      <Button onPress={() => setShow(true)}>运营弹窗</Button>

      <Confirm show={show} onClose={() => setShow(false)} showCloseX={true}>
        <CustomContent onPress={() => setShow(false)} />
      </Confirm>
    </View>
  );
};
