/**
 * Owner: mike@kupotech.com
 */
// 配置文件
import React, { useState } from 'react';
import clsx from 'clsx';
import { choice } from 'FutureMartingale/config';
import { _t, _tHTML } from 'Bot/utils/lang';
import styled from '@emotion/styled';
import Dropdown from '@mui/Dropdown';

const UL = styled.ul`
  box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.05), 0px 0px 1px 0px rgba(0, 0, 0, 0.1);
  min-width: 160px;
  max-height: 500px;
  border-radius: 8px;
  overflow: hidden;
  padding-left: 0;
  background-color: ${({ theme }) => theme.colors.layer};
  > li {
    height: 40px;
    padding: 0 12px;
    line-height: 40px;
    font-size: 14px;
    background-color: ${({ theme }) => theme.colors.cover4};
    cursor: pointer;
    color: ${({ theme }) => theme.colors.text};
    transition: all 0.3s linear;
    &:hover,
    &.active {
      background-color: transparent;
      color: ${({ theme }) => theme.colors.primary};
    }
  }
`;
// 循环开仓条件
const CircularOpeningCondition = ({ formKey, children, model = {}, disabled }) => {
  const { formData, setMergeState } = model;
  const [open, setOpen] = useState(false);
  const onSubmit = (ch) => {
    setMergeState({ [formKey]: ch.value });
    setOpen(false);
  };
  const setVisible = (v) => {
    if (disabled) {
      return;
    }
    setOpen(v);
  };
  const choiceCFG = choice().filter(
    (el) => el.direction === formData.direction || el.direction === undefined,
  );
  return (
    <Dropdown
      onVisibleChange={setVisible}
      visible={open}
      trigger="click"
      overlay={
        <UL>
          {choiceCFG.map((ch, index) => {
            return (
              <li
                key={ch.value}
                className={clsx({ active: formData[formKey] === ch.value })}
                onClick={() => onSubmit(ch)}
              >
                {ch.lang}
              </li>
            );
          })}
        </UL>
      }
      placement="bottom-start"
    >
      {children}
    </Dropdown>
  );
};

export default CircularOpeningCondition;
