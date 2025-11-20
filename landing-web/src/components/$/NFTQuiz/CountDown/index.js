/**
 * Owner: jesse.shao@kupotech.com
 */
import React, { useMemo } from 'react';
import { useSelector } from 'dva';
import { NFT_QUIZ_STATUS } from 'config';
import { _t } from 'utils/lang';
import TimeCountDownBox from '../TimeCountDownBox';
import {
  View,
  PoolTitle,
  AmountField,
  PoolAmount,
} from './styled';
import style from './style.less';

// 计算2个时间戳之间的秒数
const getRemainTime = (end, start) => {
  if (!end || !start) return 0;
  return Math.floor((end - start) / 1000);
};

const getCountDown = (status, config, total, loading) => {
  const { now, start } = total || {}
  const isExpired = status === NFT_QUIZ_STATUS.EXPIRED;
  const {
    // startTime, // 本期开始时间
    endTime, // 本期结束时间
    prize,
  } = config || {};
  const prezeItem = (prize && prize[0]);
  const { prizeCode, amount } = prezeItem || {}; // 奖池数量及单位
  // loading
  if (loading) {
    return {
      amount: '',
      currency: '',
      remainTime: 0,
      title: '',
      withLangKey: false,
    }
  }
  // 超过整个活动周期
  if (isExpired) {
    return {
      amount: '-',
      currency: '-',
      remainTime: 0,
      title: _t('2utDGQgL55hkHrZ8PMjc35'),
      withLangKey: false,
    };
  }

  if (status === NFT_QUIZ_STATUS.NOT_BEGIN) {
    return {
      amount: '??? ',
      currency: prizeCode,
      remainTime: getRemainTime(start, now),
      title: _t('dSdtfVEPkSnQvKBN6E39an'),
      withLangKey: false,
    };
  }

  const hasConfig = !!prezeItem;
  return {
    amount: hasConfig ? amount : '??? ',
    currency: prizeCode,
    remainTime: getRemainTime(endTime, now),
    title: _t('dSdtfVEPkSnQvKBN6E39an'),
    withLangKey: hasConfig,
  }
}

const CountDown = ({
  config,
  handleCountEnd,
} = {}) => {

  const loading = useSelector(state => {
    return state.loading.effects['nftQuiz/getQuizConfig'];
  });
  const {
    activityStatus,
    config: configList,
  } = config || {};

  const currentCfg = configList && configList[0];
  const {
    amount,
    currency,
    remainTime, // 剩余时间的秒数
    title, // 倒计时秒数
    withLangKey,
  } = useMemo(() => {
    return  getCountDown(activityStatus, currentCfg, config, loading);
  }, [activityStatus, currentCfg, config, loading]);

  return (
    <View>
      <PoolAmount>
        <PoolTitle>{title}</PoolTitle>
        <AmountField>
          {
            withLangKey ? _t('tndyYSBXkeFz1ZqYnBBVLm', {
              NumberAll: amount,
              TokenName: currency,
            }) : (
              <>
                {amount}
                {currency || ''}
              </>
            )
          }
        </AmountField>
      </PoolAmount>
      <TimeCountDownBox
        restSec={remainTime}
        numberBoxClassName={style.countdownBox}
        handleCountEnd={handleCountEnd}
      />
    </View>
  )
};

export default CountDown;