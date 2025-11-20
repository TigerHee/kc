/**
 * Owner: jesse.shao@kupotech.com
 */
import React, { memo, useMemo } from 'react';
import { useSelector } from 'dva';
import { get, map } from 'lodash';
import { useIsMobile } from 'components/$/MarketCommon/config';
import { PRIZE_TEXT_CONFIG, PRIZE_CONFIG } from '../config';
import { separateNumber } from 'helper';
import styles from './style.less';

const ProgressBar = memo(({ progressNum = 0 }) => {
  const isMobile = useIsMobile();
  const _num = typeof progressNum === 'number' && !isNaN(progressNum) ? progressNum : 0;

  const _index = useMemo(
    () => {
      if (_num < 0) return 0;
      if (_num > 6) return 6;
      return _num;
    },
    [_num],
  );

  const radiusStr = _index === 6 ? '8px' : '8px 0 0 8px';
  const widthStr = useMemo(
    () => {
      return (PRIZE_CONFIG[_index] || {}).percent;
    },
    [_index],
  );

  return (
    <div inspector="progress_bar" className={styles.progressBarBox}>
      <div className={styles.progressTop}>
        {map(PRIZE_CONFIG, ({ top }, index) => (
          <span key={`progress_top_${index}`}>
            {isMobile ? `${top / 1000}K` : separateNumber(top)}
          </span>
        ))}
      </div>
      <div className={styles.progressBar}>
        <div className={styles.progress} style={{ width: widthStr, borderRadius: radiusStr }} />
      </div>
    </div>
  );
});

const PrizePool = ({ namespace = 'pakistanCampaign' }) => {
  const { config } = useSelector(state => state[namespace]);
  const level = get(config, 'param.level', 0);
  const imgUrl = get(config, 'param.firstUrl', undefined);
  const currentPrize = get(config, 'param.currentPrize');
  const text = PRIZE_TEXT_CONFIG[namespace];

  return (
    <div className={styles.container} inspector="prize_pool">
      <div className={styles.inner}>
        <div className={styles.top}>
          <h2 className={styles.title}>{text.title}</h2>
          <div className={styles.remain}>
            <img className={styles.remainImg} src={text.remainImg} alt="" />
            <p className={styles.remainText}>{text.remain(currentPrize || 0)}</p>
          </div>
        </div>
        <ProgressBar progressNum={level} />
        <div>
          {imgUrl ? <img className={styles.winImg} src={imgUrl} alt="winning-announce" /> : null}
        </div>
      </div>
    </div>
  );
};

export default PrizePool;
