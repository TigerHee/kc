/**
 * Owner: Ray.Lee@kupotech.com
 */
import React, {useState, useRef} from 'react';
import {TouchableOpacity, Animated} from 'react-native';

import styled from '@emotion/native';
import {useEffect} from 'react';

const AnimatedView = Animated.View;

const Wrapper = styled.View`
  width: 100%;
  height: 48px;
  border-bottom-width: 0.5px;
  border-bottom-style: solid;
  border-bottom-color: ${({theme}) => theme.colorV2.cover8};

  position: relative;
  background-color: ${({theme}) => theme.colorV2.overlay};
  flex-direction: row;
  align-items: center;
  padding: 0 10px;
`;

const Item = styled.Text`
  font-size: 18px;
  font-weight: ${({active}) => (active ? '600' : '500')};

  color: ${({active, theme}) => theme.colorV2[active ? 'text' : 'text40']};

  &:nth-last-of-type() {
    margin-left: 10px;
  }
`;

const Bar = styled(AnimatedView)`
  position: absolute;
  bottom: 0;
  width: 16px;
  height: 4px;
  border-radius: 4px;
  background-color: ${({theme}) => theme.colorV2.text};
`;

const Tab = ({datas = [], value, onChange, rightSlot}) => {
  const [activeTab, setActiveTab] = useState(value);
  const layout = useRef([]).current;
  const animatedValue = useRef(new Animated.Value(20)).current;

  const scrollToIndex = index => {
    const {x, width} = layout?.[index] || {};
    const val = x + width / 2 || 0;

    Animated.timing(animatedValue, {
      toValue: val,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  useEffect(() => {
    setActiveTab(value || datas[0]?.value);
  }, [value]);

  useEffect(() => {
    const i = datas.findIndex(item => item.value === activeTab);
    scrollToIndex(i || 0);
  }, [activeTab]);

  const handleTab = (index, _value) => {
    if (_value === activeTab) return;

    setActiveTab(_value);

    onChange && onChange(index, _value);
  };

  return (
    <Wrapper>
      {datas.map(({label, value: _value}, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => handleTab(index, _value)}
          activeOpacity={1}
          onLayout={event => {
            layout[index] = event.nativeEvent.layout;

            // 初始化的时候需要滚动到默认值
            if (datas[index]?.value === activeTab) {
              scrollToIndex(index);
            }
          }}>
          <Item active={activeTab === datas[index]?.value}>{label}</Item>
        </TouchableOpacity>
      ))}
      <Bar
        style={{
          transform: [{translateX: animatedValue}],
        }}
      />
      {rightSlot}
    </Wrapper>
  );
};

export default Tab;
