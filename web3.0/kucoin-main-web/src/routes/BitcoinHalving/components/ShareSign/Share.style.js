/**
 * Owner: ella.wang@kupotech.com
 */
import { styled } from '@kux/mui';

export const ShareWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

export const ShareTitle = styled.div`
  color: #f3f3f3;
  font-size: 14px;
  font-weight: 500;
  line-height: 130%;
`;

export const ShareContent = styled.div`
  margin-top: 14px;
  justify-content: ${({ isEn }) => (!isEn ? 'flex-start' : 'space-between')};
  display: flex;
  ${(props) => props.theme.breakpoints.down('lg')} {
    justify-content: ${({ staticGap }) => (staticGap ? 'flex-start' : 'space-between')};
    margin-top: ${({ staticGap }) => (staticGap ? '16px' : '0px')};
  }
  img:not(:last-child) {
    margin-right: ${({ staticGap }) => (staticGap ? '32px' : '0px')};
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    justify-content: space-between;
    margin-top: 0px;
  }
`;

export const ShareImage = styled.img`
  width: 28px;
  height: 28px;
  cursor: pointer;
`;
