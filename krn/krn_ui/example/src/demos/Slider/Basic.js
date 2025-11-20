import React, { useState } from "react";
import { View, Text } from "react-native";
import { Slider } from "@krn/ui";

export default () => {
  const [value, setValue] = useState(0);

  return (
    <View>
      <Text>value: {value}</Text>
      <Slider value={value} onValueChange={(val) => setValue(val)} />
    </View>
  );
};
