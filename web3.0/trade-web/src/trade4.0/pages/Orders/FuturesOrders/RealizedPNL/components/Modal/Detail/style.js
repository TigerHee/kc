/**
 * Owner: charles.yang@kupotech.com
 */

import { styled } from '@/style/emotion';

export const Title = styled.h3`
  margin: 0 0 16px;
  padding: 0;
  font-size: 16px;
  font-weight: 700;
  line-height: 1.3;
  color: ${(props) => props.theme.colors.text};
`;
