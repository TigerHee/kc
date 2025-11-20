import React from "react";
import { Badge } from "@krn/ui";
import { View } from "react-native";
import styled from "@emotion/native";

const BadgeWithColor = styled(Badge)`
  background: red;
`;

export default () => {
  return (
    <View style={{ flexDirection: "row" }}>
      <View style={{ flexDirection: "row", marginRight: 20 }}>
        <BadgeWithColor />
      </View>
      <View style={{ flexDirection: "row", marginRight: 20 }}>
        <BadgeWithColor
          style={{ marginLeft: 100 }}
          text={123}
          textStyle={{ color: "green" }}
        />
      </View>
    </View>
  );
};
