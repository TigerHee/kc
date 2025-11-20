/**
 * Owner: willen@kupotech.com
 */
import React, { useRef, useEffect } from 'react';
import { Animated, Easing } from 'react-native';

export default ({ style, children, value, diameter }) => {
  const offset = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let toValue;
    if (value) {
      toValue = 1;
    } else {
      toValue = 0;
    }
    Animated.timing(offset, {
      toValue,
      duration: 200,
      easing: Easing.linear,
      useNativeDriver: false,
      isInteraction: false,
    }).start();
  }, [offset, value]);

  return (
    <Animated.View
      style={{
        ...style,
        width: offset.interpolate({
          inputRange: [0, !value ? 0.7 : 0.3, 1],
          outputRange: [diameter, diameter * 1.3, diameter],
        }),
        transform: [
          {
            translateX: offset.interpolate({
              inputRange: [0, 1],
              outputRange: [0, diameter],
            }),
          },
        ],
      }}
    >
      {children}
    </Animated.View>
  );
};
