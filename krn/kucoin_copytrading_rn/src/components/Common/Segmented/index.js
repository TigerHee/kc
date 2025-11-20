import isEmpty from 'lodash/isEmpty';
import React, {useCallback, useMemo, useRef, useState} from 'react';
import {Animated} from 'react-native';

import {
  ActiveSegmentedBlock,
  SegmentedContainer,
  SegmentedItem,
  SegmentedText,
} from './styles';

const SEGMENTED_ANIMATION_DURATION = 300; // 动画的持续时间

const initSelectedIndexByValue = (options, value) =>
  Math.max(
    options?.findIndex(i => i.value === value),
    0,
  );

/**
 * Segmented分段控制器组件，用于展示与切换 分段单元
 * @param {Object} props - 传递给组件的属性。
 * @param {Array.<{value: string, label: string}>} props.options - Selector的选项。
 * @param {string} props.initialValue - Selector的当前值。
 */
const Segmented = ({options, initialValue}) => {
  const [selectedIndex, setSelectedIndex] = useState(() =>
    initSelectedIndexByValue(options, initialValue),
  );
  const [tabsOffsetX, setTabsOffsetX] = useState({});

  const animationValue = useRef(new Animated.Value(0));

  const handlePress = useCallback(index => {
    Animated.timing(animationValue.current, {
      toValue: index,
      duration: SEGMENTED_ANIMATION_DURATION,
      useNativeDriver: false,
    }).start();

    setSelectedIndex(index);
  }, []);

  const computedStyle = useMemo(() => {
    if (isEmpty(tabsOffsetX) || !options?.length) return {};
    return {
      left: animationValue.current.interpolate({
        inputRange: options.map((_, i) => i),
        outputRange: options.map((_, i) => tabsOffsetX[i]?.x || 0),
      }),
      width: animationValue.current.interpolate({
        inputRange: options.map((_, i) => i),
        outputRange: options.map((_, i) => tabsOffsetX[i]?.width || 0),
      }),
    };
  }, [tabsOffsetX, options]);

  return (
    <SegmentedContainer>
      {options.map((option, index) => (
        <SegmentedItem
          key={index}
          onLayout={event => {
            const layout = event.nativeEvent?.layout;
            if (layout)
              setTabsOffsetX(obj => ({
                ...obj,
                [index]: {x: layout.x, width: layout.width},
              }));
          }}
          onPress={() => handlePress(index)}>
          <SegmentedText selected={selectedIndex === index}>
            {option.label}
          </SegmentedText>
        </SegmentedItem>
      ))}
      <ActiveSegmentedBlock style={computedStyle} />
    </SegmentedContainer>
  );
};

export default Segmented;
