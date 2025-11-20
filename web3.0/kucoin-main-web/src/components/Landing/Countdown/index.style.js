/**
 * Owner: ella.wang@kupotech.com
 */
import { styled } from '@kux/mui';

export const Wrapper = styled.div`
  padding-top: 24px;
  ${(props) => props.theme.breakpoints.down('lg')} {
    padding-top: 18px;
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    padding-top: 16px;
  }
`;

export const Title = styled.div`
  color: #000d1d;
  font-size: 16px;
  font-weight: 400;
  line-height: 130%;
`;

export const Digit = styled.span`
  color: #1d1d1d;
  padding: 8px 16px;
  font-size: 28px;
  font-weight: 700;
  line-height: 130%;
  border-radius: 10px;
  background: #fff;
  box-shadow: 0px 0px 54.30284px 0px rgba(0, 0, 0, 0.04);
`;

export const TimeWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 16px 0px 0px 0px;
  ${(props) => props.theme.breakpoints.down('sm')} {
    padding: 16px 0px;
  }
`;

export const Separator = styled.span`
  color: #1d1d1d;
  font-size: 28px;
  font-weight: 700;
  line-height: 130%;
  padding: 0px 12.22px;
`;

export const Unit = styled.span`
  color: rgba(29, 29, 29, 0.4);
  font-size: 18px;
  font-weight: 500;
  line-height: 130%;
  padding-left: 6px;
`;
