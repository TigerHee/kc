/**
 * Owner: garuda@kupotech.com
 */

import { styled } from '../../builtinCommon';

export const IconLabel = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 4px;
  > span {
    margin: 0 2px 0 0;
    font-size: 12px;
    line-height: 1.3;
    height: 16px;
    color: ${(props) => props.theme.colors.text40};
  }
  > svg {
    font-size: 14px;
    color: ${(props) => props.theme.colors.icon60};
    cursor: help;
  }
`;
