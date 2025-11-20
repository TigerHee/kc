/**
 * Owner: jesse.shao@kupotech.com
 */
import { styled } from '@kufox/mui/emotion';
import { px2rem } from '@kufox/mui/utils';
import CALENDAR_CHECKED from 'assets/prediction/calendar-checked.png';
import { THEME_COLOR } from '../config';

// --- 样式start ---
export const Index = styled.section`
  width: 100%;
  min-height: ${px2rem(50)};
`;

export const CarouselWrapper = styled.div`
  width: 100%;
  .calendarSlider {
    width: 100%;
    position: relative;
  }
  .slick-prev,
  .slick-next {
    z-index: 100;
    bottom: ${px2rem(-10)};
    top: auto;
    transform: none;
  }
  .slick-prev {
    left: 0;
  }
  .slick-next {
    right: 0;
  }
  .slick-slide {
    text-align: center;
  }
  .disabledArrow {
    cursor: not-allowed;
  }
`;

export const CalendarWrapper = styled.div`
  display: flex;
  .timeBox {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .date,
    .week {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .week {
      font-size: ${px2rem(12)};
      line-height: ${px2rem(20)};
    }
    .date {
      font-size: ${px2rem(14)};
      line-height: ${px2rem(22)};
    }
  }
  .afterDay {
    .week {
      color: rgba(0, 20, 42, 0.6);
    }
    .date {
      color: #00142a;
    }
  }
  .checked {
    .date {
      width: ${px2rem(32)};
      height: ${px2rem(22)};
      background: rgba(0, 20, 42, 0.08);
      border-radius: 80px;
    }
  }
  .today {
    color: ${THEME_COLOR.primary};
    .week {
      color: ${THEME_COLOR.primary};
    }
    .date {
      width: 100%;
      color: ${THEME_COLOR.primary};
      background: url(${CALENDAR_CHECKED}) no-repeat;
      background-color: transport;
      background-size: ${px2rem(34)} ${px2rem(22)};
      background-position: center;
      font-weight: 500;
    }
  }
  .notStartActive {
    .date {
      width: 100%;
      color: ${THEME_COLOR.primary};
      background: url(${CALENDAR_CHECKED}) no-repeat;
      background-color: transport;
      background-size: ${px2rem(34)} ${px2rem(22)};
      background-position: center;
      font-weight: 500;
    }
  }
  @media (min-width: 1040px) {
  }
`;

export const CalendarItem = styled.div`
  display: inline-block;
  cursor: pointer;
  font-weight: 500;
  width: calc((100% - ${px2rem(100)}) / 6);
  padding: ${px2rem(4)};
  margin: 0 ${px2rem(4)};
  background: #fff;
  color: rgba(0, 20, 42, 0.3);
  text-align: center;
  .date {
    height: ${px2rem(22)};
    color: rgba(0, 20, 42);
  }
  @media (min-width: 1040px) {
    calc((100% - 80px) / 6);
    padding: 4px;
    margin: 0 4px;
    cursor: pointer;
  }
`;

export const CustomBtn = styled.div`
  width: ${px2rem(40)};
  height: ${px2rem(50)};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  img {
    width: ${px2rem(14)};
    height: ${px2rem(14)};
  }
  &::before {
    content: '';
    display: none;
  }
`;

export const PreImg = styled.img`
  transform: rotate(180deg);
`;
export const NextDisabled = styled.img`
  transform: rotate(180deg);
`;

// --- 样式end ---
