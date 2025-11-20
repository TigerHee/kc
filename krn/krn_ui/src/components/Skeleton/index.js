/**
 * Owner: willen@kupotech.com
 */
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import styled from "@emotion/native";
import API from "./API";
import registerAPI from "utils/registerAPI";
import SkeletonContext from "./context";
import useTheme from "hooks/useTheme";
import { Animated, Easing } from "react-native";
import useUIContext from "hooks/useUIContext";

const SkeletonBox = styled.View`
  flex-direction: row;
`;
const SkeletonColBox = styled.View``;
const SkeletonLine = styled.View`
  height: 20px;
  border-radius: 4px;
  position: relative;
`;
const SkeletonLineActive = styled(Animated.View)`
  position: absolute;
  height: 100%;
  left: 0;
  top: 0;
  border-radius: 4px;
`;
const SkeletonSquare = styled.View`
  width: 40px;
  height: 40px;
  border-radius: 4px;
`;
const SkeletonCircle = styled.View`
  width: 40px;
  height: 40px;
  border-radius: 20px;
`;

const SkeletonCol = ({ style, children }) => {
  return <SkeletonColBox style={style}>{children}</SkeletonColBox>;
};

const SkeletonRow = ({ type = "line", style, active, color, activeColor }) => {
  const activeVal = useRef(new Animated.Value(0)).current;
  const { options } = useContext(SkeletonContext);
  const theme = useTheme();
  const { currentTheme } = useUIContext();
  const commonStyle = useMemo(() => {
    return {
      backgroundColor:
        color ||
        options.color ||
        (currentTheme === "light"
          ? theme.color.complementary8
          : theme.color.complementary16),
      marginBottom: 10,
    };
  }, [options, color, currentTheme, theme]);

  useEffect(() => {
    if (active === false) return;
    if (active || (options.active && type === "line")) {
      Animated.loop(
        Animated.timing(activeVal, {
          toValue: 1,
          duration: 1000,
          easing: Easing.ease,
          useNativeDriver: false,
          isInteraction: false,
        })
      ).start();
    }
  }, [options, type, active]);

  return type === "line" ? (
    <SkeletonLine style={[commonStyle, style]}>
      <SkeletonLineActive
        style={{
          backgroundColor:
            activeColor || options.activeColor || theme.color.complementary2,
          width: activeVal.interpolate({
            inputRange: [0, 1],
            outputRange: ["0%", "100%"],
          }),
        }}
      />
    </SkeletonLine>
  ) : type === "square" ? (
    <SkeletonSquare style={[commonStyle, style]} />
  ) : type === "circle" ? (
    <SkeletonCircle style={[commonStyle, style]} />
  ) : null;
};

const Skeleton = ({ style, children, color, active, activeColor }) => {
  const [options, setOptions] = useState({});

  useEffect(() => {
    setOptions({ color, active, activeColor });
  }, [color, active, activeColor]);

  const contextValue = useMemo(() => {
    return { options, setOptions };
  }, [options]);

  return (
    <SkeletonContext.Provider value={contextValue}>
      <SkeletonBox style={style}>{children}</SkeletonBox>
    </SkeletonContext.Provider>
  );
};

Skeleton.Row = SkeletonRow;
Skeleton.Col = SkeletonCol;

registerAPI(Skeleton, API);

export default Skeleton;
