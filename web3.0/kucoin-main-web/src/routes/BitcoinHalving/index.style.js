/**
 * Owner: ella.wang@kupotech.com
 */
import { styled } from '@kux/mui';

export const Wrapper = styled.div`
  background: #121212;
`;

export const Content = styled.div`
  margin: 0px auto;
  ${(props) => props.theme.breakpoints.down('lg')} {
    padding: 0px 24px;
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    padding: 0px 16px;
  }
`;
