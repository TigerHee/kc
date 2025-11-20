import React, { useState } from "react";
import { View, Text } from "react-native";
import { Slider } from "@krn/ui";

export default () => {
  const [value, setValue] = useState(0);

  return (
    <View>
      <Text>value: {value}</Text>

      <Slider
        value={value}
        onValueChange={(val) => setValue(val)}
        thumbStyle={{
          backgroundColor: "#f8a1d6",
          borderColor: "#a4126e",
          borderRadius: 10,
          borderWidth: 5,
          height: 20,
          shadowColor: "black",
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.35,
          shadowRadius: 2,
          width: 20,
        }}
        trackStyle={{
          backgroundColor: "#eee",
          borderRadius: 4,
          height: 10,
          shadowColor: "black",
          shadowOffset: {
            width: 0,
            height: 1,
          },
          shadowOpacity: 0.15,
          shadowRadius: 1,
        }}
      />
    </View>
  );
};
