import React, { useState, useEffect } from "react";
import { CountUp } from "@krn/ui";
import { View } from "react-native";

export default () => {
  const [value, setValue] = useState(1);

  useEffect(() => {
    setInterval(() => {
      setValue(+(Math.random() * 1000).toFixed(3));
    }, 4000);
  }, []);

  return (
    <View>
      <CountUp value={value} />
    </View>
  );
};
