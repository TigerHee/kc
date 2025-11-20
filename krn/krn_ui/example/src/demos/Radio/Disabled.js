import React from "react";
import { Radio, Button } from "@krn/ui";
import { View } from "react-native";

export default () => {
  const [disabled, setDisabled] = React.useState(false);
  return (
    <View>
      <Button onPress={() => setDisabled((i) => !i)}>Toggle</Button>
      <Radio disabled={disabled}>张三</Radio>
      <Radio checked disabled={disabled}>
        李四
      </Radio>
    </View>
  );
};
