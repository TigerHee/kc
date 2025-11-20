import React, {memo, useCallback, useRef} from 'react';
import {TextInput} from 'react-native';
import styled from '@emotion/native';
import {useTheme} from '@krn/ui';

import {RowWrap} from 'constants/styles';
import {InputPrefixText, InputSuffixText} from '../index.styles';

const InputPressableArea = styled.Pressable`
  justify-content: space-between;
  flex-direction: row;
  align-items: center;
  height: 40px;
  flex: 1;
  border-radius: 8px;
  border: 1px solid ${({theme}) => theme.colorV2.cover12};
  padding: 0 12px;
  margin-left: ${({isRight}) => (isRight ? '4px' : 0)};
  margin-right: ${({isRight}) => (!isRight ? '4px' : 0)};
`;

const InputRowWrap = styled(RowWrap)`
  /* max-width: 300px; */
  align-self: center;
  // 解决Android端不垂直居中的问题
  text-align-vertical: center;
  max-width: 50px;
  position: relative;
`;

const StyledInputAmount = styled(TextInput)`
  border-width: 0;
  border-color: transparent;
  // 解决Android端不垂直居中的问题
  text-align-vertical: center;
  margin: 0;
  padding: 0;
  /* max-width: 206px; */
  font-size: 16px;
  color: ${({theme, disabled}) =>
    disabled ? theme.colorV2.text40 : theme.colorV2.text};
  text-align: right;
  font-weight: 600;
  align-items: center;
`;

const RatioInput = ({
  onBlur,
  value,
  onChange,
  label,
  isRight = false,
  disabled,
}) => {
  const textInputRef = useRef(null);
  const {colorV2} = useTheme();
  const focusInput = () => {
    textInputRef.current?.focus?.();
  };

  const onInputValue = useCallback(
    originText => {
      try {
        // 逗号转小数点
        let text = originText?.replace?.('.', '');

        if (!text) {
          onChange(text);
          return;
        }
        // 允许数字和小数点 此处产品确认 2 位小数
        const regex = new RegExp(`^\\d+\\.?\\d{0,${Math.floor(0)}}$`);

        if (!regex.test(text)) {
          return;
        }

        // 限制最开头只能最多输入一个0
        if (/^0{2,}/.test(text)) {
          return;
        }
        // 不能输入099这样的数字 ==> 99
        if (/^0\d+/.test(text)) {
          text = String(Number(text));
        }
        // 上一次是0， 这次是90， 强制变成9, 也就是光标无论在0的前面还是后面， 都要清除0
        // 数字只能从左到右输入
        if (value === '0' && /^[1-9]0$/.test(text)) {
          text = text.replace(/0$/, '');
        }
        onChange(text);
      } catch (error) {
        console.log('mylog ~ AccountTransfer ~ error:', error);
      }
    },

    [onChange, value],
  );

  return (
    <InputPressableArea isRight={isRight} onPress={focusInput}>
      <InputPrefixText>{label}</InputPrefixText>
      <InputRowWrap>
        <StyledInputAmount
          disabled={disabled}
          editable={!disabled}
          onBlur={onBlur}
          ref={textInputRef}
          keyboardType="numeric" // 设置键盘类型为数字键盘
          value={value}
          onChangeText={onInputValue}
          placeholder="0"
          placeholderTextColor={colorV2.text20}
        />
      </InputRowWrap>
      <InputSuffixText>%</InputSuffixText>
    </InputPressableArea>
  );
};

export default memo(RatioInput);
