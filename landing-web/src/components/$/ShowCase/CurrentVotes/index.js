/**
 * Owner: jesse.shao@kupotech.com
 */
import { useState, useEffect } from 'react';
import cls from 'clsx';
import { useSelector } from 'dva';
import QuestIcon from 'assets/showcase/CurrentVotes/quest.svg';
import CrownIcon from 'assets/showcase/case/crown.svg';
import { separateNumber } from 'helper';
import { _t } from 'utils/lang';
import styles from './styles.less';

const VoteBar = ({ left, right }) => {
  const totalWidth = left + right;
  const leftWidth = Math.floor(left / totalWidth * 100);
  let leftWidthPercent = leftWidth;

  if (left === right) {
    leftWidthPercent = 50;
  } else {
    if (leftWidth < 10) {
      leftWidthPercent = 10;
    }
    if (leftWidth > 90) {
      leftWidthPercent = 90;
    }
  }

  leftWidthPercent += '%';

  return (
    <div className={styles.voteBar}>
      <div className={cls(styles.bar, styles.leftBar)} style={{ width: leftWidthPercent }} />
      <div className={cls(styles.bar, styles.rightBar)} />
    </div>
  );
}

const CurrentVotes = ({ refreshScroll }) => {
  const finish = useSelector(state => state.showcase.finish);
  const tokenVote = useSelector(state => state.showcase.tokenVote);
  const publishDetail = useSelector(state => state.showcase.publishDetail);
  const [leftWined, setLeftWined] = useState(true);
  const [noWin, setNoWin] = useState(true);

  useEffect(() => {
    if (!tokenVote[0]) return; // 判断没数据直接返回
    if (!tokenVote[0].winner && !tokenVote[1].winner) { // 都不胜利
      setNoWin(true);
    } else if (tokenVote[0] && tokenVote[0].winner) { // 左边胜利
      setNoWin(false);
    } else if (tokenVote[1] && tokenVote[1].winner) { // 右边胜利
      setLeftWined(false);
      setNoWin(false);
    }

    refreshScroll();
  }, [refreshScroll, tokenVote]);

  if (!tokenVote[0]) {
    return null;
  }

  const { namelessVote } = publishDetail;
  const isFinish = !namelessVote || finish;

  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>
        <div className={styles.title}>{finish ? _t('choice.vote.title.end') : _t('choice.vote.title.current')}</div>
        <div className={cls(styles.voteIcons, { [styles.finish]: isFinish, [styles.rightWined]: !leftWined })}>
          <div className={styles.wined}>
            <div className={styles.coin}>
              <div className={styles.winCoin}>
                {finish && leftWined && !noWin && <img src={CrownIcon} alt={tokenVote[0].token} className={styles.crownIcon} /> }
                <img src={isFinish ? tokenVote[0].logoUrl : QuestIcon} className={styles.voteIcon} alt={isFinish ? tokenVote[0].token : ''} />
              </div>
              {isFinish && <span className={cls({ [styles.winedName]: leftWined })}>{tokenVote[0].token}</span>}
            </div>
          {finish && leftWined && !noWin && <div className={styles.winedBar}>{_t('choice.vote.currency.win')}</div> }
          </div>
          <span className={styles.vs}>VS</span>
          <div className={styles.wined}>
            <div className={styles.coin}>
              <div className={styles.winCoin}>
                {finish && !leftWined && !noWin && <img src={CrownIcon} alt={tokenVote[1].token} className={styles.crownIcon} /> }
                <img src={isFinish ? tokenVote[1].logoUrl : QuestIcon} className={styles.voteIcon} alt={isFinish ? tokenVote[1].token : ''} />
              </div>
              {isFinish && <span className={cls({[styles.winedName]: !leftWined})}>{tokenVote[1].token}</span>}
            </div>
            {finish && !leftWined && !noWin && <div className={styles.winedBar}>{_t('choice.vote.currency.win')}</div>}
          </div>
        </div>
        <VoteBar left={tokenVote[0].voteCount} right={tokenVote[1].voteCount} />
        <div className={styles.mount}>
        <div>{separateNumber(tokenVote[0].voteCount)}<span className={styles.text}>{_t('choice.vote.currency.votes')}</span></div>
        <div>{separateNumber(tokenVote[1].voteCount)}<span className={styles.text}>{_t('choice.vote.currency.votes')}</span></div>
        </div>
      </div>
    </div>
  );
}

export default CurrentVotes;
