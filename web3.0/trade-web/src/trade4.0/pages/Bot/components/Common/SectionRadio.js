/**
 * Owner: mike@kupotech.com
 */
import React, { useState, useCallback, useLayoutEffect } from 'react';
import useStateRef from '@/hooks/common/useStateRef';
import styled from '@emotion/styled';
import { ICHookOutlined } from '@kux/icons';

const UL = styled.ul`
  padding: 0;
  margin: 0;
`;
const LI = styled.li`
  background-color: ${({ theme, active }) => theme.colors[active ? 'primary4' : 'cover4']};
  border-radius: 12px;
  border: 1px solid ${({ theme, active }) => (active ? theme.colors.primary : 'transparent')};
  transition: all 0.3s linear;
  position: relative;
  overflow: hidden;
  padding: 16px;
  cursor: pointer;
  margin-bottom: 12px;
  &:last-of-type {
    margin-bottom: 0;
  }
  padding-right: 40px;
`;
const Yes = styled(ICHookOutlined)`
  position: absolute;
  bottom: 0;
  right: 16px;
  top: 0;
  margin: auto;
  fill: ${({ theme }) => theme.colors.primary};
`;
const Radio = ({ active, children, onClick, radioIconClass }) => {
  return (
    <LI active={active} onClick={onClick} data-value={children.props.value}>
      {children}
      {active && <Yes size={24} className={radioIconClass} />}
    </LI>
  );
};
// 非受控组件
export default ({ children = [], onChange, defaultValue, className, radioIconClass }) => {
  const [active, setActive] = useState(String(defaultValue));
  const chooseHandler = useCallback((e) => {
    const value = e.currentTarget.dataset.value;
    const { onChange: Change } = useDataRef.current;
    setActive(value);
    if (Change) {
      Change(value);
    }
  }, []);
  // 处理如果有默认选中的，初始化后就抛出onchange事件
  const useDataRef = useStateRef({
    defaultValue,
    onChange,
  });
  useLayoutEffect(() => {
    const { defaultValue: dftValue, onChange: Change } = useDataRef.current;
    if (dftValue !== undefined) {
      if (Change) {
        Change(dftValue);
      }
    }
  }, []);
  if (!Array.isArray(children)) {
    children = [children];
  }
  const filterChildren = children.filter((el) => el);
  return (
    <UL className={className}>
      {filterChildren.map((child) => (
        <Radio
          key={child.props.value}
          onClick={chooseHandler}
          active={String(child.props.value) === active}
          radioIconClass={radioIconClass}
        >
          {child}
        </Radio>
      ))}
    </UL>
  );
};
