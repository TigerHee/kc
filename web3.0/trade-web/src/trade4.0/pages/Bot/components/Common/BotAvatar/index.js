/**
 * Owner: mike@kupotech.com
 */
import React from 'react';
import styled from '@emotion/styled';
import { useTheme } from '@kux/mui';
import { getStrategiesDescription } from 'Bot/config';
import iconPlaceHolder from '@/assets/bot/icons/leaderboard-bots.svg';

const Wrap = styled.div`
  width: ${({ size }) => `${size }px`};
  height: ${({ size }) => `${size }px`};
  overflow: hidden;
  flex-shrink: 0;
  min-width: ${({ size }) => `${size }px`};
  img {
    width: 100%;
    height: 100%;
  }
`;

const Avatar = ({ id, className, size = 28 }) => {
  const { currentTheme } = useTheme();
  const src = getStrategiesDescription(id)[`${currentTheme}Icon`] ?? iconPlaceHolder;
  return (
    <Wrap className={className} size={size}>
      <img src={src} alt="" />
    </Wrap>
  );
};

export default Avatar;
