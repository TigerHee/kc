import React from "react";
import { Button } from "@krn/ui";
import { View } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default () => {
  const navigation = useNavigation();
  return (
    <View>
      <Button onPress={() => navigation.navigate("FallbackPageDemo")}>
        点击跳转
      </Button>
    </View>
  );
};
