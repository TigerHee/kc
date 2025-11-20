/**
 * Owner: ella.wang@kupotech.com
 */
import { styled } from '@kux/mui';

export const ListItem = styled.li`
  display: flex;
  flex-direction: row;
  &:not(:last-child) {
    margin-bottom: 32px;
    ${(props) => props.theme.breakpoints.down('sm')} {
      margin-bottom: 24px;
    }
  }
`;

export const Num = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid #000d1d;
  color: #000d1d;
  font-size: 14px;
  font-weight: 600;
  line-height: 130%;
  display: flex;
  justify-content: center;
  align-items: center;
  [dir='rtl'] & {
    margin-left: 12px;
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    width: 24px;
    height: 24px;
  }
`;

export const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  padding-left: 16px;
  ${(props) => props.theme.breakpoints.down('sm')} {
    padding-left: 12px;
  }
`;

export const Title = styled.h3`
  color: #000d1d;
  font-size: 18px;
  font-weight: 700;
  line-height: 130%;
  margin: 0px;
  ${(props) => props.theme.breakpoints.down('sm')} {
    font-weight: 600;
    font-size: 16px;
  }
`;

export const Description = styled.p`
  color: rgba(29, 29, 29, 0.6);
  font-size: 16px;
  font-weight: 400;
  line-height: 150%;
  margin-top: 16px;
  margin-bottom: 0px;
  ${(props) => props.theme.breakpoints.down('sm')} {
    margin-top: 13px;
    font-size: 12px;
  }
`;
