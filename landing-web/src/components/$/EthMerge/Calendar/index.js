/**
 * Owner: jesse.shao@kupotech.com
 */
import React, { useMemo } from 'react';
import { useSelector } from 'dva';
import CountDown from 'components/TimeOut';
import { CalendarItem, CalendarWrapper, Index } from './StyledComps';
import { _t } from 'src/utils/lang';
import './index.less';

const getPluralFormText = (num, text) => {
  return num > 1 ? `${text}s` : text;
};

const CustomCountDown = ({ time }) => {
  const { d, h, m, s } = time;
  const { currentLang } = useSelector(state => state.app);
  const isEn = ['en_US'].includes(currentLang);
  return (
    <CalendarWrapper>
      <CalendarItem>
        <span>{d}</span>
        <span>{isEn ? getPluralFormText(d, 'Day') : _t('pTkcrA85gNKFEyHD1Fdfpg')}</span>
      </CalendarItem>
      <CalendarItem>
        <span>{h}</span>
        <span>{isEn ? getPluralFormText(h, 'Hour') : _t('2KfXHkYNm2ZsRmCHh2t1rE')}</span>
      </CalendarItem>
      <CalendarItem>
        <span>{m}</span>
        <span>{isEn ? getPluralFormText(m, 'Minute') : _t('oAh3u2ijE9x92QtCtmiUDK')}</span>
      </CalendarItem>
      <CalendarItem>
        <span>{s}</span>
        <span>{isEn ? getPluralFormText(s, 'Second') : _t('7kVReCyoaVxaF2NeLePTvp')}</span>
      </CalendarItem>
    </CalendarWrapper>
  );
};

const Calendar = () => {
  // 默认合并时间 1663516800000 September 18th, 2022 (UTC)
  const { now = Date.now(), mergeTime = 1663516800000 } = useSelector(
    state => state.ethMerge.activityConfig,
  );
  const countTime = useMemo(
    () => {
      return mergeTime - now;
    },
    [now, mergeTime],
  );

  return (
    <Index>
      <CountDown time={countTime}>
        <CustomCountDown />
      </CountDown>
    </Index>
  );
};

Calendar.propTypes = {};

Calendar.defaultProps = {};

export default Calendar;
