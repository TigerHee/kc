import React from "react";
import { Checkbox, Button } from "@krn/ui";
import { View } from "react-native";

export default () => {
  const [disabled, setDisabled] = React.useState(false);
  return (
    <View>
      <Button onPress={() => setDisabled((i) => !i)}>Toggle</Button>
      <Checkbox disabled={disabled}>张三</Checkbox>
      <Checkbox checked disabled={disabled}>
        李四
      </Checkbox>
    </View>
  );
};
