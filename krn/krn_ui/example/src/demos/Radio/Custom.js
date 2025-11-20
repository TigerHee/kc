import React from "react";
import { Radio } from "@krn/ui";
import { View, Text } from "react-native";

export default () => {
  const [checked, setChecked] = React.useState(false);
  return (
    <View>
      <Radio
        checked={checked}
        onChange={(val) => setChecked(val)}
        style={{ marginBottom: 10 }}
        radioStyle={{
          width: 28,
          height: 28,
          borderTopLeftRadius: 14,
          borderTopRightRadius: 14,
          borderBottomLeftRadius: 14,
          borderBottomRightRadius: 14,
        }}
      >
        自定义checkbox宽高
      </Radio>
      <Radio
        checked={checked}
        onChange={(val) => setChecked(val)}
        style={{ marginBottom: 10 }}
      >
        <Text style={{ color: "#f00" }}>自定义checkbox文本样式</Text>
      </Radio>
      <Radio checked={checked} onChange={(val) => setChecked(val)} />
    </View>
  );
};
