/**
 * Owner: willen@kupotech.com
 */

import React from 'react';
import styled from '@emotion/native';

const TabWrapper = styled.Pressable`
  padding: ${({ size }) => (size === 'large' ? '13px 0 16px' : '10px 0 12px')};
  justify-content: center;
  align-items: center;
  position: relative;
  ${({ theme, variant, index, active, size }) => {
    if (variant === 'isolated') {
      return `
          background-color: ${active ? theme.colorV2.overlay : 'transparent'};
          border-radius: 6px;
          padding: ${size === 'large' ? '8px 12px' : '6px 12px'};
        `;
    } else if (variant === 'border') {
      return `
          background-color: ${active ? theme.colorV2.cover4 : 'transparent'};
          border-radius: ${size === 'large' ? '8px' : '4px'};
          padding: ${size === 'large' ? '6px 10px' : '4px 10px'};
        `;
    } else {
      return `
        margin-left: ${index === 0 ? '16px' : '24px'};
      `;
    }
  }}
`;

const ActiveBar = styled.View`
  width: 16px;
  height: 4px;
  border-radius: 2px;
  background-color: ${({ theme }) => theme.colorV2.text};
  position: absolute;
  bottom: 0;
`;

const TabText = styled.Text`
  color: ${({ theme, active, variant }) =>
    active
      ? theme.colorV2.text
      : variant === 'isolated'
      ? theme.colorV2.text60
      : theme.colorV2.text40};
  font-size: ${({ size }) => (size === 'large' ? '15px' : '14px')};
  font-weight: ${({ active }) => (!!active ? '600' : '500')};
  line-height: 18.2px;
`;

const Tab = ({ size, variant, style, label, index, active, onPress, tabRef }) => {
  return (
    <TabWrapper
      variant={variant}
      size={size}
      style={style}
      onPress={onPress}
      index={index}
      ref={tabRef}
      active={active}
    >
      {typeof label === 'string' ? (
        <TabText size={size} active={active} variant={variant}>
          {label}
        </TabText>
      ) : (
        label
      )}
      {active && variant !== 'isolated' && variant !== 'border' ? <ActiveBar /> : null}
    </TabWrapper>
  );
};

export default Tab;
