/**
 * Owner: ella.wang@kupotech.com
 */
import { styled } from '@kux/mui';

export const Wrapper = styled.ul`
  list-style: none;
  width: 100%;
  & > li:not(:last-child) {
    margin-bottom: 24px;
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    & > li:not(:last-child) {
      margin-bottom: 16px;
    }
  }
`;
