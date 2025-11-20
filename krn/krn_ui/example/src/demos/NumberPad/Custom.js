import React from "react";
import { NumberPad } from "@krn/ui";
import { Image, View } from "react-native";
import backImg from "assets/light/back.png";
import useTheme from "hooks/useTheme";

export default () => {
  const theme = useTheme();
  return (
    <View style={{ backgroundColor: theme.color.complementary12 }}>
      <NumberPad
        numberFontSize={32}
        itemHeight={65}
        dot={false}
        deleteImage={
          <Image source={backImg} style={{ width: 36, height: 36 }} />
        }
        touchHighlightColor={theme.color.primary}
        throttleDuration={300}
        onChange={(e) => console.log(e + " 被点击了")}
        gutter={10}
      />
    </View>
  );
};
