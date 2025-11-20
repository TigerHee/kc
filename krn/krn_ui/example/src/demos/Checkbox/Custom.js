import React from 'react';
import { Checkbox } from '@krn/ui';
import { View, Text } from 'react-native';

export default () => {
  const [checked, setChecked] = React.useState(false);
  return (
    <View>
      <Checkbox
        checked={checked}
        onChange={(val) => setChecked(val)}
        style={{ marginBottom: 10 }}
        checkboxStyle={{ width: 32, height: 32, borderRadius: 16 }}
      >
        自定义checkbox宽高
      </Checkbox>

      <Checkbox checked={checked} onChange={(val) => setChecked(val)} style={{ marginBottom: 10 }}>
        <Text style={{ color: '#f00' }}>自定义checkbox文本样式</Text>
      </Checkbox>

      <Checkbox checked={checked} onChange={(val) => setChecked(val)} />
    </View>
  );
};
