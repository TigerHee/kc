/**
 * Owner: jesse.shao@kupotech.com
 */
import React, { useCallback } from 'react';
import clxs from 'classnames';
import { formatNumber } from 'helper';
import PropTypes from 'prop-types';
import gift from 'assets/apiKing/gift.svg';
import finished from 'assets/apiKing/selected.svg';
import styles from './styles.less';

// 进度条
const ProgressBar = ({ percent = 0, bgColor = '#2DBD96' }) => {
  if (percent < 0 || percent > 100) {
    return null;
  }
  return (
    <div className={styles.progressBar}>
      <div
        className={styles.progressBarBg}
        style={{ '--percent': percent, '--bgColor': bgColor }}
      />
    </div>
  );
};
// 一个进度条带一个目标礼物节点
const PrizeItem = props => {
  const { data = {}, currentAmount, prizeList, level, onClick, barBg, barLight } = props;
  //thresholdMin 当前级最小门槛
  const { thresholdMin = 0 } = data;
  // 上一级的最小门槛
  let lastThresholdMin = 0;
  if (level >= 2) {
    lastThresholdMin = prizeList[level - 2].thresholdMin;
  }

  const activeDot = currentAmount > lastThresholdMin; // dot高亮， 交易量大于0
  const isFinished = currentAmount >= thresholdMin; // 当前数额>当前等级门槛
  const isSmall = prizeList.length > 2 && level === 1; // 是多级的第一个
  const isLast = prizeList.length === level; // 是最后一个礼包

  // 获取进度条的百分比
  const getPercent = useCallback(() => {
    let percent = 0;
    if (currentAmount >= thresholdMin) {
      percent = 1;
    } else if (currentAmount < thresholdMin && currentAmount >= lastThresholdMin) {
      percent = (currentAmount - lastThresholdMin) / (thresholdMin - lastThresholdMin);
    }
    return percent * 100;
  }, [currentAmount, lastThresholdMin, thresholdMin]);

  return (
    <div
      className={clxs(styles.progressItem, {
        [styles.progressItemSmall]: isSmall,
      })}
    >
      <>
        {level === 1 && (
          <div
            className={styles.progressDot}
            style={{ background: activeDot ? barLight : barBg }}
          />
        )}
      </>

      <ProgressBar percent={getPercent()} barBg={barBg} barLight={barLight} />

      <div className={styles.progressPrize} onClick={() => onClick(data)}>
        <>
          {isFinished && (
            <div className={styles.finishedBg}>
              <img src={finished} alt="finished" />
            </div>
          )}
        </>
        <div className={styles.unfinishedBg} style={{ position: 'relative' }}>
          <img src={gift} alt="prize" />
          <span className={styles.progressAmount} style={{ right: isLast ? 0 : undefined }}>
            {`${formatNumber(thresholdMin)} USDT`}
          </span>
        </div>
      </div>
    </div>
  );
};
PrizeItem.propTypes = {
  data: PropTypes.object, // 当前的进度数据
  currentAmount: PropTypes.number, // 当前数额
  prizeList: PropTypes.array, // 奖励进度list
  level: PropTypes.number, // 当前是第几级
  onClick: PropTypes.func, // 点击礼包触发的函数
  barBg: PropTypes.string, // 进度条底色背景
  barLight: PropTypes.string, // 进度条高亮颜色
};

PrizeItem.defaultProps = {
  data: { thresholdMin: 0, prizes: [{}] },
  currentAmount: 0,
  prizeList: [{ thresholdMin: 0, prizes: [{}] }],
  level: 1,
  onClick: () => {},
  barBg: '#172037',
  barLight: '#2DBD96',
};

export default PrizeItem;
