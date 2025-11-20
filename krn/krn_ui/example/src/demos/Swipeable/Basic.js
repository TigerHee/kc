import React from "react";
import { Swipeable } from "@krn/ui";
import { Text, View } from "react-native";

export default () => {
  const leftButtons = [<View style={{ backgroundColor: "blue", flex: 1 }} />];
  const rightButtons = [
    <View style={{ backgroundColor: "green", flex: 1 }} />,
    <View style={{ backgroundColor: "red", flex: 1 }} />,
  ];

  return (
    <View style={{ overflow: "hidden" }}>
      <Swipeable
        leftButtons={leftButtons}
        leftButtonWidth={150}
        rightButtons={rightButtons}
        rightButtonWidth={100}
      >
        <View
          style={{
            backgroundColor: "#eee",
            height: 60,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text>{"<---"} pull left</Text>
          <Text> pull right {"--->"}</Text>
        </View>
      </Swipeable>
    </View>
  );
};
