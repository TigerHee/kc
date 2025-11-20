import React, { useState } from "react";
import { Loading, Button } from "@krn/ui";
import { View } from "react-native";

export default () => {
  const [spin, setSpin] = useState(false);
  return (
    <View>
      <Button onPress={() => setSpin((i) => !i)} style={{ marginBottom: 10 }}>
        Loading2
      </Button>
      <Loading size="large" spin={spin}>
        <View
          style={{
            width: 200,
            height: 100,
            backgroundColor: "#f00",
          }}
        />
      </Loading>
      <View style={{ marginTop: 20 }} />
      <Loading
        size="large"
        spin={spin}
        coverElementStyle={{ backgroundColor: "#0ff" }}
      >
        <View
          style={{
            width: 200,
            height: 100,
            backgroundColor: "#f00",
          }}
        />
      </Loading>
    </View>
  );
};
