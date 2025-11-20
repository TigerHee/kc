/*
 * @Date: 2024-05-27 18:33:02
 * Owner: harry.lai@kupotech.com
 * @LastEditors: harry.lai harry.lai@kupotech.com
 */
import styled from '@emotion/styled';

export const TimeDisplay = styled.div`
  display: flex;
  align-items: center;
  flex-direction: ${({ isRTL }) => (isRTL ? 'row-reverse' : 'row')}; // rtl倒计时不反转
`;

export const Button = styled.button`
  margin-top: 20px;
  padding: 10px 20px;
  font-size: 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

export const TimeNumber = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 2px;

  background-color: ${({ isDark }) => (isDark ? '#1d1d1d' : '#D3F475')};
  color: ${({ isDark }) => (isDark ? '#D3F475' : '#1d1d1d')};
`;

export const TimeIntervalImg = styled.img`
  margin: ${({ gapWidth }) => `0 ${gapWidth}px`};
  width: 2px;
  height: 6px;
`;
