/**
 * Owner: Ray.Lee@kupotech.com
 */

import styled from '@emotion/styled';
import Bonus from '@/assets/toolbar/bonus.png';
import Button from '@mui/Button';
import { keyframes } from '@emotion/react';

import { ICCloseOutlined } from '@kux/icons';

const zoom = keyframes`
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.1);
  }

  100% {
    transform: scale(1);
  }
`;

export const Wrapper = styled.div`
  position: fixed;
  bottom: 112px;
  right: 16px;
  z-index: 99;
`;

export const CollapseWrapper = styled.div`
  ${(props) =>
    props.collapse &&
    `
    transform: translate(60%) rotate(-45deg) ;
    opacity: 0.5;
    `};

  transition: 0.5s all;
`;

export const Area = styled.div`
  cursor: pointer;
  position: relative;
  display: flex;
  flex-direction: column;
  animation: ${(props) => (!props.collapse ? zoom : null)} 1s infinite;
`;

export const Content = styled.div`
  position: relative;
  width: 54px;
  height: 54px;
  border-radius: 50%;
  border: 1px solid ${(props) => props.theme.colors.cover4};
  background: url(${Bonus}) ${(props) => props.theme.colors.overlay} no-repeat
    center center;
  background-size: 100%;
  margin: 0 auto;
`;

export const ButtonPro = styled(Button)`
  height: 20px;
  border: 1px solid #fff;
  white-space: nowrap;
  padding: 0 4px;
  font-size: 12px;
  color: #fff;
  margin-top: -10px;
  position: relative;
`;

export const CloseFilledPro = styled(ICCloseOutlined)`
  position: absolute;
  top: -6px;
  right: 4px;
  color: #fff;
  width: 12px;
  height: 12px;
  border: 1px solid ${(props) => props.theme.colors.cover20};
  background-color: ${(props) => props.theme.colors.icon60};
  border-radius: 50%;
  box-sizing: border-box;
  padding: 2px;
  cursor: pointer;
  ${(props) =>
    props.collapse &&
    `
    opacity: 0;
    `};

  transition: 0.5s all;
`;
