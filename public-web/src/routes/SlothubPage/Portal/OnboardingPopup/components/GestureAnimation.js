/*
 * Owner: harry.lai@kupotech.com
 * @Date: 2024-06-20 15:48:13
 * @LastEditors: harry.lai harry.lai@kupotech.com
 * @LastEditTime: 2024-06-25 19:08:54
 */
import styled from '@emotion/styled';
import { memo } from 'react';
import LottieProvider from 'src/components/LottieProvider';
import { GestureWrap } from '../styled';

const Animation = styled(LottieProvider)`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 68px;
  height: 68px;
`;

export const GESTURE_DIRECTIONS = {
  left: 'left',
  right: 'right',
};

const GestureAnimation = ({ style, gestureDirection = GESTURE_DIRECTIONS.left }) => {
  return (
    <GestureWrap gestureDirection={gestureDirection} style={style}>
      <Animation iconName="slothub_button_gesture" speed={1} loop />
    </GestureWrap>
  );
};

export default memo(GestureAnimation);
