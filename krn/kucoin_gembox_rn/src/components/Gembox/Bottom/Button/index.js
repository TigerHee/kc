/**
 * Owner: roger.chen@kupotech.com
 */
import React from 'react';
import styled from '@emotion/native';
import {TouchableOpacity} from 'react-native';

const ButtonBox = styled.View`
  background: ${({theme, disabled}) =>
    disabled ? theme.color.primary38 : theme.color.primary};
  border-radius: 24px;
  height: 32px;
  justify-content: center;
  padding: 0 15px;
`;
const ButtonText = styled.Text`
  width: 100%;
  color: ${({theme}) => theme.color.surface};
  font-size: 14px;
  padding: 0px;
  text-align: center;
`;

const Button = ({
  children,
  style,
  textStyle,
  textAttr,
  disabled = false,
  onPress,
}) => {
  return (
    <TouchableOpacity activeOpacity={0.6} onPress={onPress} disabled={disabled}>
      <ButtonBox style={style} disabled={disabled}>
        <ButtonText style={textStyle} {...textAttr}>
          {children}
        </ButtonText>
      </ButtonBox>
    </TouchableOpacity>
  );
};

export default Button;
