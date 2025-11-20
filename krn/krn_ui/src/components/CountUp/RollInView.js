/**
 * Owner: willen@kupotech.com
 */
import React, { useRef, useEffect } from "react";
import { Animated, Easing } from "react-native";

export default ({
  style,
  children,
  num,
  isRollUp = false,
  height = 24,
  duration = 600,
}) => {
  const offset = useRef(new Animated.Value(isRollUp ? 0 : -height)).current;

  useEffect(() => {
    let toValue = 0;
    if (offset._value === -height) {
      if (isRollUp) {
        offset.setValue(0);
        toValue = -height;
      } else {
        offset.setValue(-height);
      }
    } else {
      if (isRollUp) {
        offset.setValue(0);
        toValue = -height;
      } else {
        offset.setValue(-height);
      }
    }

    Animated.timing(offset, {
      toValue,
      duration,
      easing: Easing.linear,
      useNativeDriver: true,
      isInteraction: false,
    }).start();
  }, [offset, isRollUp, num, duration, height]);

  return (
    <Animated.View
      style={{
        ...style,
        height: height * 2,
        justifyContent: "flex-end",
        flexDirection: isRollUp ? "column" : "column-reverse",
        transform: [{ translateY: offset }],
      }}
    >
      {children}
    </Animated.View>
  );
};
