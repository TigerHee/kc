/**
 * Owner: ella.wang@kupotech.com
 */
import { styled } from '@kux/mui';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  ${(props) => props.theme.breakpoints.down('sm')} {
    justify-content: center;
  }
  [dir='rtl'] & {
    justify-content: flex-end;
    direction: rtl;
  }
`;

export const TimeBox = styled.div`
  position: relative;
  width: 63px;
  height: 74px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 8px;
  background: rgba(34, 34, 34, 0.4);
  ${(props) => props.theme.breakpoints.down('sm')} {
    width: 58px;
    height: 70px;
  }
  [dir='rtl'] & {
    direction: rtl;
  }
`;

export const TopBgImg = styled.img`
  position: absolute;
  width: 57px;
  height: 33px;
  top: 3px;
  left: 3px;
  ${(props) => props.theme.breakpoints.down('sm')} {
    top: 4px;
    left: 4px;
    width: 50px;
    height: 31px;
  }
  [dir='rtl'] & {
    direction: rtl;
  }
`;

export const BottomBgImg = styled.img`
  position: absolute;
  width: 57px;
  height: 33px;
  bottom: 3px;
  left: 3px;
  ${(props) => props.theme.breakpoints.down('sm')} {
    bottom: 4px;
    left: 4px;
    width: 50px;
    height: 31px;
  }
  [dir='rtl'] & {
    direction: rtl;
  }
`;

export const Time = styled.span`
  color: #01bc8d;
  font-size: 36px;
  font-weight: 700;
  line-height: 130%;
  padding-top: 6px;
  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 28px;
  }
`;

export const Unit = styled.span`
  color: #115040;
  font-size: 13px;
  font-weight: 700;
  line-height: 130%;
  ${(props) => props.theme.breakpoints.down('sm')} {
    font-weight: 500;
    font-size: 14px;
  }
  [dir='rtl'] & {
    direction: rtl;
  }
`;

export const Separator = styled(Time)`
  color: rgba(1, 188, 141, 0.2);
  padding: 0px 18px;
  ${(props) => props.theme.breakpoints.down('sm')} {
    padding: 0px 12px;
  }
  [dir='rtl'] & {
    direction: rtl;
  }
`;
