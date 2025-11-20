import React, { useRef } from "react";
import { Swipeable, Button } from "@krn/ui";
import { Pressable, Text, View } from "react-native";

export default () => {
  let s = useRef(null);

  const leftButtons = [
    <Pressable
      style={{
        backgroundColor: "red",
        flex: 1,
        alignItems: "flex-end",
        justifyContent: "center",
      }}
      onPress={() => {
        s?.recenter && s?.recenter();
      }}
    >
      <View>
        <Text>click to close</Text>
      </View>
    </Pressable>,
  ];

  const rightButtons = [
    <View style={{ backgroundColor: "green", flex: 1 }} />,
    <Pressable
      style={{ backgroundColor: "red", flex: 1 }}
      onPress={() => {
        s?.recenter && s?.recenter();
      }}
    >
      <View>
        <Text>click to close</Text>
      </View>
    </Pressable>,
  ];

  return (
    <View style={{ overflow: "hidden" }}>
      <Button
        style={{ marginBottom: 20 }}
        onPress={() => s?.initOpenLeft && s?.initOpenLeft()}
      >
        open left
      </Button>
      <Button
        style={{ marginBottom: 20 }}
        onPress={() => s?.initOpenRight && s?.initOpenRight()}
      >
        open right
      </Button>
      <Swipeable
        leftButtons={leftButtons}
        leftButtonWidth={150}
        rightButtons={rightButtons}
        rightButtonWidth={100}
        onRef={(ref) => (s = ref)}
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
