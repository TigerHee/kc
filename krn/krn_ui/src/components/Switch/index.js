/**
 * Owner: willen@kupotech.com
 */
import React, { useState } from 'react';
import styled from '@emotion/native';
import API from './API';
import registerAPI from 'utils/registerAPI';
import { TouchableOpacity } from 'react-native';
import SlideInView from './SlideInView';
import throttle from 'lodash/throttle';

const getColor = (unCheckedBg, theme) => {
  if (unCheckedBg) {
    return unCheckedBg;
  } else {
    return theme.colorV2.icon40;
  }
};

const Wrapper = styled.View`
  background: ${({ theme, value, checkedBg, unCheckedBg }) =>
    value ? (checkedBg ? checkedBg : theme.colorV2.primary) : getColor(unCheckedBg, theme)};
  ${({ disabled }) => {
    if (disabled) {
      return `
        opacity: 0.4
      `;
    }
  }};
`;
const Handle = styled.View`
  width: 100%;
  height: 100%;
  background: ${({ theme }) => theme.colorV2.overlay};
  border-radius: ${({ diameter }) => diameter + 'px'};
`;

const Switch = ({
  size: diameter,
  disabled = false,
  checked = false,
  onChange,
  checkedBg,
  unCheckedBg,
}) => {
  const [value, setValue] = useState(checked);

  const style = {
    width: diameter * 2 + 4,
    height: diameter + 4,
    borderRadius: (diameter + 4) / 2,
    padding: 2,
  };

  const onPress = throttle(() => {
    const tmp = value ? false : true;
    setValue(tmp);
    if (typeof onChange === 'function') onChange(tmp);
  }, 250);

  return (
    <Wrapper
      style={{ ...style }}
      value={value}
      disabled={disabled}
      checkedBg={checkedBg}
      unCheckedBg={unCheckedBg}
    >
      <TouchableOpacity activeOpacity={0.9} onPress={onPress} disabled={disabled}>
        <SlideInView value={value} diameter={diameter} style={{ width: diameter }}>
          <Handle diameter={diameter} />
        </SlideInView>
      </TouchableOpacity>
    </Wrapper>
  );
};

registerAPI(Switch, API);
export default Switch;
