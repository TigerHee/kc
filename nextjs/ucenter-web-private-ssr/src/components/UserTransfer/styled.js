/**
 * Owner: willen@kupotech.com
 */

import { styled } from '@kux/mui';
import tradePasswordBg from 'static/account/trade-password.svg';
import bgImage from 'static/account/utransfer-bg.svg';

export const UtransferWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: calc(100vh - 38px);
  background: ${({ theme }) => `${theme.colors.overlay} url(${bgImage}) no-repeat center`};
  background-size: 1174px auto;
`;

export const UtransferHeader = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 20px 20px 0 20px;
  background: ${({ theme }) => theme.colors.overlay};
  a {
    color: #333;
  }
`;

export const Out = styled.span`
  margin-left: 16px;
  color: ${({ theme }) => theme.colors.text};
  font-size: 12px;
  cursor: pointer;
`;

export const TermsContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: calc(100vh - 38px);
  h1 {
    margin-bottom: 1em;
    color: ${({ theme }) => theme.colors.text};
    font-size: 24px;
    line-height: 24px;
    letter-spacing: 0;
    text-align: center;
  }
`;

export const TermsWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
  width: 540px;
  min-height: 400px;
  max-height: 690px;
  padding: 40px 20px 56px 20px;
  background: ${({ theme }) => theme.colors.overlay};
  box-shadow: 0 4px 32px 0 ${({ theme }) => theme.colors.cover8};
`;

export const Main = styled.div`
  flex: 1;
  max-height: 482px;
  padding: 20px;
  overflow-x: hidden;
  overflow-y: auto;
  color: ${({ theme }) => theme.colors.text};
  &::-webkit-scrollbar-thumb {
    width: 4px;
    height: 150px;
    background-color: #d8d8d8;
    background-clip: padding-box;
    border-radius: 5px;
  }
  &::-webkit-scrollbar {
    width: 4px;
    height: 150px;
  }
  section {
    h4 {
      margin-bottom: 1em;
      font-size: 14px;
    }
  }
`;

export const ItemsFoot = styled.div`
  margin-top: 20px;
  padding: 0 20px;
`;

export const SystemUpgradeWrapper = styled.div`
  width: 540px;
  height: 658px;
  padding: 56px 40px;
  background: ${({ theme }) => theme.colors.overlay};
  border-radius: 16px;
  box-shadow: 0 2px 8px 0 rgba(196, 196, 196, 0.5);
`;

export const SystemHead = styled.div`
  h1 {
    color: ${({ theme }) => theme.colors.text};
    font-size: 16px;
    line-height: 24px;
    letter-spacing: 0;
    text-align: center;
  }
`;

export const UserInfo = styled.div``;

export const UserInfoItem = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.text};
  font-size: 13px;
`;

export const SystemItem = styled.div``;

export const SystemItemHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 48px;
  padding: 0 16px;
  border: 1px solid ${({ theme }) => theme.colors.text20};
  border-radius: 6px;
`;

export const SystemItemHeadLeft = styled.div`
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.text};
  span {
    color: ${({ theme }) => theme.colors.text};
  }
`;

export const SystemItemMain = styled.div`
  padding: 16px 0 16px 40px;
  p {
    position: relative;
    color: ${({ theme }) => theme.colors.text};
    font-size: 12px;
    opacity: 0.8;
    &:before {
      position: absolute;
      top: 50%;
      left: -20px;
      width: 6px;
      height: 6px;
      margin-top: -3px;
      background: ${({ theme }) => theme.colors.text};
      border-radius: 100%;
      content: '';
    }
  }
`;

export const SetPasswordWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 460px;
  height: 530px;
  padding: 0 24px;
  border-radius: 16px;
  background: ${({ theme }) => theme.colors.overlay};
  box-shadow: 0 2px 8px 0 ${({ theme }) => theme.colors.cover8};
  ${({ theme }) => theme.breakpoints.down('sm')} {
    width: calc(100vw - 32px);
    margin: 0 16px;
  }
`;

export const FormTitle = styled.div`
  h1 {
    margin: 0;
    color: ${({ theme }) => theme.colors.text};
    font-size: 24px;
    text-align: center;
  }
  margin-bottom: 40px;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    font-size: 18px;
  }
`;

export const Warn = styled.div`
  margin-top: -22px;
  margin-bottom: 24px;
  padding: 8px 12px;
  font-size: 13px;
  background: ${({ theme }) => theme.colors.complementary8};
  color: ${({ theme }) => theme.colors.text60};
  border-radius: 8px;
`;

export const TradePrassword = styled.div`
  width: 247px;
  height: 181px;
  margin: 0 auto;
  background: url(${tradePasswordBg}) no-repeat center;
  background-size: contain;
`;

export const SafeQuestionWrapper = styled.div`
  width: 460px;
  height: 530px;
  padding: 108px 24px 0 24px;
  background: ${({ theme }) => theme.colors.overlay};
  border-radius: 16px;
  box-shadow: 0 2px 8px 0 ${({ theme }) => theme.colors.cover16};
`;

export const FormTitleWithColor = styled.div`
  h1 {
    margin: 0;
    color: ${({ theme }) => theme.colors.text};
    font-size: 24px;
    text-align: center;
  }
  margin-bottom: 40px;
`;

export const Forget = styled.div`
  margin-top: 8px;
  text-align: right;
  a {
    color: #9b9b9b;
    font-size: 12px;
  }
`;

export const CombinationWrapper = styled.div`
  display: flex;
  transform: translateX(60px);
  perspective: 600px;
`;

export const LeftSection = styled.div`
  position: relative;
  z-index: 10;
  transform: translate3d(0, 0, 0);
  transition: all 0.5s;
  &.over {
    z-index: 9;
    transform: translate3d(-100px, 0, -120px);
  }
`;

export const RightSection = styled.div`
  position: relative;
  z-index: 9;
  transform: translate3d(-80px, 0, -120px);
  transition: all 0.5s;
  &.over {
    z-index: 10;
    transform: translate3d(-136px, 0, 0);
  }
`;

export const FormBody = styled.div`
  .forget {
    margin-top: 8px;
    text-align: right;
    a {
      color: #9b9b9b;
      font-size: 12px;
    }
  }
`;

export const SafeQuestionsSuccess = styled.div`
  margin-top: 70px;
  p {
    color: ${({ theme }) => theme.colors.text};
    font-size: 16px;
    text-align: center;
  }
`;
