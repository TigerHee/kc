/**
 * Owner: jesse.shao@kupotech.com
 */
import React, { useCallback, useEffect, Fragment, useLayoutEffect } from 'react';
import { useDispatch, useSelector } from 'dva';
import loadable from '@loadable/component';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import { styled } from '@kufox/mui/emotion';
import { px2rem } from '@kufox/mui/utils';
import { sensors } from 'utils/sensors';

import { DIALOG_TYPE_BLOCK_ID } from '../config';

import Calendar from 'components/$/Prediction/Calendar';
import Banner from 'components/$/Prediction/Banner';
import MyNumber from 'components/$/Prediction/MyNumber';
import TradeDialog from 'components/$/Prediction/TradeDialog';
import BANNER_BG from 'assets/prediction/banner-bg.png';

import { ScheduleContext } from '../context';

const Schedule = loadable(() => import('components/$/Prediction/Schedule'));

// --- 样式 start ---
const HomePage = styled.div`
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  background: url(${BANNER_BG}) no-repeat;
  background-size: 100% auto;
  ::before {
    content: '';
    display: block;
  }

`;

const ContentWrapper = styled.div`
  padding-top: ${px2rem(12)};
  background: #ffffff;
  border-top: 1px solid #00142a;
  border-radius: 24px 24px 0px 0px;
  flex: auto;
`;
// --- 样式 end---

const Home = ({ btnClickCheck }) => {
  const dispatch = useDispatch();
  const { isLogin } = useSelector(state => state.user);
  const {
    searchUnix, // 查询时间戳
    currentRound, // 当前场次数据
    activityConfig = {}, // 活动配置
    showTradeDialog, // 是否展示交易跳转弹窗
    currentRoundIndex, // 当前场次Index
    searchScheduleId, // 查询的竞猜Id
    scheduleList, // 竞猜模块数据列表
  } = useSelector(state => state.prediction);
  const { isSign } = useSelector(state => state.kcCommon);
  const { notStart: activityNotStart, isEnd: activityIsEnd } = activityConfig; // 活动的整体开始时间 和 结束时间
  const {
    notStart: currentRoundNotStart,
    isEnd: currentRoundIsEnd,
    inProcessing: currentRoundInProcessing,
  } = currentRound; // 本轮竞猜数据

  // 轮询注册
  useLayoutEffect(
    () => {
      dispatch({
        type: 'prediction/watchPolling',
        payload: {
          effect: 'pullMarketInfo',
          interval: 5000,
        },
      });
    },
    [dispatch]
  );
  // 搜索日期修改后
  useEffect(
    () => {
      if (searchUnix) {
        dispatch({
          type: 'prediction/searchByUnix',
          payload: {
            searchUnix,
          },
        });
      }
    },
    [searchUnix, dispatch],
  );


  // 更新场次信息
  useEffect(
    () => {
      if (searchScheduleId) {
        dispatch({
          type: 'prediction/getDataByScheduleId',
          payload: { id: searchScheduleId },
          callback: res => {
            if (res.success && isLogin) {
              const { now, id, start, lottery } = res.data;
              const notStart = now < start;
              dispatch({
                type: 'prediction/pullUserGuessList',
                payload: { id, isEnd: lottery, notStart },
              });
            }
          },
        });
      }
      return () => {};
    },
    [searchScheduleId, isLogin, dispatch],
  );

  // 显示展示型弹窗
  const onShowTipDialog = useCallback(
    type => {
      let blockId = DIALOG_TYPE_BLOCK_ID[type];
      // 埋点
      !isEmpty(blockId) && sensors.trackClick([blockId, '1']);
      dispatch({
        type: 'prediction/update',
        payload: {
          showTipDialog: true,
          dialogType: type,
        },
      });
    },
    [dispatch],
  );

  // 设置竞猜主体模块查询Id
  const setSearchScheduleId = useCallback(
    id => {
      dispatch({
        type: 'prediction/update',
        payload: {
          searchScheduleId: id,
        },
      });
    },
    [dispatch],
  );
  const value = {
    isSign,
    currentRoundIsEnd,
    currentRoundNotStart,
    currentRoundInProcessing,
    activityNotStart,
    activityIsEnd,
    currentRound,
    btnClickCheck,
    currentRoundIndex,
    setSearchScheduleId,
    scheduleList,
    searchScheduleId,
    onShowTipDialog,
  };

  return (
    <ScheduleContext.Provider value={value}>
      <HomePage>
        <Banner btnClickCheck={btnClickCheck} />
        <ContentWrapper>
          <Calendar />
          <Schedule />
          <MyNumber onShowTipDialog={onShowTipDialog} />
          <Fragment>{showTradeDialog ? <TradeDialog /> : ''}</Fragment>
        </ContentWrapper>
      </HomePage>
    </ScheduleContext.Provider>
  );
};

Home.propTypes = {
  btnClickCheck: PropTypes.func.isRequired, // 点击前置验证
};

Home.defaultProps = {
  btnClickCheck: () => {},
};

export default Home;
