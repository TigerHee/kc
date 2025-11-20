import React, { useState } from "react";
import { View, Text } from "react-native";
import { Slider } from "@krn/ui";

export default () => {
  const [value, setValue] = useState([6, 18]);

  return (
    <View>
      <Text>value: {value.join("-")}</Text>
      <Slider
        value={value}
        maximumValue={20}
        minimumValue={4}
        onValueChange={(val) => {
          setValue(val);
        }}
      />
    </View>
  );
};
