/**
 * Owner: willen@kupotech.com
 */
import { exitRN } from "@krn/bridge";
import { Text, Pressable } from "react-native";
import { Header, useUIContext } from "@krn/ui";
import React from "react";
import { useNavigation } from "@react-navigation/native";

export default ({ title }) => {
  const { currentTheme, setCurrentTheme } = useUIContext();
  const navigation = useNavigation();
  return (
    <Header
      title={title}
      onPressBack={() => {
        if (navigation.canGoBack()) navigation.goBack();
        else exitRN();
      }}
      rightSlot={
        <Pressable
          onPress={() => {
            setCurrentTheme(currentTheme === "light" ? "dark" : "light");
          }}
        >
          <Text>{currentTheme === "light" ? "🌚" : "🌞"}</Text>
        </Pressable>
      }
    />
  );
};
