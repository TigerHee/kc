import React from 'react';
import { Drawer, Button } from '@krn/ui';
import { ScrollView, Text, View } from 'react-native';

export default () => {
  const [show, setShow] = React.useState(false);
  return (
    <View>
      <Button onPress={() => setShow(true)}>显示抽屉</Button>
      <Drawer
        show={show}
        onClose={() => setShow(false)}
        title="Libero felis nunc"
        headerType="native"
      >
        <ScrollView style={{ height: 150, margin: 16 }}>
          <Text>
            Laoreet mauris risus ullamcorper fermentum sed massa est. Viverra sit sapien dignissim
            at. Et leo urna non varius neque massa amet imperdiet viverra.
          </Text>
          <View
            style={{
              height: 24,
              backgroundColor: 'red',
            }}
          >
            <Text>24px</Text>
          </View>
        </ScrollView>
      </Drawer>
    </View>
  );
};
