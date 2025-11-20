/*
 * owner: borden@kupotech.com
 */
import React from 'react';
import { isFunction } from 'lodash';
import { styled, InputNumber2 as InputNumber, useEventCallback, useResponsive } from '@kux/mui';
import { separateNumber } from '@utils/math';
import i18n from '@tools/i18n';
import { formatNumber, isFinite } from '../utils/format';

const StyledInputNumber = styled(InputNumber)`
  padding: 0;
  background: transparent;
  .KuxInputNumber-input {
    font-size: 22px;
    font-weight: 600;
    line-height: 24px;
    ${({ size }) => {
      if (size === 'small') {
        return `
          font-size: 18px;
        `;
      }
    }}
  }
  fieldset {
    display: none;
  }
  input {
    text-align: left;
    caret-color: ${(props) => props.theme.colors.primary};
    ${({ size }) => {
      if (size === 'small') {
        return `
          height: 24px;
        `;
      }
    }}
    &::placeholder {
      color: ${(props) => props.theme.colors.text20};
    }
  }
`;

const renderPlaceholder = (minSize, maxSize) => {
  if ([minSize, maxSize].some((v) => !isFinite(v))) {
    return null;
  }
  return `${formatNumber(minSize, { dp: null })}~${formatNumber(maxSize, { dp: null })}`;
};

const CustomInputNumber = ({ min, max, displayMax, value, onChange, ...otherProps }) => {
  displayMax = displayMax ?? max;
  const { sm } = useResponsive();

  const triggerChange = useEventCallback((val) => {
    // 过滤onBlur导致的onChange触发
    if (isFunction(onChange) && value !== val) {
      onChange(val);
    }
  });

  return (
    <StyledInputNumber
      lang={i18n.language}
      separator
      value={value}
      controls={false}
      variant="filled"
      onChange={triggerChange}
      autoFixPrecision={false}
      size={sm ? 'medium' : 'small'}
      placeholder={renderPlaceholder(min, displayMax)}
      {...otherProps}
    />
  );
};

export default React.memo(CustomInputNumber);
