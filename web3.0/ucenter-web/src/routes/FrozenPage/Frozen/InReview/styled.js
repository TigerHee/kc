/**
 * Owner: willen@kupotech.com
 */

import { styled } from '@kux/mui';

export const TextMid = styled.div`
  margin-top: 16px;
  font-size: 18px;
`;
export const TextSm = styled.div`
  margin-top: 8px;
`;

export const LogOut = styled.div`
  margin-top: 32px;
  font-size: 14px;
  color: ${(props) => props.theme.colors.text};
  span {
    text-decoration: underline;
    cursor: pointer;
  }
`;
export const ApplyWarning = styled.div`
  color: ${(props) => props.theme.colors.text};
  margin: 0;
`;

export const IconWrapper = styled.div`
  width: 160px;
  height: 160px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const Title = styled.div`
  color: ${(props) => props.theme.colors.text};
  text-align: center;
  font-size: 36px;
  font-style: normal;
  font-weight: 600;
  line-height: 130%; /* 46.8px */
  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 24px;
  }
`;

export const Desc = styled.div`
  color: ${(props) => props.theme.colors.complementary};
  text-align: center;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 150%; /* 24px */
  margin-top: 13px;
`;
