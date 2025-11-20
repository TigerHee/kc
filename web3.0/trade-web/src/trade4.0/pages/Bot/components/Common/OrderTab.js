/**
 * Owner: mike@kupotech.com
 */
import React, { useCallback } from 'react';
import styled from '@emotion/styled';
import { Flex } from 'Bot/components/Widgets';

const Cover = styled(Flex)`
  border-radius: 80px;
  background-color: ${(props) => props.theme.colors.cover4};
  background-clip: content-box;
  border: 2px solid ${(props) => props.theme.colors.cover4};
`;
const Label = styled.div`
  font-size: 12px;
  font-weight: 500;
  height: 28px;
  line-height: 28px;
  color: ${(props) => props.theme.colors[props.active ? 'text' : 'text60']};
  background-color: ${({ active, theme }) => (active ? theme.colors.overlay : 'transparent')};
  .side-drawer-order-form-box,
  .bot-create-float-wrapper & {
    background-color: ${({ active, theme }) => (active ? theme.colors.layer : 'transparent')};
  }
  transition: all 0.3s linear;
  border-radius: 80px;
  flex: 1;
  cursor: pointer;
  text-align: center;
  &:hover {
    color: ${(props) => props.theme.colors.text};
  }
`;
/**
 * @description: 用于创建区域的ai参数, 自定义参数的切换
 * @return {*}
 */
export default React.memo(({ label, label2, value, onChange, ...rest }) => {
  const handleChange = useCallback(
    (e) => {
      onChange(Number(e.currentTarget.dataset.value));
    },
    [onChange],
  );
  value = Number(value);
  return (
    <Cover mb={16} {...rest}>
      <Label onClick={handleChange} data-value={0} active={value === 0}>
        {label}
      </Label>
      <Label onClick={handleChange} data-value={1} active={value === 1}>
        {label2}
      </Label>
    </Cover>
  );
});
