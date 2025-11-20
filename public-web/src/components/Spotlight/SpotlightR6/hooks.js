/**
 * Owner: jessie@kupotech.com
 */
import JsBridge from '@knb/native-bridge';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { shallowEqual, useDispatch } from 'react-redux';
import { useSelector } from 'src/hooks/useSelector';
import siteCfg from 'src/utils/siteConfig';
import { addLangToPath, _t } from 'tools/i18n';
import {
  ACTIVITY_NOT_STARTED,
  END_ACTIVITY_STATUS,
  END_RESERVATION_STATUS,
  LOTTERY_STATUS,
  RESERVATION_NOT_STARTED,
  RESULT_ANNOUNCED_STATUS,
  REWARD_EXPECT_STATUS,
  START_RESERVATION_STATUS,
  TIME_STATUS_ARR,
} from './constant';

const { KUCOIN_HOST } = siteCfg;

let intr = null;
// 活动进度
export const useActivityProcessingStatus = () => {
  const dispatch = useDispatch();
  const {
    startAt,
    endAt,
    startReservationTime,
    endReservationTime,
    rewardExpectAt,
    lotteryTime,
    resultAnnouncedAt,
  } = useSelector((state) => state.spotlight.detailInfo, shallowEqual);

  const [processingStatus, setProcessingStatus] = useState(ACTIVITY_NOT_STARTED);

  // 開始報名  2023-04-15 00:00:01 (UTC)

  // 預約結束 2023-04-22 16:00:01 (UTC)

  // 計算及核對結果展示 2023-04-23 13:00:00 (UTC)

  // 中奖结果公布 2023-04-23 13:00:00 (UTC)

  // 扣發執行中 2023-04-23 13:00:00 (UTC)

  const getProcessingStatus = useCallback(() => {
    let status = ACTIVITY_NOT_STARTED; // 活动未开始
    const time = new Date().getTime();
    if (time < startAt) {
      // 活动未开始
      status = ACTIVITY_NOT_STARTED;
    } else if (time < startReservationTime) {
      // 预约未开始
      status = RESERVATION_NOT_STARTED;
    } else if (time < endReservationTime) {
      // 正在预约，可报名
      status = START_RESERVATION_STATUS;
    } else if (time < rewardExpectAt) {
      // 预约结束，等待公布
      status = END_RESERVATION_STATUS;
    } else if (time < resultAnnouncedAt) {
      // 已公布签数未开奖
      status = REWARD_EXPECT_STATUS;
    } else if (time < lotteryTime) {
      // 已中奖结果公布
      status = RESULT_ANNOUNCED_STATUS;
    } else if (time < endAt) {
      // 已扣发但未活动结束
      status = LOTTERY_STATUS;
    } else if (time > endAt) {
      //  已结束活动
      status = END_ACTIVITY_STATUS;
    }
    dispatch({
      type: 'spotlight/changeProcessStatus',
      payload: {
        status,
      },
    });
    return status;
  }, [
    startAt,
    endAt,
    startReservationTime,
    endReservationTime,
    rewardExpectAt,
    lotteryTime,
    resultAnnouncedAt,
    dispatch,
  ]);

  useEffect(() => {
    if (!intr) {
      intr = setInterval(() => {
        setProcessingStatus(getProcessingStatus());
      }, 1000);
    }

    return () => {
      if (intr) {
        clearInterval(intr);
        intr = null;
      }
    };
  }, [getProcessingStatus]);

  return processingStatus;
};

// kyc逻辑
export const useKyc = () => {
  const isInApp = JsBridge.isApp();

  // kyc
  const handleKyc = useCallback(() => {
    if (isInApp) {
      JsBridge.open({
        type: 'jump',
        params: {
          url: '/user/kyc',
        },
      });
      return;
    }
    window.location.href = addLangToPath(`${KUCOIN_HOST}/account/kyc`);
  }, [isInApp]);
  return { handleKyc };
};

// 去充币
export const useDeposit = () => {
  const isInApp = JsBridge.isApp();
  // 充币
  const handleDeposit = useCallback(() => {
    if (isInApp) {
      JsBridge.open({
        type: 'jump',
        params: {
          url: '/account/deposit',
          // coin: 'USDT',
        },
      });
      return;
    }
    window.location.href = addLangToPath(`${KUCOIN_HOST}/assets/coin`);
  }, [isInApp]);
  return { handleDeposit };
};

// 步骤进度条相关
export const useProcessBar = () => {
  const {
    startReservationTime,
    endReservationTime,
    rewardExpectAt,
    lotteryTime,
    resultAnnouncedAt,
  } = useSelector((state) => state.spotlight.detailInfo, shallowEqual);
  const processingStatus = useSelector((state) => state.spotlight.processingStatus);
  const processArr = useMemo(() => {
    return [
      {
        title: _t('2x1gD1J4W46QH23HQmmifA'),
        content: startReservationTime,
        status: START_RESERVATION_STATUS,
      },
      {
        title: _t('dAjmd4o3JRrSUahLkW2FQn'),
        content: endReservationTime,
        status: END_RESERVATION_STATUS,
      },
      {
        title: _t('cQSHRo7bDiXkp9PHFz1RDz'),
        content: rewardExpectAt,
        status: REWARD_EXPECT_STATUS,
      },
      {
        title: _t('kMpzjios2bfR9ZNPL8MYLH'),
        content: resultAnnouncedAt,
        status: RESULT_ANNOUNCED_STATUS,
      },
      { title: _t('nnayxRSDXsigBMKQie56QH'), content: lotteryTime, status: LOTTERY_STATUS },
    ];
  }, [startReservationTime, endReservationTime, rewardExpectAt, lotteryTime, resultAnnouncedAt]);
  let currentProcess = -1;
  // 当前process处在所有时间点中的index
  const index = TIME_STATUS_ARR.findIndex((status) => status === processingStatus);
  const firstProcessIndex = TIME_STATUS_ARR.findIndex((status) => status === processArr[0].status);
  const currentIndex = index - firstProcessIndex;
  if (currentIndex >= 0) {
    currentProcess = Math.min(currentIndex, processArr.length - 1) + 1;
  }
  return [processArr, currentProcess];
};
// 步骤相关方法、比较等
export const useProcesss = () => {
  const processingStatus = useSelector((state) => state.spotlight.processingStatus);
  const processIndex = useMemo(
    () => TIME_STATUS_ARR.findIndex((status) => status === processingStatus),
    [processingStatus],
  );
  const isSameOrBefore = useCallback(
    (anotherStatus) => {
      const anotherIndex = TIME_STATUS_ARR.findIndex((status) => status === anotherStatus);
      return processIndex <= anotherIndex;
    },
    [processIndex],
  );
  const isSameOrAfter = useCallback(
    (anotherStatus) => {
      const anotherIndex = TIME_STATUS_ARR.findIndex((status) => status === anotherStatus);
      return processIndex >= anotherIndex;
    },
    [processIndex],
  );
  const isAfter = useCallback(
    (anotherStatus) => {
      const anotherIndex = TIME_STATUS_ARR.findIndex((status) => status === anotherStatus);
      return processIndex > anotherIndex;
    },
    [processIndex],
  );
  const isBefore = useCallback(
    (anotherStatus) => {
      const anotherIndex = TIME_STATUS_ARR.findIndex((status) => status === anotherStatus);
      return processIndex < anotherIndex;
    },
    [processIndex],
  );
  const isSame = useCallback(
    (anotherStatus) => {
      const anotherIndex = TIME_STATUS_ARR.findIndex((status) => status === anotherStatus);
      return processIndex === anotherIndex;
    },
    [processIndex],
  );
  return {
    isSameOrBefore,
    isSameOrAfter,
    isAfter,
    isBefore,
    isSame,
  };
};
// 预约人数的拉取逻辑
export const useRegistrationCount = () => {
  // 是在轮训请求预约人数
  const [isPollingRegistration, setIsPollingRegistration] = useState(false);
  // 是否预约人数不会发生变化了
  const [isRegistrationFreeze, setIsRegistrationFreeze] = useState(false);
  const dispatch = useDispatch();
  const processingStatus = useSelector((state) => state.spotlight.processingStatus);
  const { isSameOrAfter } = useProcesss();
  const [timer, setTimer] = useState(null);
  const cancelPoll = useCallback(() => {
    dispatch({
      type: 'spotlight/getActivityRegistrationCount@polling:cancel',
    });
  }, [dispatch]);

  useEffect(() => {
    return cancelPoll;
  }, [cancelPoll]);

  useEffect(() => {
    return () => {
      timer && clearTimeout(timer);
    };
  }, [timer]);

  useEffect(() => {
    if (isRegistrationFreeze) return;
    if (processingStatus === START_RESERVATION_STATUS && !isPollingRegistration) {
      dispatch({
        type: 'spotlight/getActivityRegistrationCount@polling',
      });
      setIsPollingRegistration(true);
    } else if (isSameOrAfter(END_RESERVATION_STATUS) && !isPollingRegistration) {
      dispatch({
        type: 'spotlight/getActivityRegistrationCount',
      });
      setIsRegistrationFreeze(true);
    } else if (processingStatus === END_RESERVATION_STATUS) {
      // 当状态变成预约结束后需要再等3min + 30s（后端数据更新频率）-1ms再去取消轮训
      setTimer(() =>
        setTimeout(() => {
          cancelPoll();
          setIsRegistrationFreeze(true);
        }, (3 * 60 + 30) * 1000 - 1),
      );
    }
  }, [
    dispatch,
    processingStatus,
    isRegistrationFreeze,
    isPollingRegistration,
    isSameOrAfter,
    cancelPoll,
  ]);
};
