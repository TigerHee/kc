import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Animated, Easing} from 'react-native';
import styled from '@emotion/native';
import {useTheme} from '@krn/ui';

const TabsWrapper = styled.View`
  flex-direction: row;
  height: 40px;
  padding: 10px 16px 1px;
  align-items: center;
  margin-bottom: 6px;
  position: relative;
`;

const SafeBorder = styled.View`
  position: absolute;
  left: 0;
  bottom: -8px;
  height: 1px;
  width: 120%;
  background-color: ${({theme}) => theme.colorV2.divider8};
`;

const TabItemView = styled.Pressable`
  margin-left: ${({first}) => (first ? 0 : '24px')};
`;

const BottomLine = styled(Animated.View)`
  height: 4px;
  background-color: ${({theme}) => theme.colorV2.text};
  border-radius: 2px;
  position: absolute;
  bottom: -8px;
  width: ${({width, underlineWidth}) => {
    if (!width) return 'auto';
    return `${underlineWidth || width}px`;
  }};
  z-index: 2;
  margin-left: ${({width, underlineWidth}) => {
    if (!underlineWidth) return 'auto';
    return Math.max(width / 2 - underlineWidth, 0) + 'px';
  }};
`;

const TabItemText = styled.Text`
  font-weight: bold;
  font-size: 14px;
  color: ${({theme, active}) =>
    active ? theme.colorV2.text : theme.colorV2.text40};
`;

const Tabs = ({options, onChange, value, style, underlineWidth}) => {
  const {isRTL} = useTheme();
  const [afterOffset, setAfterOffset] = useState(0);
  const [bottomLineWidth, setBottomLineWidth] = useState(underlineWidth);
  const [tabsOffsetX, setTabsOffsetX] = useState({});
  const activeVal = useRef(new Animated.Value(0));
  const beforeValue = useRef(0);

  const updateBottomLineWidth = useCallback(() => {
    const findIndex = options.findIndex(i => i.value === value);
    if (!tabsOffsetX[findIndex]?.width) return;

    setBottomLineWidth(tabsOffsetX[findIndex].width);
  }, [options, tabsOffsetX, value]);

  useEffect(() => {
    const findIndex = options.findIndex(i => i.value === value);
    if (tabsOffsetX[findIndex]) {
      beforeValue.current = tabsOffsetX[findIndex].x;
      setAfterOffset(tabsOffsetX[findIndex].x);
      updateBottomLineWidth();
    }
  }, [tabsOffsetX, value]);

  return options?.length ? (
    <TabsWrapper style={style}>
      {options.map((item, index) => (
        <TabItemView
          first={index === 0}
          key={item.value || index}
          onLayout={event => {
            const layout = event.nativeEvent?.layout;
            if (layout)
              setTabsOffsetX(obj => ({
                ...obj,
                [index]: {x: layout.x, width: layout.width},
              }));
          }}
          onPress={() => {
            beforeValue.current = afterOffset;
            setAfterOffset(tabsOffsetX[index].x);
            updateBottomLineWidth();

            Animated.timing(activeVal.current, {
              toValue: 1,
              duration: 200,
              easing: Easing.ease,
              useNativeDriver: false,
              isInteraction: false,
            }).start();
            setTimeout(() => (activeVal.current = new Animated.Value(0)), 200);
            onChange && onChange(item.value, item);
          }}>
          <TabItemText active={value === item.value}>{item.label}</TabItemText>
        </TabItemView>
      ))}
      <BottomLine
        width={bottomLineWidth}
        underlineWidth={underlineWidth}
        style={{
          [isRTL ? 'right' : 'left']: activeVal.current.interpolate({
            inputRange: [0, 1],
            outputRange: [beforeValue.current, afterOffset],
          }),
          textAlign: 'center',
        }}
      />
      <SafeBorder />
    </TabsWrapper>
  ) : null;
};

export default Tabs;
