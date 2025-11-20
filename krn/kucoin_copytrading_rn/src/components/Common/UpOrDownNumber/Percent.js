import React from 'react';
import {Text} from 'react-native';
import styled from '@emotion/native';

import {isUndef} from 'utils/helper';
import PercentFormat from '../Percent';
const StyledText = styled(Text)`
  color: ${({theme, isUp, isZero}) =>
    isZero
      ? theme.colorV2.text
      : isUp
      ? theme.colorV2.chartUpColor
      : theme.colorV2.chartDownColor};
`;
/**
 * @description: 找出是否有某个属性
 * @param {*} style
 * @param {*} attrKey
 * @return {*}
 */
const getAttrStyle = (style, attrKey) => {
  style = Array.isArray(style) ? style : [style];
  return style.find(oneStyle => oneStyle?.[attrKey]);
};
/**
 * @description: 有某个属性， 就生成对应obj style
 * @param {*} from
 * @param {*} attr
 * @return {*}
 */
const inheritStyle = (from, attr) => {
  const has = getAttrStyle(from, attr);
  return has ? {[attr]: has[attr]} : {};
};

const Percent = ({
  style,
  hiddenPositiveChar = false,
  children,
  placeholder = '--',
  ...others
}) => {
  const isUp = children >= 0;
  const isZero = +children === 0;
  if (isUndef(children)) {
    return <Text style={style}>{placeholder}</Text>;
  }
  // 继承父级属性
  const innerTextFW = inheritStyle(style, 'fontWeight');
  return (
    <StyledText isZero={isZero} isUp={isUp} style={style} {...others}>
      <PercentFormat
        isPositive={!hiddenPositiveChar}
        style={innerTextFW}
        {...others}>
        {children}
      </PercentFormat>
    </StyledText>
  );
};

export default Percent;
