import React, { useState, useEffect } from "react";
import { CountUp } from "@krn/ui";
import { View } from "react-native";
import styled from "@emotion/native";
import useTheme from "hooks/useTheme";

const WrapCountUp = styled(CountUp)`
  height: 40px;
`;

export default () => {
  const theme = useTheme();
  const [value, setValue] = useState(1);

  useEffect(() => {
    setInterval(() => {
      setValue(+(Math.random() * 1000).toFixed(8));
    }, 4000);
  }, []);

  return (
    <View>
      <WrapCountUp
        value={value}
        duration={2000}
        textStyle={{ fontSize: 30, color: theme.color.primary }}
      />
    </View>
  );
};
