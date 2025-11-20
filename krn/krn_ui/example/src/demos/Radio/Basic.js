import React from "react";
import { Radio } from "@krn/ui";
import { View } from "react-native";

export default () => {
  const [checked, setChecked] = React.useState(false);
  const [checked1, setChecked1] = React.useState(false);
  return (
    <View style={{ flexDirection: "row" }}>
      <Radio checked={checked} onChange={setChecked}>
        张三
      </Radio>
      <Radio
        checked={checked1}
        onChange={setChecked1}
        style={{ marginLeft: 10 }}
      >
        李四
      </Radio>
    </View>
  );
};
