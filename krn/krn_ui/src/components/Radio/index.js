/**
 * Owner: willen@kupotech.com
 */
import React, { useMemo, cloneElement } from 'react';
import styled from '@emotion/native';
import registerAPI from 'utils/registerAPI';
import API from './API';

const RadioWrapper = styled.Pressable`
  flex-direction: row;
  align-items: center;
`;

const RadioBox = styled.View`
  width: 24px;
  height: 24px;
  border-radius: 12px;
  margin-right: 5px;
  border-width: 2px;
  border-style: solid;
  border-color: ${({ theme }) => theme.colorV2.text20};
  align-items: center;
  justify-content: center;
  ${({ checked, theme }) => {
    if (checked) {
      return `
        border-color: ${theme.colorV2.primary};
      `;
    }
  }};
  ${({ disabled }) => {
    if (disabled) {
      return `
        opacity: 0.4
      `;
    }
  }};
`;

const RadioMark = styled.View`
  width: 50%;
  height: 50%;
  border-radius: 999px; // 设大点，保证始终为圆形
  background-color: ${({ theme }) => theme.colorV2.primary};
`;

const RadioText = styled.Text`
  color: ${({ theme }) => theme.colorV2.text};
`;

const Radio = ({ children, style, checked, onChange, radioStyle, disabled }) => {
  return (
    <RadioWrapper style={style} onPress={() => onChange && onChange(!checked)}>
      <RadioBox checked={checked} style={radioStyle} disabled={disabled}>
        {!!checked && <RadioMark disabled={disabled} />}
      </RadioBox>
      {typeof children === 'string' ? (
        <RadioText disabled={disabled}>{children}</RadioText>
      ) : (
        children
      )}
    </RadioWrapper>
  );
};

const RadioGroup = styled.View``;
const Group = ({ style, value, onChange, children }) => {
  const list = useMemo(() => {
    if (!children) return null;
    return children.map((child) => {
      const childValue = child?.props?.value;
      if (!childValue) {
        throw new Error('Radio prop `value` is required in Radio.Group');
      }
      return cloneElement(child, {
        checked: childValue + '' === value + '',
        key: childValue,
        onChange: () => onChange(childValue),
      });
    });
  }, [children]);
  return <RadioGroup style={style}>{list}</RadioGroup>;
};

registerAPI(Radio, API);

Radio.Group = Group;
export default Radio;
