/**
 * Owner: ella.wang@kupotech.com
 */
import { styled } from '@kux/mui';

export const Wrapper = styled.div`
  width: 100%;
  position: relative;
  padding: 80px 0px 120px 0px;
  ${(props) => props.theme.breakpoints.down('lg')} {
    padding: 80px 24px 152px 24px;
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    padding: 40px 16px 30px 16px;
  }
`;

export const ContentWapper = styled.div`
  max-width: 1200px;
  width: 100%;
  margin: 0px auto;
  position: relative;
`;

export const BannerInfo = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
`;

export const MdWrapper = styled(BannerInfo)`
  width: 100%;
`;

export const DesWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  max-width: 733px;
  ${(props) => props.theme.breakpoints.down('lg')} {
    max-width: 100%;
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    max-width: 100%;
  }
`;

export const Title = styled.h1`
  color: #f3f3f3;
  text-align: center;
  font-size: 48px;
  font-weight: 700;
  line-height: 130%;
  margin: 0px;
  padding: 0px;
  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 24px;
  }
`;

export const DesInfo = styled.p`
  color: rgba(243, 243, 243, 0.6);
  font-size: 16px;
  font-weight: 400;
  line-height: 130%;
  margin-top: 20px;
  margin-bottom: 0px;
  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 12px;
  }
`;

export const Button = styled.a`
  display: flex;
  flex-direction: row;
  align-items: center;
  border-radius: 24px;
  background: rgba(243, 243, 243, 0.08);
  padding: 6px 16px 6px 12px;
  margin-top: 16px;
  [dir='rtl'] & {
    svg {
      transform: rotateZ(180deg);
    }
  }
  img {
    width: 16px;
    height: 16px;
    margin-right: 6px;
  }
  ${(props) => props.theme.breakpoints.down('lg')} {
    display: inline-block;
    svg {
      margin-top: -2px;
      vertical-align: middle;
    }
  }
`;

export const Text = styled.span`
  color: #fff;
  font-size: 14px;
  font-weight: 700;
  line-height: 130%;
`;

export const Price = styled(Text)`
  margin-left: 8px;
  margin-right: 6px;
`;

export const Image = styled.img`
  width: 408px;
  height: 428px;
  margin-top: -30px;
  ${(props) => props.theme.breakpoints.down('lg')} {
    width: 211px;
    height: 224px;
    margin-top: 0px;
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    position: absolute;
    top: 0px;
    right: 0px;
    width: 162px;
    height: 133px;
  }
`;

export const TimerWrapper = styled.div`
  margin: 32px 0px 16px 0px;
  width: 100%;
  display: flex;
  flex-direction: column;
  ${(props) => props.theme.breakpoints.down('sm')} {
    margin: 30px 0px 24px 0px;
  }
`;

export const TimeInfo = styled.span`
  color: #f3f3f3;
  font-size: 15px;
  font-weight: 400;
  line-height: 130%;
  margin-bottom: 16px;
  ${(props) => props.theme.breakpoints.down('sm')} {
    margin-bottom: 8px;
    font-size: 12px;
    text-align: center;
  }
`;
