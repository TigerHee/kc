/**
 * Owner: ella.wang@kupotech.com
 */
import { styled } from '@kux/mui';

export const Wrapper = styled.div`
  width: 822px;
  height: 462px;
  margin: 0px auto;
  iframe {
    border-radius: 16px;
  }
  ${(props) => props.theme.breakpoints.down('lg')} {
    width: 100%;
    height: 404px;
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    width: 100%;
    height: 200px;
  }
`;
