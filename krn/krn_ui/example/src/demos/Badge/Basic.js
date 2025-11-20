import React from "react";
import { Badge } from "@krn/ui";
import { View } from "react-native";

export default () => {
  return (
    <View style={{ flexDirection: "row" }}>
      <View style={{ flexDirection: "row", marginRight: 20 }}>
        <Badge />
      </View>
      <View style={{ flexDirection: "row", marginRight: 20 }}>
        <Badge text={123} />
      </View>
      <View style={{ flexDirection: "row", marginRight: 20 }}>
        <Badge text={123} overflowCount={100} />
      </View>
      <View style={{ flexDirection: "row" }}>
        <Badge text={"new"} />
      </View>
    </View>
  );
};
