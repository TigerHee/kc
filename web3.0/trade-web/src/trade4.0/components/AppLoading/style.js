/*
 * @owner: borden@kupotech.com
 */
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';

const skRotatePlane = keyframes`
  0% {
    -webkit-transform: perspective(120px) rotateX(0deg) rotateY(0deg);
            transform: perspective(120px) rotateX(0deg) rotateY(0deg); }
  25% {
    -webkit-transform: perspective(120px) rotateX(-180.1deg) rotateY(0deg);
            transform: perspective(120px) rotateX(-180.1deg) rotateY(0deg); }
  50% {
    -webkit-transform: perspective(120px) rotateX(-180deg) rotateY(-179.9deg);
            transform: perspective(120px) rotateX(-180deg) rotateY(-179.9deg); }
  75% {
    -webkit-transform: perspective(120px) rotateX(0deg) rotateY(-179.9deg);
            transform: perspective(120px) rotateX(0deg) rotateY(-179.9deg); }
  100% {
    -webkit-transform: perspective(120px) rotateX(0deg) rotateY(0deg);
            transform: perspective(120px) rotateX(0deg) rotateY(0deg); }
`;

export const Loading = styled.div`
  height: 100%;
  width: 100%;
  position: fixed;
  z-index: 11;
  margin-top: 0;
  top: 0;
  // background-color: ${props => props.theme.colors.overlay};
  // 目前只能设置黑色，3.0架构后使用变量
  background-color: rgba(18, 18, 18, 1);
  
`;

export const LoadingCenter = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`;

export const LoadingCenterAbsolute = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  > div {
    width: 160px;
  }
`;

export const Rotating = styled.img`
  display: block;
  width: 60px;
  height: 60px;
  background-color: #333;
  margin: 25% auto;
  animation: ${skRotatePlane} 2.4s infinite ease-in-out;
  transform-style: preserve-3d;
  transform: translateZ(0px);
`;
