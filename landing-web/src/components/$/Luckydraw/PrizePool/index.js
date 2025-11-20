/**
 * Owner: jesse.shao@kupotech.com
 */
import React, { memo, useMemo } from 'react';
import classname from 'classname';
import { useSelector } from 'dva';
import { map } from 'lodash';
import { useIsMobile } from 'components/$/MarketCommon/config';
import { PRIZE_CONFIG, PRIZE_TEXT_CONFIG, INJECT_FULL_NUM } from '../config';
import styles from './style.less';
import CoinImg from 'assets/luckydraw/coin.png';

const configData = PRIZE_CONFIG.slice(0, 7);
const { title, introText, topValue, bottomValue, phaseText } = PRIZE_TEXT_CONFIG;
const NowCount = memo(({ count = 0 }) => {
  const text = `Now： $${count}`;

  return (
    <div className={styles.nowCount}>
      <img className={styles.coinImg} src={CoinImg} alt="" />
      <h3 className={styles.nowCountNum}>{text}</h3>
    </div>
  );
});

const ProgressBar = memo(({ progressNum = 0 }) => {
  const _num = typeof progressNum === 'number' ? progressNum : 0;
  const isMobile = useIsMobile();

  const _index = useMemo(
    () => {
      if (_num < 0) return 0;
      if (_num > 7) return 7;
      return _num;
    },
    [_num],
  );

  const widthStr = useMemo(
    () => {
      return (PRIZE_CONFIG[_index] || {}).percent;
    },
    [_index],
  );

  return (
    <div className={styles.progress}>
      <div className={styles.progressTop}>
        {map(configData, ({ top }, index) => (
          <span key={index}>{isMobile ? `${top / 1000}K` : top}</span>
        ))}
      </div>
      <div className={styles.progressBarBox}>
        <div className={styles.progressBar} />
        <div className={classname(styles.triangle, styles.triangle1)} />
        <div className={styles.progressColorContainer}>
          <div className={styles.progressColorBox}>
            <div className={styles.progressColor} style={{ width: widthStr }} />
          </div>
          <div
            className={classname(styles.triangle, styles.triangle2, {
              [styles.hide]: _index < 7,
            })}
          />
        </div>
      </div>
      <div className={styles.progressBottom}>
        {map(configData, ({ bottom }, index) => (
          <span key={index}>{`${index > 0 ? '+' : ''}${
            isMobile ? `${bottom / 1000}K` : bottom
          }`}</span>
        ))}
      </div>
    </div>
  );
});

const PrizePool = ({ namespace = 'luckydraw' }) => {
  const isMobile = useIsMobile();
  const { param } = useSelector(state => state[namespace].config);
  const { firstUrl, level, currentPrize } = param;

  return (
    <div className={styles.container} inspector="prize_pool">
      <h2 className={styles.title}>{title}</h2>
      <div className={styles.intro}>
        <p className={styles.introText}>{introText}</p>
        <NowCount count={currentPrize} />
        <p className={classname(styles.phaseText, styles.phaseText1)}>{phaseText}</p>
      </div>
      <div className={styles.diagram}>
        <div className={styles.diagramTop}>{topValue}</div>
        {/* 大于1024最右侧展示数值 */}
        <div className={styles.diagramTopNum}>
          {isMobile ? `${INJECT_FULL_NUM.top / 1000}K` : INJECT_FULL_NUM.top}
        </div>
        <div className={styles.diagramLeft}>
          <div className={styles.diagramLeftTop}>{topValue + ':'}</div>
          <div className={styles.diagramLeftBottom}>{bottomValue + ':'}</div>
        </div>
        <ProgressBar progressNum={level} />
        <div className={classname(styles.phaseText, styles.phaseText2)}>{phaseText}</div>
        <div className={styles.diagramBottom}>{bottomValue}</div>
        {/* 大于1024最右侧展示数值; */}
        <div className={styles.diagramBottomNum}>
          <span>+</span>
          <span>{isMobile ? `${INJECT_FULL_NUM.bottom / 1000}K` : INJECT_FULL_NUM.bottom}</span>
        </div>
      </div>
      <div>{firstUrl ? <img className={styles.img} src={firstUrl} alt="prize-img" /> : null}</div>
    </div>
  );
};

export default PrizePool;
