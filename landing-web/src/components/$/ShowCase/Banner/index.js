/**
 * Owner: jesse.shao@kupotech.com
 */
import { useEffect, useState, useMemo, forwardRef } from 'react';
import { useSelector, useDispatch } from 'dva';
import { interval } from 'rxjs';
import { map } from 'rxjs/operators';
import cls from 'clsx';
import { getLastedTime } from 'helper';
import moment from 'moment';
import ChoiceImg from 'assets/showcase/Banner/choice.svg';
import { SHOWCASE_STATUS, BEGIN_STATUS } from 'config';
import { _t } from 'utils/lang';
import { useIsMobile } from 'components/Responsive';
import styles from './styles.less';

moment.locale(window._DEFAULT_LOCALE_);

// 活动状态对应time label beginStatus
const TIME_LABEL_MAP = {
  1: () => _t('choice.vote.time.start.remain'),
  2: () => _t('choice.vote.time.start.remain'),
  3: () => _t('choice.vote.time.start.remain'),
  4: () => _t('choice.vote.time.end.remain'),
  0: () => _t('choice.vote.end'),
};

// 2020.05.27 08:00AM
const formatTime = (time) => moment(time).format('YYYY.MM.DD HH:mm A');

const Banner = forwardRef((props, ref) => {
  const [date, setDate] = useState({ day: 0, hour: 0, min: 0, sec: 0  });
  const publishDetail = useSelector(state => state.showcase.publishDetail);
  const isInApp = useSelector(state => state.app.isInApp);
  const dispatch = useDispatch();
  const isEnd = publishDetail.status === SHOWCASE_STATUS.END;
  const isMobile = useIsMobile();
  const currentLang = useSelector(state => state.app.currentLang);

  useEffect(() => {
    if (!publishDetail.id || publishDetail.status === SHOWCASE_STATUS.END) return;
    let timeField = 'voteStartAt';
    if (publishDetail.beginStatus === BEGIN_STATUS.VOTING) {
      timeField = 'voteEndAt';
    }
    const statusTime = publishDetail[timeField];
    const $timer = interval(1000).pipe(
      map(x => getLastedTime(statusTime)),
    );
    const subscriber = $timer.subscribe(x => {
      if (!x) {
        subscriber && subscriber.unsubscribe();
        dispatch({ type: 'showcase/init' });
        return;
      }
      setDate(x)
    });
  }, [dispatch, publishDetail]);

  const timeLabel = useMemo(() => {
    if (!publishDetail.id || publishDetail.status === SHOWCASE_STATUS.END) {
      return TIME_LABEL_MAP[0]();
    }
    return TIME_LABEL_MAP[publishDetail.beginStatus]();
  }, [publishDetail, currentLang]); // eslint-disable-line

  const voteTimes = useMemo(() => {
    if (!publishDetail.voteStartAt) return;
    return { start: formatTime(publishDetail.voteStartAt), end:  formatTime(publishDetail.voteEndAt)};
  }, [publishDetail.voteEndAt, publishDetail.voteStartAt]);

  return (
    <div className={cls(styles.wrapper, {[styles.appWrapper]: isInApp})} ref={ref}>
      <div className={styles.content}>
        <div className={styles.bg} />
        <div className={styles.titleImg}><img src={ChoiceImg} alt='showcase' className={styles.titleEn} /></div>
        <div className={styles.title}>{_t('choice.banner.title')}</div>
        <div className={styles.des}>{_t('choice.banner.title.des')}</div>
        <div className={styles.timeLabel}>{timeLabel}</div>
        {isEnd && !isMobile && <div className={styles.timeEnd}>({_t('choice.vote.time')}{voteTimes.start} ~ {voteTimes.end})</div>}
        <div className={cls(styles.timebox, {[styles.end]: isEnd})}>
          <div className={styles.timeItem}>
            <span className={styles.time}>{date.day}</span>
            <span className={styles.timeDes}>{_t('choice.banner.time.day')}</span>
          </div>
          <div className={styles.timeItem}>
            <span className={styles.time}>{date.hour}</span>
            <span className={styles.timeDes}>{_t('choice.banner.time.hour')}</span>
          </div>
          <div className={styles.timeItem}>
            <span className={styles.time}>{date.min}</span>
            <span className={styles.timeDes}>{_t('choice.banner.time.min')}</span>
          </div>
          <div className={styles.timeItem}>
            <span className={styles.time}>{date.sec}</span>
            <span className={styles.timeDes}>{_t('choice.banner.time.sec')}</span>
          </div>
        </div>
      </div>
    </div>
  );
})

export default Banner;
