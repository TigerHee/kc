import React from "react";
import { Switch } from "@krn/ui";
import { View } from "react-native";

export default () => {
  return (
    <View>
      <View style={{ marginBottom: 20 }}>
        <Switch size={12} />
      </View>
      <View style={{ marginBottom: 20 }}>
        <Switch size={16} />
      </View>
      <View>
        <Switch size={20} />
      </View>
    </View>
  );
};
