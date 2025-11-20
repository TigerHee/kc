import React, { useState } from "react";
import { Swipeable } from "@krn/ui";
import { Text, View } from "react-native";

export default () => {
  const [activated, setActivated] = useState(false);

  const leftContent = (
    <View
      style={{
        flex: 1,
        alignItems: "flex-end",
        justifyContent: "center",
        backgroundColor: activated ? "green" : "red",
      }}
    >
      <Text>{activated ? "release" : "keep pulling"}</Text>
    </View>
  );

  return (
    <View style={{ overflow: "hidden" }}>
      <Swipeable
        leftContent={leftContent}
        leftActionActivationDistance={150}
        onLeftActionActivate={() => {
          setActivated(true);
        }}
        onLeftActionDeactivate={() => {
          setActivated(false);
        }}
      >
        <View
          style={{
            backgroundColor: "#eee",
            height: 60,
            justifyContent: "center",
          }}
        >
          <Text>{"<---"} pull left</Text>
        </View>
      </Swipeable>
    </View>
  );
};
