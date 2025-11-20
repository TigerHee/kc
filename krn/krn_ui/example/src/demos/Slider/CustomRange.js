import React, { useState } from "react";
import { Text, View } from "react-native";
import { Slider } from "@krn/ui";

export default () => {
  const [value, setValue] = useState(6);

  return (
    <View>
      <Text>value: {value}</Text>
      <Slider
        maximumValue={20}
        minimumValue={4}
        value={value}
        onValueChange={(val) => setValue(val)}
      />
    </View>
  );
};
