/**
 * Owner: ella.wang@kupotech.com
 */
import { styled } from '@kux/mui';

export const CardWrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-top: -8px;
  ${(props) => props.theme.breakpoints.down('lg')} {
    display: flex;
    flex-direction: column;
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    margin-top: 8px;
  }
`;
