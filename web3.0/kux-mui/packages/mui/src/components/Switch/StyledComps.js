/**
 * Owner: victor.ren@kupotech.com
 */
import styled from 'emotion/index';

// 开关容器
export const SwitchContainer = styled.div`
  position: relative;
  display: inline-block;
  & > input {
    height: 100%;
    width: 100%;
    cursor: pointer;
    &:disabled {
      cursor: not-allowed;
    }
  }
`;

export const SwitchIcon = styled.div`
  position: relative;
  width: ${({ size }) => (size === 'small' ? '28px' : '36px')};
  height: ${({ size }) => (size === 'small' ? '16px' : '20px')};
  border-radius: ${({ size }) => (size === 'small' ? '8px' : '10px')};
  z-index: 0;
  margin: 0;
  padding: 0;
  appearance: none;
  border: 0;
  transition: all 0.3s;

  &:after {
    position: absolute;
    left: 2px;
    top: 2px;
    width: ${({ size }) => (size === 'small' ? '12px' : '16px')};
    height: ${({ size }) => (size === 'small' ? '12px' : '16px')};
    border-radius: 50%;
    background-color: #fff;
    content: '';
    transition: all 0.3s;
    transform: ${({ checked, size }) =>
      checked ? `translateX(${size === 'small' ? '12px' : '16px'})` : 'translateX(0)'};
  }
  background-color: ${({ checked, theme }) =>
    checked ? theme.colors.primary : theme.colors.cover20};
  opacity: ${({ disabled }) => (disabled ? 0.4 : 1)};
`;
