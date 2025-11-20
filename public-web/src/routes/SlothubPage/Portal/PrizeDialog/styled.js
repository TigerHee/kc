/*
 *Owner: harry.lai@kupotech.com
 */
import { css } from '@emotion/css';
import { Button } from '@kux/mui';
import { keyframes, styled } from '@kux/mui/emotion';
import LottieProvider from 'src/components/LottieProvider';

import prizeBubbleBg from 'static/slothub/prize-bubble-bg.svg';

export const fadeInAnimation = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`;

const scaleAndFade = keyframes`
  0% {
    transform: scale(0);
    opacity: 0;
  }
  /* 在300ms时，缩放到1.1倍，透明度变为1 */
  60% {
    transform: scale(1.1);
    opacity: 1;
  }
  /* 在500ms时，缩放到1倍 */
  100% {
    transform: scale(1);
    opacity: 1;
  }
`;

// export const scaleAndFadeAnimationCss = `
//   animation: ${scaleAndFade} 0.5s 0s cubic-bezier(0, 0, 0.58, 1) forwards;
// `;

export const Container = styled.section`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-style: normal;
`;

export const PrizeImgWrapper = styled.div`
  position: relative;
  width: 45px;
  height: 45px;
  background: url(${prizeBubbleBg}) no-repeat;
  background-size: contain;
  display: flex;
  justify-content: center;
  align-items: center;
  /* margin-right: 16px; */
`;

export const SignPrizeImg = styled.img`
  position: relative;
  width: 80px;
  height: 80px;
  animation: ${scaleAndFade} 0.5s 0s cubic-bezier(0, 0, 0.58, 1) forwards;
`;

export const BlurMask = styled.div`
  z-index: 1000;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgb(0, 13, 29, 0.8);
  backdrop-filter: blur(8px);
  opacity: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  animation: ${fadeInAnimation} 0.3s 0s cubic-bezier(0.16, 0, 0.18, 1) forwards;
`;

export const MaskContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  /* gap: 20px; */
  position: relative;
  margin: 0 auto;

  // width: 100%;
  ${(props) => props.theme.breakpoints.down('sm')} {
    /* max-width: 375px; */
  }
`;

export const ButtonArea = styled.section`
  display: flex;
  padding-top: 40px;
  animation: ${fadeInAnimation} 0.3s 0s cubic-bezier(0.16, 0, 0.18, 1) forwards;
`;

export const SharedRewardDescWrap = styled.div`
  display: block;
  /* flex-direction: column; */
  color: rgba(243, 243, 243, 0.6);
  font-size: 14px;
  font-weight: 400;
  align-items: flex-start;
  width: 85px;

  p,
  span {
    overflow: hidden;
    line-height: 130%;
    text-align: left;
    text-wrap: nowrap;
    text-overflow: ellipsis;
  }

  .symbol {
    margin-bottom: 6px;
    color: #f3f3f3;
    font-weight: 600;
    font-size: 20px;
  }

  .coin-amount {
    margin-bottom: 6px;
    color: #d3f475;
    font-weight: 600;
    font-size: 20px;
  }

  .amount {
    color: #f3f3f3;
    font-weight: 600;
    font-size: 14px;
  }
`;

export const SharedRewardSizeDescWrap = styled(SharedRewardDescWrap)`
  flex: 1;
  margin-left: 16px;
`;

export const StyledButton = styled(Button)`
  font-size: 14px;
  font-weight: 600;
  width: 155.5px;
  margin: 0 4px;
  &.KuxButton-outlined {
    color: #d3f475;
    border: 1px solid #d3f475;
    border-radius: 24px;
  }
  &.KuxButton-contained {
    color: #1d1d1d;
    background: #d3f475;
  }
`;
export const GainPrizeTitle = styled.p`
  padding: 0 10px;
  color: #fff;
  font-weight: 700;
  font-size: 22px;
  line-height: 130%;
  text-align: center;
  animation: ${fadeInAnimation} 0.8s 0s cubic-bezier(0.16, 0, 0.18, 1) forwards;

  .highlight {
    color: #d3f475;
    font-weight: 400;
    font-size: 28px;
    line-height: 130%;
  }

  .bold {
    font-weight: 900;
    font-size: 42px;
    -webkit-text-stroke-width: 2;
    -webkit-text-stroke-color: #1d1d1d;
  }
`;

export const TaskPrizeName = styled.span`
  color: #d3f475;
  font-size: 28px;
  font-weight: 400;
  line-height: 130%;
`;

export const TaskPrizeAmount = styled(TaskPrizeName)`
  font-size: 42px;
  -webkit-text-stroke-width: 2;
  -webkit-text-stroke-color: #1d1d1d;
`;

export const TaskPrizeItem = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  position: relative;
  align-items: center;
  max-width: 80px;

  .quantity {
    width: 100%;
    margin-top: 12px;
    overflow: hidden;
    color: #fff;
    font-weight: 500;
    font-size: 16px;
    line-height: 130%;
    text-align: center;
    text-overflow: ellipsis;
  }
`;

export const TaskContentWrapper = styled.div`
  padding: 0 22px;
  /* width: 100vw; */
`;

export const SharedRewardListWrap = styled.div`
  width: ${({ isSinglePrize }) => (isSinglePrize ? 'auto' : '690px')};
  display: ${({ isSinglePrize }) => (isSinglePrize ? 'flex' : 'grid')};
  margin: 40px auto 0;
  padding: 0 8px;
  grid-template-columns: repeat(2, 1fr);
  align-items: flex-start;
  max-height: 376px;
  overflow-y: ${({ enableScroll }) => (enableScroll ? 'scroll' : 'unset')};
  overflow-x: ${({ enableScroll }) => (enableScroll ? 'hidden' : 'unset')};
  pointer-events: ${({ isMockScene }) => (isMockScene ? 'none' : 'unset')};

  ${(props) => props.theme.breakpoints.down('sm')} {
    grid-template-columns: repeat(1, 1fr);
    width: calc(100vw - 44px);
    max-width: 460px;
    padding: 0;
  }

  &::-webkit-scrollbar {
    width: 2px;
    height: 2px;
    background: transparent;
  }
  &::-webkit-scrollbar-track {
    width: 15px;
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    width: 15px;
    background: #d3f475;
    border-radius: 2px;
  }
`;

export const SharedRewardItemWrap = styled.section`
  display: flex;
  position: relative;
  padding: 12px;
  align-items: center;
  // flex: 1;
  border-radius: 12px;
  border: 1px solid rgba(211, 244, 117, 0.6);
  background: rgba(0, 0, 0, 0.3);
  width: 330px;
  margin: 0 auto;

  ${({ theme }) => theme.breakpoints.down('sm')} {
    width: calc(100% - 8px);
    min-width: 300px;
  }

  &:not(:last-child) {
    margin-bottom: 12px;
  }

  .quantity {
    margin-top: 12px;
    color: #fff;
    font-weight: 500;
    font-size: 16px;
    line-height: 130%;
  }

  .coin-img {
    width: 28px;
    height: 28px;
  }

  .reward-info {
    display: flex;
    flex: 1;
  }
`;

export const sharedRewardItemScaleFadeAnimation = css`
  &,
  > * {
    animation: ${scaleAndFade} 0.5s 0s cubic-bezier(0, 0, 0.58, 1) forwards;
  }
`;

export const fadeOutAnimation = css`
  /* 定义消失动画的关键帧 */
  @keyframes fadeOut {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }
  animation: fadeOut 280ms cubic-bezier(0.3, 0, 1, 1) forwards;
`;

export const PrizeLightAnimation = styled(LottieProvider)`
  position: absolute;
  top: -30px;
  /* left: 50%;
  transform: translateX(-50%); */
  left: -30px;
  top: -30px;
  width: 140px;
  height: 140px;

  animation: ${scaleAndFade} 0.5s 0s cubic-bezier(0, 0, 0.58, 1) forwards;
`;

export const TaskPrizeContent = styled.div`
  display: flex;
  overflow-x: auto;
  overflow-y: hidden;
  /* width: calc(100vw - 56px); */
  align-items: center;
  justify-content: flex-start;
  padding-bottom: 22px;

  ${({ theme }) => theme.breakpoints.down('sm')} {
    align-items: stretch;
    width: calc(100vw - 28px);
    margin-left: 28px;
  }

  ${({ theme }) => theme.breakpoints.up('sm')} {
    width: 440px;
  }

  &::-webkit-scrollbar {
    width: 2px;
    height: 2px;
    background: transparent;
  }
  &::-webkit-scrollbar-track {
    width: 15px;
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    width: 15px;
    background: #d3f475;
    border-radius: 2px;
  }
  &::-webkit-scrollbar-track-piece {
    width: 1px;
    background: #8c8c8c66;
  }
`;
