/**
 * Owner: jesse.shao@kupotech.com
 */
import React, { useMemo } from 'react';
import { useSelector } from 'dva';
import { get, map } from 'lodash';
import classnames from 'classnames';
import { PRIZE_TEXT_CONFIG, COIN_CONFIG } from '../config';
import styles from './style.less';
import prizePoolImg from 'assets/luckydrawSepa/prize-pool.svg';
import prizeBoxImg from 'assets/luckydrawSepa/prize-box.svg';

const PrizePool = ({ namespace = 'luckydrawSepa' }) => {
  const { config } = useSelector(state => state[namespace]);
  const currentPrize = get(config, 'param.currentPrize', 0);
  const prizePool = get(config, 'param.prizePool', {});
  const imgUrl = get(config, 'param.firstUrl', undefined);
  const text = PRIZE_TEXT_CONFIG[namespace];
  const coinArray = useMemo(
    () => {
      const result = [];
      for (let obj in prizePool) {
        const coinStr = prizePool[obj] || '';
        const coinArr = coinStr.split(',');
        const coinNum = coinArr[0] || '';
        const coinName = coinArr[1] || '';
        result.push({ coin: coinName, value: coinNum > 1000 ? `${coinNum / 1000}K` : coinNum });
      }
      return result;
    },
    [prizePool],
  );

  return (
    <div className={styles.container}>
      <div className={styles.inner}>
        <div className={styles.top}>
          <div>
            {currentPrize ? (
              <div className={styles.remain}>
                <img className={styles.remainImg} src={text.remainImg} alt="" />$
                <span>{currentPrize}</span>
              </div>
            ) : null}
          </div>
          <h2 className={styles.title}>{text.title}</h2>
        </div>
        <div className={styles.prizeBox} inspector="prize_box">
          <div className={styles.coinWall}>
            {map(coinArray, (item, index) => {
              return index < 10 ? (
                <div
                  className={classnames(styles.coinBox, styles[COIN_CONFIG[index].class])}
                  key={`${item.coin}_${index}`}
                  style={{
                    top: COIN_CONFIG[index].top,
                    left: COIN_CONFIG[index].left,
                    width: COIN_CONFIG[index].width,
                    paddingBottom: COIN_CONFIG[index].width,
                  }}
                >
                  <div className={styles.coinText}>
                    <span className={styles.coinNum}>{item.value}</span>
                    <span className={styles.coinName}>{item.coin}</span>
                  </div>
                </div>
              ) : null;
            })}
          </div>
          <img
            inspector="prizePoolImg"
            className={classnames(styles.prizeImg, styles.imgIndex)}
            src={prizePoolImg}
            alt="prize-pool"
          />
          <img inspector="prizeBoxImg" className={styles.prizeImg} src={prizeBoxImg} alt="" />
        </div>
        <div>
          {imgUrl ? (
            <a inspector="img_link" href={text.imgLink} target="_blank" rel="noopener noreferrer">
              <img inspector="win_img" className={styles.winImg} src={imgUrl} alt="" />
            </a>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default PrizePool;
