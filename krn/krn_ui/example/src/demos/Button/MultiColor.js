import React from "react";
import { Button } from "@krn/ui";
import { View } from "react-native";

export default () => {
  return (
    <View>
      <Button style={{ marginBottom: 5 }} color="#f00">
        #f00
      </Button>
      <Button style={{ marginBottom: 5 }} color="#ddd">
        #ddd
      </Button>
      <Button style={{ marginBottom: 5 }} color="#00f">
        #00f
      </Button>
      <Button style={{ marginBottom: 5 }} color="#000">
        #000
      </Button>
    </View>
  );
};
