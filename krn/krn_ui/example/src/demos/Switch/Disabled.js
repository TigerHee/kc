import React, { useState } from "react";
import { Switch, Button } from "@krn/ui";
import { View } from "react-native";

export default () => {
  const [disabled, setDisabled] = useState(true);

  const onPress = () => {
    setDisabled(disabled ? false : true);
  };
  return (
    <View>
      <Button onPress={onPress} style={{ marginBottom: 20 }}>
        Toggle disabled
      </Button>

      <View>
        <Switch disabled={disabled} />
      </View>
    </View>
  );
};
