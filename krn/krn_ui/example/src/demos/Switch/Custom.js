import React from "react";
import { Switch } from "@krn/ui";
import { View } from "react-native";
import { showToast } from "@krn/bridge";

export default () => {
  const onChange = (val) => {
    showToast("checked: " + val);
  };

  return (
    <View>
      <Switch
        checked
        onChange={onChange}
        checkedBg="#0f0"
        unCheckedBg="#f00"
      />
    </View>
  );
};
