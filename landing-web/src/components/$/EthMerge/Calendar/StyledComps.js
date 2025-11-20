/**
 * Owner: jesse.shao@kupotech.com
 */
import { styled } from '@kufox/mui/emotion';

// --- 样式start ---
export const Index = styled.div`
  width: 100%;
  left: 0;
  right: 0;
  top: -66px;
  position: absolute;
`;

export const CalendarWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
`;

export const CalendarItem = styled.div`
  z-index: 1;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;

  width: 61.5px;
  height: 82px;

  background: rgba(0, 0, 0, 0.6);
  border: 2px solid #8583ff;

  color: #ffffff;

  span:first-of-type {
    flex-grow: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: 'Roboto Mono';
    font-style: normal;
    font-weight: 700;
    font-size: 20px;
    line-height: 130%;
  }

  span:last-of-type {
    overflow: hidden;
    width: 100%;
    flex-basis: 32px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    background: #6a25fc;
    border-top: 2px solid #8583ff;

    font-style: normal;
    font-weight: 500;
    font-size: 12px;
    line-height: 130%;
  }
`;

// --- 样式end ---
