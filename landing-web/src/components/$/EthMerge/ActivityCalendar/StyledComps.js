/**
 * Owner: jesse.shao@kupotech.com
 */
import { styled } from '@kufox/mui/emotion';

import { ReactComponent as ArrowRight } from 'assets/eth-merge/arrow-right.svg';
import { ReactComponent as CalendarSvg } from '../assets/activity-calendar.svg';

import FOOTER_BG from 'assets/eth-merge/footer-bg.png';

const Text1 = 'rgba(255, 255, 255, 1)';
const Text04 = 'rgba(255, 255, 255, 0.4)';
const Text06 = 'rgba(255, 255, 255, 0.6)';

const HighLightColor = 'rgba(112, 240, 134, 1)';

// --- 样式start ---
export const Wrapper = styled.div`
  background-origin: border-box;
  background-position: center;
  background-image: url(${FOOTER_BG});
  background-repeat: no-repeat;
  background-size: 100% auto;
`;

export const Index = styled.section`
  margin: 64px 16px 0 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
export const CalendarWrapper = styled.div`
  position: relative;
  width: 100%;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgb(68, 64, 255);
`;

export const CalendarImg = styled(CalendarSvg)`
  position: absolute;
  right: 16px;
  top: -6px;
`;

export const CalendarHeader = styled.div`
  width: 100%;
  height: 30px;
  border: 1px solid rgb(68, 64, 255);
`;

export const SectionHeader = styled.h3`
  width: 240px;
  margin-bottom: 16px;
  text-align: center;
  font-style: normal;
  font-weight: 600;
  font-size: 18px;
  line-height: 130%;
  color: #ffffff;
  text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.2);
`;

export const MonthDiv = styled.div`
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  color: ${Text04};
`;

export const HighLightDiv = styled.div`
  font-weight: 600;
  font-size: 20px;
  line-height: 130%;
  color: ${HighLightColor};
`;

export const LargeCalendarItem = styled.div`
  width: 100%;
  border: 1px solid rgb(68, 64, 255);
  padding: 24px 16px;
  cursor: pointer;
`;

export const SmallCalendarWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-flow: row wrap;
`;

export const SmallCalendarItem = styled.div`
  flex: 0 0 50%;
  width: 50%;
  border: 1px solid rgb(68, 64, 255);
  background: rgba(0, 0, 0, 0.3);
  padding: 24px 16px;
  cursor: pointer;
`;

export const Entrance = styled.div`
  display: flex;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const Title = styled.div`
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 130%;
  color: ${Text1};
`;

export const Icon = styled(ArrowRight)`
  width: 14px;
  height: 14px;
  opacity: 0.4;
  [dir='rtl'] & {
    transform: rotateY(180deg);
  }
`;
export const ActivityWrapper = styled.div`
  margin-top: 12px;
`;

export const ActivityList = styled.div``;
export const ActivityItem = styled.div`
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 130%;
  color: ${Text06};
  .highlight {
    color: #f7ff53;
  }
`;
export const Des = styled.div`
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 130%;
  color: #f7ff53;
`;
// --- 样式end ---
