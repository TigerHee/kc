/**
 * Owner: odan.ou@kupotech.com
 */
import React, { memo, Fragment, useMemo, useEffect, useRef, useCallback } from 'react';
import { useDispatch } from 'dva';
import sentry from '@kc/sentry';
import { styled } from '@/style/emotion';
import { eTheme, eConditionStyle } from '@/utils/theme';
import useCountDown from '@/hooks/useCountDown';
import useOrderState from 'src/trade4.0/pages/OrderForm/hooks/useOrderState';
import { getHMTime, getDiffTime } from '@/utils/date';
import { _t } from 'utils/lang';
import Overview from './Overview';
import Info from './Info';
import Step from './Step';

const TipDiv = styled.div`
  font-weight: 400;
  font-size: 12px;
  margin-top: 16px;
  margin-left: 12px;
  ${eConditionStyle(true, 'vertical')`
    margin-left: 0;
  `}
  padding-bottom: 24px;
  color: ${eTheme('text40')};
`;

/**
 * 集合竞价页面
 * @param {{
 *  currentSymbol: string,
 *  symbolInfo: Record<string, any>,
 *  auctionData: Record<string, any>,
 *  auctionConf: Record<string, any>,
 *  screen: string,
 *  vertical: boolean,
 * }} props
 */
const AuctionPage = (props) => {
  const { currentSymbol, auctionConf, auctionData, screen, vertical } = props;
  const dispatch = useDispatch();
  const params = {
    screen,
    auctionConf,
    currentSymbol,
    vertical,
  };
  const { disabledOrder } = useOrderState();

  let {
    remainingTimeFromFirstStageStart: time0 = 0,
    remainingTimeFromFirstStageEnd: time1 = 0,
    remainingTimeFromSecondStageEnd: time2 = 0,
    remainingTimeFromThirdStageEnd: time3 = 0,
  } = auctionConf;

  // 最小值为 0
  time0 = Math.max(time0, 0);
  time1 = Math.max(time1, 0);
  time2 = Math.max(time2, 0);
  time3 = Math.max(time3, 0);

  const [list, totalTime1, totalTime2, totalTime3] = useMemo(() => {
    const { firstStageStartTime, secondStageStartTime, secondStageEndTime, thirdStageEndTime } =
      auctionConf;
    const [phaseOneH, phaseOneM] = getHMTime(firstStageStartTime);
    const [phaseTwoH, phaseTwoM] = getHMTime(secondStageStartTime);
    const [phaseThreeH, phaseThreeM] = getHMTime(secondStageEndTime);
    const [phaseEndH, phaseEndM] = getHMTime(thirdStageEndTime);
    // 垂直进度条的文字中的时间范围
    const getRangeTime = (start, end) => {
      const strStart = _t('tra.ca.milestone.time', {
        h: start.h,
        m: start.m,
        unit: ' - ',
      });
      const strEnd = _t('tra.ca.milestone.time', {
        h: end.h,
        m: end.m,
        unit: ' UTC',
      });
      return `${strStart}${strEnd}`;
    };
    const dataList = [
      {
        title: _t('trd.ca.phase1'),
        remainTime: time1,
        text: _t('tra.ca.milestone.time.start', { h: phaseOneH, m: phaseOneM }),
        // tipText: _t('trd.ca.phase1.oper.title'), // 垂直进度条有用, 使用features
        features: [
          {
            label: _t('trd.ca.order.buy'),
          },
          {
            label: _t('trd.ca.order.cancel'),
          },
        ],
        progressTimeTitle: _t('trd.ca.phase1.progress.time', {
          time: getRangeTime({ h: phaseOneH, m: phaseOneM }, { h: phaseTwoH, m: phaseTwoM }),
        }),
        progressTitle: _t('trd.ca.phase1.progress.time', { time: '' }),
      },
      {
        title: _t('trd.ca.phase2'),
        remainTime: time2,
        text: _t('tra.ca.milestone.time', {
          h: phaseTwoH,
          m: phaseTwoM,
          unit: '',
        }),
        // tipText: _t('trd.ca.phase2.oper.title'),
        endText: _t('tra.ca.milestone.openTime', {
          h: phaseThreeH,
          m: phaseThreeM,
        }),
        features: [
          {
            label: _t('trd.ca.order.buy'),
          },
          {
            label: _t('trd.ca.order.cancel.disabled'),
            disabled: true,
          },
        ],
        progressTimeTitle: _t('trd.ca.phase2.progress.time', {
          time: getRangeTime({ h: phaseTwoH, m: phaseTwoM }, { h: phaseThreeH, m: phaseThreeM }),
        }),
        progressTitle: _t('trd.ca.phase2.progress.time', { time: '' }),
      },
      {
        title: _t('cARXHrELKwxRBLtdr8knbV'),
        remainTime: time3,
        text: _t('tra.ca.milestone.time', {
          h: phaseThreeH,
          m: phaseThreeM,
          unit: '',
        }),
        // tipText: _t('trd.ca.phase2.oper.title'),
        showEnd: true,
        endText: _t('tra.ca.milestone.openTime', {
          h: phaseEndH,
          m: phaseEndM,
        }),
        features: [
          {
            label: _t('trd.ca.order.buy'),
            disabled: true,
          },
          {
            label: _t('trd.ca.order.cancel.disabled'),
            disabled: true,
          },
        ],
        progressTimeTitle: _t('bsWZiotbRG9b1n7eiaQf3n', {
          time: getRangeTime({ h: phaseThreeH, m: phaseThreeM }, { h: phaseEndH, m: phaseEndM }),
        }),
        progressTitle: _t('bsWZiotbRG9b1n7eiaQf3n', { time: '' }),
      },
    ];
    // 获取三个阶段的总时间
    const total1 = getDiffTime(firstStageStartTime, secondStageStartTime);
    // const total2 = getDiffTime(secondStageStartTime, secondStageEndTime);
    const total2 = getDiffTime(secondStageStartTime, secondStageEndTime);
    const total3 = getDiffTime(secondStageEndTime, thirdStageEndTime);
    return [dataList, total1, total2, total3];
  }, [auctionConf, time1, time2, time3]);

  // 获取集合竞价倒计时信息
  const getCountDownInfo = useCallback(() => {
    dispatch({
      type: 'callAuction/getAuctionConf',
      payload: {
        coinPair: currentSymbol,
      },
    });
  }, [currentSymbol]);

  // 获取币对信息
  const getSymbolsInfo = useCallback(() => {
    return dispatch({ type: 'symbols/pullSymbols' });
  }, [dispatch]);

  // 更新所有信息
  const updateAllCountDownInfo = useCallback(() => {
    getSymbolsInfo();
    getCountDownInfo();
  }, [getSymbolsInfo, getCountDownInfo]);
  const hasData = Object.keys(auctionConf || {}).length !== 0;
  // 等待开始
  const { isEnd } = useCountDown(time0, {
    onRest: updateAllCountDownInfo,
    isEnd: hasData && time0 <= 0,
  });

  // getSymbolsInfo 接口有缓存，当倒计时阶段完成后立刻请求getSymbolsInfo，会导致isEnableAuctionTrade字段还没更新，下单按钮不能 enable，所以这里兜底请求三次
  useEffect(() => {
    let count = 1;
    let timer = null;
    if (isEnd && disabledOrder) {
      timer = setInterval(() => {
        getSymbolsInfo();
        if (count >= 3) {
          clearInterval(timer);
        }
        count += 1;
      }, 2 * 1000);
    }
    return () => {
      clearInterval(timer);
    };
  }, [isEnd, disabledOrder]);

  // 第一阶段
  const countDown1 = useCountDown(isEnd ? time1 - time0 : 0, {
    onRest: getCountDownInfo,
    totalTime: totalTime1,
    isEnd: hasData && time1 <= 0,
  });

  // 第二阶段
  const countDown2 = useCountDown(countDown1.isEnd ? time2 - time1 : 0, {
    onRest: getCountDownInfo,
    // onFinish: getSymbolsInfo,
    totalTime: totalTime2,
    isEnd: hasData && time2 <= 0,
  });

  // 第三阶段
  const countDown3 = useCountDown(countDown2.isEnd ? time3 - time2 : 0, {
    onRest: getCountDownInfo,
    onFinish: getSymbolsInfo,
    totalTime: totalTime3,
    isEnd: hasData && time3 <= 0,
  });

  const [countDownList, activeCountDown, activeTitle] = useMemo(() => {
    const res = [countDown1, countDown2, countDown3];
    const index = Math.max(
      res.findIndex((item) => item.isActive),
      0,
    );
    const title = list[index]?.progressTitle || '';
    return [res, res[index], title];
  }, [countDown1, countDown2, countDown3, list]);

  const listNew = useMemo(() => {
    return list.map((item, i) => ({
      ...item,
      countDownInfo: countDownList[i],
    }));
  }, [list, countDownList]);

  const { isEnd: isFinish } = countDown3;
  const onFinishRef = useRef(getSymbolsInfo);
  onFinishRef.current = getSymbolsInfo;

  // 集合竞价结束后，循环调用，避免因为缓存导致的无法结束集合竞价
  useEffect(() => {
    let count = 0;
    let timer = null;
    if (isFinish) {
      timer = setInterval(() => {
        count += 1;
        onFinishRef.current();
        if (count >= 4) {
          try {
            sentry.captureEvent({
              message: '集合竞价结束数据更新: 重连3次未结束',
              level: 'fatal',
              tags: {
                fatal_type: 'error',
              },
            });
          } catch (err) {
            console.error(err);
          }
          clearInterval(timer);
        }
      }, 3 * 1000);
    }
    return () => {
      clearInterval(timer);
    };
  }, [isFinish]);

  return (
    <Fragment>
      <Overview
        {...params}
        currentSymbol={currentSymbol}
        countDownInfo={activeCountDown}
        activeTitle={activeTitle}
      />
      <Info {...params} auctionData={auctionData} />
      <Step {...params} list={listNew} />
      <TipDiv vertical={vertical}>{_t('tra.ca.all.time')}</TipDiv>
    </Fragment>
  );
};

export default memo(AuctionPage);
