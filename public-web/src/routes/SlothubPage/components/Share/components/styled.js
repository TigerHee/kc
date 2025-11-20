/*
 * Owner: harry.lai@kupotech.com
 */
import { css } from '@emotion/css';
import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import { Spin as KuxSpin } from '@kux/mui';

export const fadeInAnimation = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
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

export const BlurMask = styled.div`
  z-index: 1000;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgb(0, 13, 29, 0.3);
  opacity: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  animation: ${fadeInAnimation} 0.3s 0s cubic-bezier(0.16, 0, 0.18, 1) forwards;
`;

export const Spin = styled(KuxSpin)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;
