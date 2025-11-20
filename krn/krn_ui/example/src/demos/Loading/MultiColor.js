import React from "react";
import { Loading } from "@krn/ui";
import { View } from "react-native";

export default () => {
  const LoadingStyle = { marginRight: 10 };
  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <Loading style={LoadingStyle} color="#f00" spin />
      <Loading style={LoadingStyle} color="#ff0" spin />
      <Loading style={LoadingStyle} color="#00f" spin />
      <Loading style={LoadingStyle} color="#000" spin />
    </View>
  );
};
