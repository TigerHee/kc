/**
 * Owner: willen@kupotech.com
 */
import { Dropdown, styled } from '@kux/mui';
import { useState } from 'react';

const TradeTooltip = styled.div`
  background-color: ${({ theme }) => theme.colors.layer};
  border: 1px solid ${(props) => props.theme.colors.cover4};
  box-shadow: 0px 2px 4px 0px ${(props) => props.theme.colors.divider4},
    0px 0px 1px 0px ${(props) => props.theme.colors.divider4};
  display: flex;
  flex-direction: column;
  border-radius: 12px;
  overflow: hidden;
`;

const TradeTooltipText = styled.div`
  padding: 0 16px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  font-size: 14px;
  line-height: 130%;
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;
  white-space: nowrap;

  :hover {
    background-color: ${({ theme }) => theme.colors.cover2};
  }
`;

const SelectDropdown = ({
  children,
  options,
  trigger = 'hover',
  placement = 'top',
  className,
  onChange,
  activeValue,
  ...restProps
}) => {
  const [visible, setVisible] = useState(false);
  if (!options?.length) return children;
  return (
    <Dropdown
      visible={visible}
      onVisibleChange={setVisible}
      trigger={trigger}
      placement={placement}
      overlay={
        <TradeTooltip className={className}>
          {options.map((item) => (
            <TradeTooltipText
              key={item.value}
              active={activeValue === item.value}
              onClick={() => {
                setVisible(false);
                onChange && onChange(item.value);
              }}
            >
              {item.label}
            </TradeTooltipText>
          ))}
        </TradeTooltip>
      }
      {...restProps}
    >
      {children}
    </Dropdown>
  );
};

export default SelectDropdown;
