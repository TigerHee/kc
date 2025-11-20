/**
 * Owner: willen@kupotech.com
 */

import { styled } from '@kux/mui';

export const Jumper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  ${(props) => props.theme.breakpoints.down('sm')} {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
  }
`;

export const JumperForm = styled.div`
  margin-left: 8px;
  display: flex;
  flex-direction: row;
  align-items: center;
  ${(props) => props.theme.breakpoints.down('sm')} {
    margin-left: 2px;
  }
  div {
    width: 48px;
    height: 32px;
    padding: 0;
    color: rgba(0, 0, 0, 0.65);
    font-size: 14px;
    background-color: #fff;
    border-radius: 0;
    box-shadow: 0 0 0 1px rgba(38, 50, 65, 0.08) inset;
    input {
      text-align: center;
      -moz-appearance: textfield;
      &::-webkit-outer-spin-button {
        -webkit-appearance: none;
      }
      &::-webkit-inner-spin-button {
        -webkit-appearance: none;
      }
    }
  }
`;

export const Divider = styled.div`
  font-size: 14px;
  color: rgba(0, 0, 0, 0.65);
  letter-spacing: 0;
  text-align: left;
  line-height: 22px;
  margin: 0 16px;
  ${(props) => props.theme.breakpoints.down('sm')} {
    margin: 0 4px;
  }
`;

export const Count = styled.div`
  font-size: 14px;
  color: rgba(0, 0, 0, 0.65);
  letter-spacing: 0;
  text-align: left;
  line-height: 22px;
`;
