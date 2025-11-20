/**
 * Owner: terry@kupotech.com
 */
import { styled } from '@kufox/mui/emotion';
import { Button } from '@kufox/mui';
import { getIsAndroid } from 'helper';
import webBg from 'assets/invite/bg.png';
import h5Bg from 'assets/invite/bg-h5.png';
import { ReactComponent as UserIcon } from 'assets/invite/content/user.svg';
import { ReactComponent as EmptyUserIcon } from 'assets/invite/content/empty-user.svg';
import { ReactComponent as KCIcon } from 'assets/invite/content/kucoin.svg';
import { ReactComponent as XIcon } from 'assets/invite/content/x.svg';


export const StyledUserIcon = styled(UserIcon)`
  width: 76px;
  height: 76px;
  @media (max-width:767px) {
    width: 50px;
    height: 50px;
  }
`;

export const StyledEmptyUserIcon = styled(EmptyUserIcon)`
  width: 76px;
  height: 76px;
  @media (max-width:767px) {
    width: 50px;
    height: 50px;
  }
`;

export const StyledXIcon = styled(XIcon)`
  width: 36px;
  height: 32px;
  margin: 0 30px;
  position: relative;
  top: calc(-50% + 36px);
  @media (max-width:767px) {
    width: 20px;
    height: 17px;
    margin: 0 12px;
    top: calc(-50% + 24px);
  }
`;

export const StyledKCIcon = styled(KCIcon)`
  width: 76px;
  height: 76px;
  @media (max-width:767px) {
    width: 50px;
    height: 50px;
  }
`;

export const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: ${({ between }) => between ? 'space-between' : 'center'};
  margin-top: ${({ between }) => between ? '4px' : '0'};
  align-items: center;
`;

export const IconWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all .8s linear;
`;

export const Named = styled.div`
  font-family: 'Roboto';
  font-style: normal;
  font-weight: 500;
  font-size: 20px;
  line-height: ${({ user }) => user ? '100%' : '130%'};
  text-align: center;
  color: ${props => props.theme.colors.text};
  max-width: 97px;
  min-width: 76px;
  text-align: center;
  word-break: break-word;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  transition: all .8s linear;
  @media (max-width:767px) {
    font-size: 14px;
    line-height: ${({ user }) => user ? '100%' : '130%'};
    font-weight: 500;
    max-width: 62px;
    min-width: 50px;
  }
`;

export const Wrapper = styled.section`
  height: 100%;
  flex: 1;
  background: rgba(229, 244, 240, 1);
`;

export const ContentWrapper = styled.section`
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
  ${(props) => props.theme.breakpoints.down('md')} {
    max-width: 100%;
  }
`;

export const Container = styled.div`
  min-height: 100vh;
  padding-top: ${props => props.bannerHeight + 80}px;
  @media (max-width:767px) {
    padding-top: ${(props) => (props.isInApp ?  (getIsAndroid() ? "64px" : "88px") : `${props.bannerHeight+44}px`)};
    min-height: 100vh;
  }
  background: url(${webBg}) no-repeat;
  background-size: cover;
  display: flex;
  flex-direction: column;
  @media (min-width: 1920px) {
    background-size: cover;
  }
  @media screen and (max-width: 1920px) and (min-width: 768px) {
    background-size: cover;
  }
 @media (max-width:767px) {
  background: url(${h5Bg}) no-repeat;
  background-size: cover;
 }
`;

export const BrandWrapper = styled.section`
  position: relative;
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  border: 1px dashed #000000;
  border-radius: 104px;
  padding: 16px 44px;
 @media (max-width:767px) {
    margin-top: 58px;
    padding: 9px 25px;
 }
`;

export const Title = styled.h3`
  margin-top: 10px;
  margin-bottom: 0;
  font-family: Roboto
  font-style: normal;
  font-weight: 900;
  font-size: 78px;
  line-height: 90px;
  text-transform: uppercase;
  color: ${props => props.theme.colors.text};
  @media (max-width:767px) {
    margin-top: 20px;
    font-size: 40px;
    line-height: 48px;
    padding: 0 24px;
    word-break: break-word;
  }
`;

export const Desc = styled.p`
  margin: 0 auto;
  max-width: 700px;
  font-family: 'Roboto';
  font-style: normal;
  font-weight: 400;
  font-size: 20px;
  line-height: 130%;
  color: rgba(0, 13, 29, 0.68);
  text-align: center;
  margin-top: 14px;
  @media (max-width:767px) {
    max-width: 328px;
    font-size: 14px;
  }
`;

export const RegisterBtn = styled(Button)`
  min-width: 400px;
  margin-top: 60px;
  margin-bottom: 60px;
  border-radius: 6px;
  background: #FFE145;
  font-style: normal;
  font-weight: 500;
  font-size: 20px;
  line-height: 130%;
  color: ${props => props.theme.colors.text};
  height: 64px;
  &:hover, &:active {
    background-color: #FFEB83;
  }
  @media (max-width:767px) {
    min-width: -webkit-fill-available;
    max-width: 100%;
    width: initial;
    margin: 0 38px;
    margin-top: 40px;
    margin-bottom: 58px;
    border-radius: 5px;
    font-size: 16px;
    height: 48px;
  }
`;

export const RewardsWrapper = styled.section`
  border-top-left-radius: 135px;
  border-top-right-radius: 135px;
  background: rgba(229, 244, 240, 1);
  flex: 1;
  padding-top: 40px;
  padding-bottom: 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
  @media screen and (max-width: 1150px) and (min-width: 768px) {
    border-top-left-radius: 65px;
    border-top-right-radius: 65px;
  }
  @media (max-width:767px) {
    border-top-left-radius: 25px;
    border-top-right-radius: 25px;
    padding-top: 34px;
    padding-bottom: 12px;
  }
`;

export const RewardsContent = styled.section`
  display: flex;
  flex-direction: row;
  @media screen and (max-width: 1150px) and (min-width: 768px) {
    width: 100%;
    padding: 0 60px;;
  }
  @media (max-width:767px) {
    width: 100%;
    background: rgba(86, 219, 185, 0.21);
    border-top: 1px dashed #0CDFAD;
    border-bottom: 1px dashed #0CDFAD;
    padding: 22px 0;
    padding-left: 14px;
  }
`;

export const RewardsInfoWrapper = styled.section`
  position: relative;
  width: 100%;
  max-width: 1054px;
  margin-top: 12px;
  background: #FFFFFF;
  border-radius: 4px;
  height: 36px;
  overflow: hidden;
  opacity: ${props => props.isHidden ? 0 : 1};
  @media (max-width:767px) {
    margin-bottom: 30px;
  }
`;

export const MainCouponCard = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  position: relative;
  background: rgba(255, 225, 67, 0.2);
  border: 1px dashed #D5BD32;
  border-radius: 10px;
  width: 238px;
  min-height: 270px;
  @media (max-width:767px) {
    background: none;
    border: none;
    border-radius: 0;
    width: 125px;
    min-height: initial;
    height: auto;
  }
`;

export const LotteryCouponCard = styled.div`
  position: relative;
  background: rgba(86, 219, 185, 0.21);
  border: 1px dashed #0CDFAD;
  border-radius: 10px;
  width: 800px;
  min-height: 270px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  margin-left: 16px;
  padding-top: 0;
  .customSlider {
    width: 657px;
    height: 202px;
  }
  @media screen and (max-width: 1150px) and (min-width: 768px) {
    width: initial;
    margin: 0 20px;
    flex: 1;
    overflow: hidden;
    .customSlider {
      width: initial;
    }
  }
  @media (max-width:767px) {
    flex: 1;
    height: auto;
    width: initial;
    min-height: initial;
    margin-left: 8px;
    padding-top: 0;
    overflow-x: hidden;
    .customSlider {
      width: auto;
      height: auto;
    }
    background: none;
    border: none;
    border-radius: 0;
  }
`;

export const LotteryWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-top: 22px;
  @media (max-width:767px) {
    margin-top: 12px;
  }
`;

export const Tag = styled.div`
  position: relative;
  left: .5px;
  width: fit-content;
  margin-right: auto;
  background: ${props => props.lottery ? '#2DE6BA' : '#FFE145'};
  border-top-left-radius: 10px;
  border-bottom-right-radius: 30px;
  font-family: 'PingFang SC';
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 100%;
  padding: 4px 18px 4px 12px;
  color: ${props => props.theme.colors.text};
  word-break: break-word;
  overflow: hidden;
  text-overflow: ellipsis;
  display: flex;
  align-items: center;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  @media (max-width:767px) {
    left: ${props => props.lottery ? '0' : '7px'};
    padding: 4px 18px 4px 12px;
    margin-right: ${props => props.lottery ? '14px' : '0'};
    max-width: ${props => props.lottery ? 'initial' : '110px'};
    -webkit-line-clamp: 3;
  }
`;

export const SliderWrapper = styled.div`
  display: inline-flex;
  ${props => !props.isLotteryEmpty && `
    animation: moveAnimation ${props.time || '10s'} linear infinite;
  `}
  animation-play-state: running;
  &:hover {
    animation-play-state: paused;
  }
  @keyframes moveAnimation {
    from {
      transform: translate(0, 0);
    }

    to {
      transform: translate(-50%, 0);
    }
  }
`;

export const CouponBox = styled.div`
  margin: 0 30px;
  overflow-x: hidden;
  @media (max-width:767px) {
    width: 100%;
    margin: 0;
  }
`;
