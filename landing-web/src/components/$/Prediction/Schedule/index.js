/**
 * Owner: jesse.shao@kupotech.com
 */
import React, { useMemo, useEffect, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'dva';
import moment from 'moment';
import Slider from 'react-slick';
import { _t } from 'src/utils/lang';

import wsSubscribe from 'hocs/wsSubscribe';
import SlideContent from './SlideContent';
import { useScheduleContext } from '../context';
import { toPercent, numberFixed } from 'helper';
import DOT from 'assets/prediction/dots.svg';
import ACTIVE_DOT from 'assets/prediction/dots-active.svg';
import {
  Index,
  CarouselWrapper,
  MarketInfo,
  SymbolBar,
  RealTimeText,
  ChangeRateText,
  Price,
  ScheduleHeader,
  ScheduleDots,
  ScheduleDotItem,
  NoDataWrapper,
  Font,
} from './StyledComps';
import NoContent from 'assets/global/noContent.svg';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import WrappedSpin from '../WrappedSpin';


const Schedule = wsSubscribe({
  getTopics: Topic => {
    return [[Topic.MARKET_SNAPSHOT, { SYMBOLS: ['ETH-USDT'] }]];
  },
  didUpdate: () => {
    return false;
  },
})(() => {
  const {
    setSearchScheduleId,
    currentRoundIndex,
    searchScheduleId,
    onShowTipDialog,
    scheduleList,
  } = useScheduleContext();
  const scheduleSlider = useRef(null);
  const dispatch = useDispatch();
  const { marketInfo, searchUnix } = useSelector(state => state.prediction);
  const loading = useSelector(state => state.loading.effects['prediction/searchByUnix']);
  const { lastTradedPrice = 0, changeRate = 0 } = marketInfo || {};
  const scheduleInput = document.getElementById('ScheduleInput');
  // 更新交易对数据
  useEffect(
    () => {
      import('@kc/socket').then(ws => {
        const socket = ws.getInstance();
        socket.topicMessage(ws.Topic.MARKET_SNAPSHOT, 'trade.snapshot')(arr => {
          dispatch({
            type: 'prediction/update',
            payload: { marketInfo: arr[0].data.data },
          });
        });
      })
    },
    [dispatch],
  );

  useEffect(
    () => {
      if (scheduleSlider?.current) {
        scheduleSlider.current.slickGoTo(currentRoundIndex);
      }
    },
    [currentRoundIndex, scheduleSlider],
  );
  // 查询数据
  const searchSchedule = useCallback(
    id => {
      // 设置新的查询竞猜Id
      setSearchScheduleId(id);
    },
    [setSearchScheduleId],
  );
  // 走马灯设置
  const SliderSettings = useMemo(
    () => {
      return {
        className: 'customSlider center',
        centerMode: true,
        infinite: true,
        centerPadding: '12px',
        slidesToShow: 1,
        dots: false,
        speed: 1000,
        autoplay: false,
        vertical: false,
        arrows: false,
        beforeChange: (oldIndex, newIndex) => {
          if (oldIndex !== newIndex) {
            // 获取查询的的Id
            const id = scheduleList[newIndex]?.id;
            //PLATFORM-168 此处解决手机端 h5 输入框在输入时切换走马灯的时候 输入光标来回鬼畜的问题
            if (scheduleInput) {
              scheduleInput.blur();
            }
            if (id !== searchScheduleId) {
              // 设置查询Id
              searchSchedule(id);
            }
          }
        },
      };
    },
    [scheduleList, searchSchedule, searchScheduleId, scheduleInput],
  );
  // 进行中卡片倒计时结束后 获取下一个竞猜模块数据
  const onProcessCountDownFinish = useCallback(
    () => {
      const isLast = currentRoundIndex === scheduleList.length - 1;
      if (!isLast) {
        const newId = scheduleList[currentRoundIndex + 1]?.id;
        // 查询新的竞猜数据最新数据
        searchSchedule(newId);
      } else {
        // 如果倒计时结束了就自动到下一天
        const newSearchUnix = moment
          .utc(searchUnix)
          .startOf('day')
          .add(1, 'days')
          .valueOf();
        // 设置新的查询日期
        dispatch({
          type: 'prediction/update',
          payload: {
            searchUnix: newSearchUnix,
            checkedUnix: newSearchUnix,
            todayStartUnix: newSearchUnix,
            currentRoundIndex: 0,
          },
        });
      }
    },
    [scheduleList, currentRoundIndex, searchSchedule, searchUnix, dispatch],
  );
  // 未开始卡片
  const onNotStartCountDownFinish = useCallback(
    () => {
      searchSchedule(searchScheduleId);
    },
    [searchSchedule, searchScheduleId],
  );
  return (
    <Index>
      <ScheduleHeader>
        <MarketInfo>
          <SymbolBar>
            <span className="btc-title">ETH/USDT</span>
            <RealTimeText>{_t('prediction.realTime')}</RealTimeText>
            <ChangeRateText changeRate={changeRate}>{toPercent(changeRate)}</ChangeRateText>
          </SymbolBar>
          <Price changeRate={changeRate}>{numberFixed(lastTradedPrice, 1)}</Price>
        </MarketInfo>
        <ScheduleDots>
          {scheduleList.map((i, index) => (
            <ScheduleDotItem
              key={`ScheduleDots-${i.id}`}
              isActive={index === currentRoundIndex}
              src={index === currentRoundIndex ? ACTIVE_DOT : DOT}
            />
          ))}
        </ScheduleDots>
      </ScheduleHeader>
      <WrappedSpin spinning={!!loading}>
        {scheduleList?.length > 0 ? (
          <CarouselWrapper>
            <Slider {...SliderSettings} ref={scheduleSlider}>
              {scheduleList.map((i, index) => {
                return (
                  <SlideContent
                    onShowTipDialog={onShowTipDialog}
                    key={`slideContent-${i.id}`}
                    onNotStartCountDownFinish={onNotStartCountDownFinish}
                    onProcessCountDownFinish={onProcessCountDownFinish}
                    data={i}
                  />
                );
              })}
            </Slider>
          </CarouselWrapper>
        ) : (
          <NoDataWrapper>
            <img src={NoContent} alt="" />
            <Font>{_t('guardianStar.empty.default')}</Font>
          </NoDataWrapper>
        )}
      </WrappedSpin>
    </Index>
  );
});

Schedule.propTypes = {};

Schedule.defaultProps = {};

export default Schedule;
