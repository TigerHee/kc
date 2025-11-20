/**
 * Owner: garuda@kupotech.com
 * 自定义封装 ButtonGroup 组件，主要用来展示 下单 size 选择
 */

import React, { useState, useEffect, forwardRef } from 'react';

import clsx from 'clsx';

import { styled } from '../../builtinCommon';

const ButtonItem = styled.div`
  flex: 1;
  width: 48px;
  height: ${(props) => (props.size === 'small' ? '16px' : '24px')};
  padding: 0 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-size: 12px;
  line-height: 1.3;
  color: ${(props) => props.theme.colors.text40};
  background: ${(props) => props.theme.colors.cover4};
  border-radius: 4px;
  cursor: pointer;
  user-select: none;

  &:not(:last-child) {
    margin-right: 4px;
  }

  &:hover {
    color: ${(props) => props.theme.colors.text40};
    background: ${(props) => props.theme.colors.cover12};
  }

  &.ku-button-item-active {
    font-weight: 500;
    color: ${(props) => props.theme.colors.primary};
    background: ${(props) => props.theme.colors.primary12};

    &:hover {
      color: ${(props) => props.theme.colors.primary};
      background: ${(props) => props.theme.colors.primary12};
    }
  }

  &.ku-button-item-primary {
    background: ${(props) => props.theme.colors.primary12};

    &:hover {
      background: ${(props) => props.theme.colors.primary12};
    }
  }

  &.ku-button-item-secondary {
    background: ${(props) => props.theme.colors.secondary12};
    color: ${(props) => props.theme.colors.secondary};
    &:hover {
      background: ${(props) => props.theme.colors.secondary12};
      color: ${(props) => props.theme.colors.secondary};
    }
  }

  &.ku-button-item-disabled {
    cursor: not-allowed;

    &:hover {
      color: ${(props) => props.theme.colors.text40};
      background: ${(props) => props.theme.colors.cover4};
    }
  }
`;

export const Button = forwardRef(
  ({ active, value, disabled, onChange, children, type = 'primary', ...other }, ref) => {
    const handleClick = (e) => {
      if (disabled) return;
      onChange(e, value);
    };

    return (
      <ButtonItem
        dir="ltr"
        onClick={handleClick}
        ref={ref}
        className={clsx(
          'ku-button-item',
          active ? 'ku-button-item-active' : '',
          type && active ? `ku-button-item-${type}` : '',
          disabled ? 'ku-button-item-disabled' : '',
        )}
        {...other}
      >
        {children}
      </ButtonItem>
    );
  },
);

const ButtonGroupBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex: 4 1 0;
`;

const ButtonGroup = (
  { value, children: childrenProp, className = '', onChange = () => {} },
  ref,
) => {
  const [activeKey, setActiveKey] = useState(undefined);

  useEffect(() => {
    setActiveKey(value);
  }, [value]);

  const children = React.Children.map(childrenProp, (child) => {
    if (!React.isValidElement(child)) {
      return null;
    }

    const childValue = child.props.value;
    const active = childValue === activeKey;

    return React.cloneElement(child, {
      active,
      value: childValue,
      onChange,
    });
  });

  return (
    <ButtonGroupBox ref={ref} className={clsx('ku-button-group', className)}>
      {children}
    </ButtonGroupBox>
  );
};

export default React.memo(forwardRef(ButtonGroup));
