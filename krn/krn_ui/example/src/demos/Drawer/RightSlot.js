import React from 'react';
import { Drawer, Button } from '@krn/ui';
import { ScrollView, Text, View, Image, Pressable } from 'react-native';
import closeIconLight from 'assets/light/close_common.png';
import { showToast } from '@krn/bridge';

export default () => {
  const [show, setShow] = React.useState(false);
  return (
    <View>
      <Button onPress={() => setShow(true)}>显示抽屉</Button>
      <Drawer
        show={show}
        onClose={() => setShow(false)}
        title="标题标题标题标题标题"
        rightSlot={
          <Pressable
            style={{ width: 40, alignItems: 'flex-end' }}
            onPress={() => showToast('right click')}
          >
            <Image source={closeIconLight} style={{ height: 20, width: 20 }} />
          </Pressable>
        }
      >
        <ScrollView style={{ height: 150, margin: 10 }}>
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
        </ScrollView>
      </Drawer>
    </View>
  );
};
