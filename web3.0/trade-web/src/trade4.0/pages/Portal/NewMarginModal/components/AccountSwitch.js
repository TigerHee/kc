/*
 * @owner: borden@kupotech.com
 */
import React from 'react';
import { map } from 'lodash';
import styled from '@emotion/styled';
import { ACCOUNT_TYPE } from '../config';

/** 样式开始 */
const AccountList = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  background: ${props => props.theme.colors.cover4};
  padding: 2px;
  border-radius: 8px;
`;

const Account = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  font-size: 14px;
  font-weight: 500;
  border-radius: 8px;
  height: 40px;
  cursor: pointer;
  background: ${({ isActive, theme: { colors } }) =>
    (isActive ? colors.layer : 'transparent')};
  color: ${({ isActive, theme: { colors } }) =>
    (isActive ? colors.text : colors.text60)};
  &:hover {
    color: ${(props) => props.theme.colors.text};
  }
  &:not(:first-of-type) {
    margin-left: 12px;
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    height: 32px;
    font-size: 12px;
  }
`;
/** 样式结束 */

const AccountSwitch = ({ value: _value, onChange }) => {
  return (
    <AccountList>
      {map(ACCOUNT_TYPE, ({ value, label }) => {
        return (
          <Account
            key={value}
            isActive={value === _value}
            onClick={() => onChange(value)}
          >
            {label()}
          </Account>
        );
      })}
    </AccountList>
  );
};

export default AccountSwitch;
