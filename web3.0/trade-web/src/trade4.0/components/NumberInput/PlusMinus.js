/**
 * Owner: garuda@kupotech.com
 */
import React from 'react';
import clsx from 'clsx';

import { styled } from '@kux/mui/emotion';
import { ICTriangleTopOutlined, ICTriangleBottomOutlined } from '@kux/icons';

export const Controls = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 2px;
  overflow: hidden;
  position: relative;
  &.number-input-control-disabled {
  }
`;

export const ControlItem = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: ${(props) => props.theme.colors.cover4};
  &:hover {
    background: ${(props) => props.theme.colors.cover8};
  }
  &:active {
    background: ${(props) => props.theme.colors.cover12};
  }
  color: ${(props) => props.theme.colors.icon};
  cursor: pointer;
  width: 24px;
  height: ${(props) => (props.size === 'small' ? '12px' : '16px')};
  &:first-of-type {
    border-radius: 4px 4px 0 0;
  }
  &:last-of-type {
    margin-top: 2px;
    border-radius: 0 0 4px 4px;
  }
  > svg {
    color: ${(props) => props.theme.colors.icon};
  }
  &.number-input-control-disabled {
    cursor: not-allowed;
    &:hover {
      background: ${(props) => props.theme.colors.cover4};
    }
    &:active {
      background: ${(props) => props.theme.colors.cover4};
    }
  }
`;

const PlusMinus = ({ onPlus, onMinus, disabled, controlClassName, controlItemClassName, size }) => {
  return (
    <Controls className={clsx('number-input-control', controlClassName)}>
      <ControlItem
        size={size}
        className={clsx(
          'number-input-control-item',
          controlItemClassName,
          disabled ? 'number-input-control-disabled' : '',
        )}
        onClick={onPlus}
      >
        <ICTriangleTopOutlined size={12} />
      </ControlItem>
      <ControlItem
        size={size}
        className={clsx(
          'number-input-control-item',
          controlItemClassName,
          disabled ? 'number-input-control-disabled' : '',
        )}
        onClick={onMinus}
      >
        <ICTriangleBottomOutlined size={12} />
      </ControlItem>
    </Controls>
  );
};

export default React.memo(PlusMinus);
