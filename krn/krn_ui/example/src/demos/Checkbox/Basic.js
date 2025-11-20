import React from 'react';
import { Checkbox } from '@krn/ui';
import { View, Text } from 'react-native';

export default () => {
  const [checked, setChecked] = React.useState(false);
  return (
    <View style={{ flexDirection: 'row' }}>
      <Checkbox checked={checked} onChange={(val) => setChecked(val)}>
        张三
      </Checkbox>

      <Checkbox
        checked={checked}
        onChange={(val) => setChecked(val)}
        checkedType={1}
        style={{ marginLeft: 20 }}
      >
        李四
      </Checkbox>

      <Checkbox
        size="large"
        checked={checked}
        onChange={(val) => setChecked(val)}
        style={{ marginLeft: 20 }}
      >
        张三
      </Checkbox>

      <Checkbox
        size="large"
        checked={checked}
        onChange={(val) => setChecked(val)}
        checkedType={1}
        style={{ marginLeft: 20 }}
      >
        李四
      </Checkbox>
    </View>
  );
};
