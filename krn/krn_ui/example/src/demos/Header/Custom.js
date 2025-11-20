import React from "react";
import { Header } from "@krn/ui";
import { Text, View } from "react-native";
export default () => {
  return (
    <Header
      leftSlot={
        <View>
          <Text>👈</Text>
        </View>
      }
      rightSlot={
        <View>
          <Text>👉</Text>
        </View>
      }
      title={<Text style={{ color: "#f00" }}>自定义标题</Text>}
      style={{ backgroundColor: "yellowgreen" }}
    />
  );
};
