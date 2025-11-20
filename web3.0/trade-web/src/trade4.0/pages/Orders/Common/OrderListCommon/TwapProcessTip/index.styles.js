/* eslint-disable no-confusing-arrow */
/*
 * @Owner: gannicus.zhou@kupotech.com
 * @Date: 2024-04-04 17:17:00
 * @LastEditors: harry.lai harry.lai@kupotech.com
 * @LastEditTime: 2024-05-13 22:05:29
 * @FilePath: /trade-web/src/trade4.0/pages/Orders/Common/OrderListCommon/EnhanceIndiaComplianceTipWrap.style.js
 * @Description:
 */
import { Tooltip } from '@kux/mui';
import styled from '@emotion/styled';
import { ICWaitOutlined } from '@kux/icons';
import { keyframes } from '@emotion/react';

export const Wrap = styled.section`
  display: flex;
  align-items: center;
`;

export const InfoIcon = styled(ICWaitOutlined)`
  width: 12px;
  height: 12px;
  margin-right: 2px;
  fill: ${({ theme, isPaused }) => (isPaused ? theme.colors.complementary : theme.colors.primary)};
`;

export const StyledTooltip = styled(Tooltip)`
  padding: 5px 8px;
`;

export const ButtonArea = styled.section`
  padding: 32px 24px 24px;
  display: flex;
  margin-left: auto;
  a {
    color: ${({ theme }) => theme.colors.text};
  }
`;

const emotionAnimation = keyframes`
    0% {
      transform: scale(0.8);
      opacity: 0.5;
    }
    50% {
      transform: scale(2);
      opacity: 0.8;
      border-width: 2px;
    }
    100% {
      transform: scale(2.8);
      opacity: 0;
      border-width: 3px;
    }
`;

export const AnimationPoint = styled.span`
  background-color: ${({ theme, isPaused, isDisabled }) => {
    if (isDisabled) {
      return theme.colors.icon;
    }
    return isPaused ? theme.colors.complementary : theme.colors.primary;
  }};
  display: inline-block;
  width: 6px;
  height: 6px;
  vertical-align: middle;
  border-radius: 50%;
  top: 0px;
  bottom: 0px;
  left: 0px;
  position: relative;
  box-sizing: border-box;
  align-items: center;
  justify-content: center;
  margin-right: 4px;
  margin-left: 3px;

  ::after {
    box-sizing: border-box;
    font-size: 14px;
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    border: 1px solid
      ${({ theme, isPaused, isDisabled }) => {
        if (isDisabled) {
          return theme.colors.icon;
        }
        return isPaused ? theme.colors.complementary : theme.colors.primary;
      }};
    border-radius: 50%;
    animation: 1.2s ease-in-out 0s infinite normal none running ${emotionAnimation};
    content: '';
    ${({ isDisabled }) => {
      if (isDisabled) {
        return `
          animation: unset;
          `;
      }
    }};   
  }
  span {
    font-weight: 400;
    line-height: 130%; /* 15.6px */
  }
`;

export const RunStatusWrap = styled.section`
  display: flex;
  align-items: center;
  position: relative;
  margin-bottom: 2px;
`;

export const TipTitle = styled.span`
  font-family: Roboto;
  font-size: 12px;
  font-weight: 400;
  line-height: 130%;
  color: ${({ theme, isPaused }) => (isPaused ? theme.colors.complementary : theme.colors.primary)};
`;

export const TipText = styled.span`
  font-family: Roboto;
  font-size: 12px;
  font-weight: 400;
  line-height: 130%;
`;
