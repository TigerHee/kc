import React from "react";
import { Empty } from "@krn/ui";
import { Image, View } from "react-native";

export default () => {
  return (
    <View>
      <Empty text="自定义内容" textStyle={{ color: "#f00" }} />
      <Empty
        text="自定义图片"
        image={
          <Image
            style={{ width: 100, height: 100 }}
            source={{
              uri: "https://assets.staticimg.com/kucoins-web/1.3.2/static/empty.e13d69a0.png",
            }}
          />
        }
        style={{ marginTop: 20 }}
      />
    </View>
  );
};
