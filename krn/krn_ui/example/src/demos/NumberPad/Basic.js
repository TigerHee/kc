import React from "react";
import { NumberPad } from "@krn/ui";
import { showToast } from "@krn/bridge";
import { View } from "react-native";

export default () => {
  return (
    <View>
      <NumberPad onChange={(e) => showToast(e + " 被点击了")} />
    </View>
  );
};
