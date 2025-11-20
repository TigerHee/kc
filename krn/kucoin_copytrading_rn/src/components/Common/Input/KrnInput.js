import React from 'react';
import styled from '@emotion/native';
import {useTheme} from '@krn/ui';

import input_clear_icon from 'assets/common/Input/input_clear_icon.png';

const InputContainer = styled.View`
  padding-top: 10px;
  background-color: transparent;
`;

const InputWrapper = styled.View`
  position: relative;
  border-width: 0.8px;
  border-style: solid;
  border-color: ${({theme, colorType}) => {
    return colorType === 'success'
      ? theme.colorV2.primary
      : colorType === 'error'
      ? theme.colorV2.secondary
      : theme.colorV2.cover12;
  }};
  border-radius: 8px;
  padding: 0 16px;
  min-height: ${({size}) =>
    size === 'large' ? '56px' : size === 'small' ? '40px' : '48px'};
  flex-direction: row;
  align-items: center;
`;

const InputLabelView = styled.View`
  position: absolute;
  left: 12px;
  top: -10px;
  z-index: 2;
  padding: 0 4px;
  background-color: ${({theme}) => theme.colorV2.overlay};
`;

const InputLabelText = styled.Text`
  font-size: 12px;
  font-weight: 400;
  line-height: 16px;
  letter-spacing: 0.4px;
  color: ${({theme, colorType, disabled}) => {
    if (disabled) {
      return theme.colorV2.text30;
    }
    return colorType === 'success'
      ? theme.colorV2.primary
      : colorType === 'error'
      ? theme.colorV2.secondary
      : theme.colorV2.text;
  }};
`;
const ExInput = styled.TextInput`
  font-size: ${({size}) => (size === 'small' ? '14px' : '16px')};
  font-weight: ${({value}) => (value ? '500' : '400')};
  // 解决Android端不垂直居中的问题
  text-align-vertical: center;
  letter-spacing: 0.5px;
  padding: 8px 0;
  flex: 1;
  color: ${({theme, disabled}) =>
    disabled ? theme.colorV2.text40 : theme.colorV2.text};
`;

const TipsView = styled.View`
  padding-left: 16px;
  padding-top: 4px;
`;
const TipsText = styled.Text`
  font-size: 12px;
  font-weight: 400;
  line-height: 16px;
  letter-spacing: 0.4px;
  color: ${({theme, colorType}) =>
    colorType === 'error' ? theme.colorV2.secondary : theme.colorV2.text40};
`;

const ClearButtonView = styled.Pressable`
  margin-left: 10px;
`;
const ClearButton = styled.Image`
  width: ${({size}) => (size === 'large' ? '24px' : '20px')};
  height: ${({size}) => (size === 'large' ? '24px' : '20px')};
`;

const KrnInput = ({
  label,
  tips,
  value,
  placeholder,
  onChange,
  allowClear,
  prefix,
  suffix,
  size,
  colorType, // 正常normal,绿色success,红色error
  originInputProps,
  styles = {},
  disabled,
}) => {
  const theme = useTheme();

  return (
    <InputContainer style={styles.inputContainer}>
      <InputWrapper
        style={styles.inputWrapper}
        colorType={colorType}
        size={size}>
        {label ? (
          <InputLabelView style={styles.inputLabelView}>
            <InputLabelText
              colorType={colorType}
              disabled={disabled}
              style={styles.inputLabelText}>
              {label}
            </InputLabelText>
          </InputLabelView>
        ) : null}

        {prefix}

        <ExInput
          onChange={onChange}
          value={value}
          placeholder={placeholder}
          placeholderTextColor={theme.colorV2.text40}
          style={styles.exInput}
          size={size}
          disabled={disabled}
          editable={!disabled}
          {...originInputProps}
        />

        {allowClear && !!value ? (
          <ClearButtonView
            style={styles.clearButtonView}
            onPress={() => onChange({nativeEvent: {text: ''}})}>
            <ClearButton
              size={size}
              style={styles.clearButton}
              source={input_clear_icon}
            />
          </ClearButtonView>
        ) : null}

        {suffix}
      </InputWrapper>

      <TipsView style={styles.tipsView}>
        <TipsText colorType={colorType} style={styles.tipsText}>
          {tips}
        </TipsText>
      </TipsView>
    </InputContainer>
  );
};

export default KrnInput;
