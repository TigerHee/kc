/**
 * Owner: jesse.shao@kupotech.com
 */
import React, { useCallback, useState, useEffect, useRef, useMemo } from 'react';
import { useSelector, useDispatch } from 'dva';
import moment from 'moment';
import { debounce, isFunction, findIndex, head, last, isNil } from 'lodash';
import clsx from 'classname';
import Slider from 'react-slick';
import { getCalendarData } from '../selector';
import {
  Index,
  CarouselWrapper,
  CalendarWrapper,
  CalendarItem,
  CustomBtn,
  PreImg,
  NextDisabled,
} from './StyledComps';
import ARROW_ALLOWED from 'assets/prediction/arrow-allowed.svg';
import ARROW_DISABLED from 'assets/prediction/arrow-disabled.svg';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const Calendar = () => {
  const calendarSlider = useRef(null);
  const dispatch = useDispatch();
  const [calendarSlideKey, setCalendarSlideKey] = useState(0); // 切换后的SlideKey 用于切换按钮的显示
  const [initIndex, setInitIndex] = useState(0); // 切换后的SlideKey 用于切换按钮的显示
  const [showCalendar, setShowCalendar] = useState(false); // 是否展示日历
  const { activityConfig = {}, checkedUnix, todayStartUnix } = useSelector(state => state.prediction);
  const { now: serverTime, start: activityStart, end: activityEnd } = activityConfig || {};
  const todaySearchUnix = useMemo(() => {
    return moment
    .utc(serverTime)
    .startOf('day')
    .valueOf();
  }, [serverTime]); // 今天的开始时间戳
  const calendarDataArray = useMemo(() => {
    return activityStart
    ? getCalendarData({ start: activityStart, end: activityEnd })
    : []
  }, [activityEnd, activityStart]); // 日历数组
  const calendarLen = calendarDataArray?.length;
  // 根据当前服务器时间设置 默认展示周
  useEffect(
    () => {
      let index = undefined;
      if (todaySearchUnix < activityStart) {
        index = 0;
      } else if (todaySearchUnix > activityEnd) {
        index = calendarLen - 1;
      } else {
        index = findIndex(
          calendarDataArray,
          i => head(i)?.startUnix <= todaySearchUnix && last(i)?.endUnix >= todaySearchUnix,
        );
      }
      setInitIndex(index);
      setCalendarSlideKey(index);
      setShowCalendar(true);
      dispatch({
        type: 'prediction/update',
        payload: {
          todayStartUnix: todaySearchUnix,
        },
      });
    },
    [todaySearchUnix, activityStart, activityEnd, calendarLen],
  ); // 此处不可添加calendarDataArray为依赖，否则每次切换时都会设置calendarSlideKey 为findIndex找出来的index!!

  useEffect(
    () => {
      if (calendarSlider?.current && !isNil(initIndex) && initIndex > -1  && calendarLen) {
        calendarSlider.current.slickGoTo(initIndex);
      }
    },
    [initIndex, calendarSlider, calendarLen],
  );
  // 初始化搜索日期
  useEffect(
    () => {
      if (serverTime) {
        let time;
        // 活动未开始
        if (serverTime < activityStart) {
          time = activityStart;
        } else if (serverTime > activityEnd) {
          // 活动已结束
          time = activityEnd;
        } else {
          time = serverTime;
        }
        dispatch({
          type: 'prediction/update',
          payload: {
            searchUnix: time,
            checkedUnix: serverTime,
          },
        });
      }
    },
    [serverTime, dispatch, activityStart, activityEnd],
  );
  // 改变日期
  const changeDate = useCallback(
    date => {
      const { startUnix } = date;
      dispatch({
        type: 'prediction/update',
        payload: {
          searchUnix: startUnix,
          checkedUnix: startUnix,
        },
      });
    },
    [dispatch],
  );
  // 上一个切换按钮
  const Prev = useCallback(
    props => {
      const { onClick, className, currentSlide } = props;
      const disabled = currentSlide === 0;
      return (
        <CustomBtn
          className={`${className} ${disabled ? 'disabledArrow' : ''}`}
          onClick={() => {
            if (!disabled) {
              setCalendarSlideKey(calendarSlideKey - 1);
              onClick();
            }
          }}
        >
          {disabled ? <img src={ARROW_DISABLED} alt="" /> : <PreImg src={ARROW_ALLOWED} alt="" />}
        </CustomBtn>
      );
    },
    [calendarSlideKey, setCalendarSlideKey],
  );
  // 下一个切换按钮
  const Next = useCallback(
    props => {
      const { onClick, className, currentSlide } = props;
      const disabled = currentSlide >= calendarLen - 1;
      return (
        <CustomBtn
          className={`${className} ${disabled ? 'disabledArrow' : ''}`}
          onClick={() => {
            if (!disabled) {
              setCalendarSlideKey(calendarSlideKey + 1);
              onClick();
            }
          }}
        >
          {disabled ? (
            <NextDisabled src={ARROW_DISABLED} alt="" />
          ) : (
            <img src={ARROW_ALLOWED} alt="" />
          )}
        </CustomBtn>
      );
    },
    [calendarSlideKey, setCalendarSlideKey, calendarLen],
  );

  // 点击日期
  const onClickDate = useCallback(
    debounce(
      item => {
        changeDate && isFunction(changeDate) && changeDate(item);
      },
      500,
      { leading: true, trailing: false },
    ),
    [],
  );
  const SliderSettings = {
    className: 'calendarSlider',
    infinite: false,
    speed: 500,
    draggable: false,
    swipe: false,
    autoplay: false,
    vertical: false,
    prevArrow: <Prev />,
    nextArrow: <Next />,
  };

  return (
    <Index>
      {showCalendar ? (
        <CarouselWrapper>
          <Slider {...SliderSettings} ref={calendarSlider}>
            {calendarDataArray.map((i, index) => (
              <CalendarWrapper key={`CalendarWrapper-${i[0].endUnix}`}>
                {i.map((calendar, calendarIndex) => {
                  const { startUnix, endUnix, text, weekText } = calendar;
                  const isToday = todayStartUnix && todayStartUnix >= startUnix && todayStartUnix <= endUnix;;
                  const isChecked =
                    checkedUnix && checkedUnix >= startUnix && checkedUnix <= endUnix;
                  const isAfter = startUnix > todayStartUnix;
                  const notStartActive = todaySearchUnix < activityStart && index === 0 && calendarIndex === 0; // 特别重要，活动未开始，默认显示的第一天是需要有选中态样式
                  return (
                    <CalendarItem
                      key={`CalendarWrapper-${text}`}
                      className={clsx({ checked: isChecked, today: isToday, afterDay: isAfter, notStartActive: notStartActive  })}
                      onClick={() => onClickDate(calendar)}
                      isChecked={isChecked}
                      isToday={isToday}
                    >
                      <div className="timeBox">
                        <div className="week">{isToday ? 'Today' : weekText}</div>
                        <div className="date">{text}</div>
                      </div>
                    </CalendarItem>
                  );
                })}
              </CalendarWrapper>
            ))}
          </Slider>
        </CarouselWrapper>
      ) : (
        ''
      )}
    </Index>
  );
};

Calendar.propTypes = {};

Calendar.defaultProps = {};

export default Calendar;
