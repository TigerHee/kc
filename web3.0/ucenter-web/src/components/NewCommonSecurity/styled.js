/**
 * Owner: willen@kupotech.com
 */

import { css, styled } from '@kux/mui';

export const BnormalInfo = styled.div`
  margin-bottom: 24px;
`;

export const RightInfo = styled.div`
  display: flex;
  flex-direction: row-reverse;
  margin-top: 12px;
`;

export const abnormalBtn = css`
  display: block;
  width: fit-content;
  font-size: 12px;
  color: ${(props) => props.theme.colors.primary};
`;

export const ms_switchBtn = css`
  font-size: 14px;
  margin-bottom: 24px;
  display: inline-block;
`;
