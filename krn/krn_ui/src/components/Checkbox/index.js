/**
 * Owner: willen@kupotech.com
 */
import React from 'react';
import styled from '@emotion/native';
import registerAPI from 'utils/registerAPI';
import API from './API';

const sizeConfig = {
  medium: {
    w: '20px',
    borderRadius: 10,
  },
  large: {
    w: '24px',
    borderRadius: 12,
  },
};

const CheckboxWrapper = styled.Pressable`
  flex-direction: row;
  align-items: center;
`;

const CheckboxBox = styled.View`
  width: ${({ size }) => sizeConfig?.[size]?.w};
  height: ${({ size }) => sizeConfig?.[size]?.w};
  /* 这里写了 checkboxStyle 的 borderRadius 不生效*/
  /* border-radius: 10px; */
  margin-right: 5px;
  border-width: 2px;
  border-style: solid;
  border-color: ${({ theme }) => theme.colorV2.icon40};
  align-items: center;
  justify-content: center;

  ${({ checked, theme, checkedType }) => {
    if (checked) {
      if (checkedType === 1) {
        return `
        background-color: ${theme.colorV2.text};
        border-color: ${theme.colorV2.text};
      `;
      }

      return `
        background-color: ${theme.colorV2.primary};
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

const CheckMark = styled.View`
  border-width: 2px;
  border-style: solid;
  border-color: ${({ theme }) => theme.colorV2.layer};
  width: 65%;
  height: 40%;
  margin-top: -22%;
  border-top-width: 0;
  border-right-width: 0;
  transform: ${({ theme }) => theme.isRTL ? 'rotate(45deg)' : 'rotate(-45deg)'} ;
`;

const CheckText = styled.Text`
  color: ${({ theme, disabled }) => (disabled ? theme.colorV2.text40 : theme.colorV2.text)};
`;

const Checkbox = ({
  children,
  style,
  checked,
  onChange,
  checkboxStyle,
  disabled,
  checkedType,
  size,
}) => {
  return (
    <CheckboxWrapper style={style} onPress={() => onChange && onChange(!checked)}>
      <CheckboxBox
        checked={checked}
        style={{ borderRadius: sizeConfig?.[size]?.borderRadius, ...checkboxStyle }}
        disabled={disabled}
        checkedType={checkedType}
        size={size}
      >
        {!!checked && <CheckMark disabled={disabled} />}
      </CheckboxBox>

      {typeof children === 'string' ? (
        <CheckText disabled={disabled}>{children}</CheckText>
      ) : (
        children
      )}
    </CheckboxWrapper>
  );
};

registerAPI(Checkbox, API);
export default Checkbox;
