/*
 * @owner: borden@kupotech.com
 */
import { styled } from '@kux/mui';

export const Content = styled.div`
  position: relative;
  z-index: 2;
  max-width: 1200px;
  margin: 0 auto;
  padding-left: 16px;
  padding-right: 16px;
  ${(props) => props.theme.breakpoints.up('sm')} {
    padding-right: 24px;
    padding-left: 24px;
  }
  ${(props) => props.theme.breakpoints.up('lg')} {
    padding-right: 0;
    padding-left: 0;
  }
`;
