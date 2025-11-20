/**
 * Owner: ella.wang@kupotech.com
 */
import { styled } from '@kux/mui';

export const ShareWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: ${(props) => props.mb}px;
  ${(props) => props.theme.breakpoints.down('lg')} {
    flex-direction: ${(props) => (!props.responseFlex ? 'row' : 'column')};
    width: ${(props) => (!props.responseFlex ? '100%' : 'auto')};
    margin-top: ${(props) => (!props.responseFlex ? '16px' : '0px')};
  }
`;

export const ShareTitle = styled.div`
  color: #000d1d;
  font-size: 14px;
  font-weight: 500;
  line-height: 130%;
  ${(props) => props.theme.breakpoints.down('lg')} {
    margin-right: 24px;
  }
`;

export const ShareContent = styled.div`
  margin-top: 24px;
  ${(props) => props.theme.breakpoints.down('lg')} {
    margin-top: 0px;
  }
`;

export const ShareImage = styled.img`
  width: 24px;
  height: 24px;
  cursor: pointer;
  &:not(:last-child) {
    margin-right: 24px;
    margin-left: 0px;
  }
  [dir='rtl'] &:not(:last-child) {
    margin-right: 0px;
    margin-left: 24px;
  }
  ${(props) => props.theme.breakpoints.down('lg')} {
    margin-top: ${(props) => (props.responseFlex ? '16px' : '0px')};
  }
`;
