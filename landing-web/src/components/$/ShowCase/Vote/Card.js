/**
 * Owner: jesse.shao@kupotech.com
 */
import { useCallback, useMemo } from 'react';
import { Button } from '@kufox/mui';
import { SHOWCASE_STATUS, BEGIN_STATUS, VOTE_RULES } from 'config';
import { useSelector } from 'dva';
import map from 'lodash/map';
import { _t, _tHTML } from 'utils/lang';
import FaceBookImg from 'assets/showcase/vote/facebook.svg';
import WechatImg from 'assets/showcase/vote/wechat.svg';
import TelegramImg from 'assets/showcase/vote/telegram.svg';
import TwitterImg from 'assets/showcase/vote/twitter.svg';
import MediumImg from 'assets/showcase/vote/medium.svg';
import styles from './styles.less';
import JsBridge from 'utils/jsBridge';

const Imgs = [
  FaceBookImg,
  WechatImg,
  TelegramImg,
  TwitterImg,
  MediumImg,
];

const VoteRule = ({ label }) => {
  const currentLang = useSelector(state => state.app.currentLang);
  const isInApp = useSelector(state => state.app.isInApp);

  const handleClickMore = useCallback((evt) => {
    evt.preventDefault();
    const url = VOTE_RULES[currentLang] || VOTE_RULES.en_US;
    if (isInApp) {
      JsBridge.open({
        type: 'jump',
        params: {
          url: `/link?url=${url}`,
        }
      });
      return;
    }
    window.open(url, '_blank');
  }, [currentLang, isInApp]);

  return <a href='#more' className={styles.voteMore} onClick={handleClickMore}>{label || _t('choice.vote.rules.link')}</a>;
};

const InviteButton = ({ currentLang, clickInvite, id, name, userVote, status, beginStatus }) => {
  const btnText = useMemo(() => {
    if (status === SHOWCASE_STATUS.PROCESSING) {
      if (beginStatus <= BEGIN_STATUS.COUNTING) { // 未计票和计票中都可以邀请好友
        return _t('choice.vote.card.btn.invite');
      }
      if (beginStatus === BEGIN_STATUS.COUNTED_NO_VOTE) { // 投票未开始
        return _t('choice.vote.notstart');
      }
      if (userVote.voted) {
        if (userVote.tokenId === id && (userVote.userCount && userVote.userCount !== 0)) { // 找到同一个
          return (
            <div>
              {_t('choice.vote.card.btn.votes', { num: userVote.userCount })}
            </div>
          );
        } else {
          return (
            <div>
              {_t('choice.vote.start')}
            </div>
          );
        }
      }
      return (
        <div>{_t('choice.vote.start')}
          {
            userVote.userCount && userVote.userCount !== 0
            ? (
              <span>
                ({userVote.userCount}{_t('choice.vote.currency.votes')})
              </span>
            )
            : null
          }
        </div>
      );
    }
    return (userVote.voted && userVote.tokenId === id && userVote.userCount && userVote.userCount !== 0)
      ? _t('choice.vote.card.btn.votes', { num: userVote.userCount})
      : _t('choice.vote.end');
  }, [beginStatus, id, status, userVote, currentLang]); // eslint-disable-line

  const isDisable = useMemo(() => {
    if (status === SHOWCASE_STATUS.END) {
      return true;
    }
    if (status === SHOWCASE_STATUS.PROCESSING) {
      if (beginStatus === BEGIN_STATUS.COUNTED_NO_VOTE) {
        return true
      }
      if (beginStatus === BEGIN_STATUS.VOTING) {
        if (userVote.voted || userVote.userCount === 0) {
          return true;
        }
      }
    }
    return false;
  }, [beginStatus, status, userVote.userCount, userVote.voted]);

  return (
    <Button className={styles.btn} onClick={() => clickInvite({ id, coin: name })}
      disabled={isDisable}>
        {btnText}
    </Button>
  );
}

const InviteDes = ({ status, userVote, userLogin, handleLogin, beginStatus, currentLang, newUserCount }) => {

  const handleClickAtag = useCallback((e) => {
    if (e.target.tagName.toUpperCase() === 'A') {
      handleLogin();
    }
  }, [handleLogin]);

  const desVote = useMemo(() => {
    if (status !== SHOWCASE_STATUS.END) { // 未计票 - 结束投票(不包含)
      if (!userLogin) {
        return ( // 未登录，登录后查看
          <div onClick={handleClickAtag} className={styles.voteNum}>{_t('choice.vote.card.des.my.current')}
            {_tHTML('choice.vote.card.des.my.current.needLogin')}
          </div>
        );
      }
      // 已登录
      if (beginStatus === BEGIN_STATUS.NO_COUNT) { // 未计票
        return <div className={styles.voteNum}>{_t('choice.vote.card.btn.notcalc')}</div> ; // 活动未开始，暂未计算
      }
      // 开始计票 - 投票中(包含)
      let count = 0; // 默认票数
      if (userVote.userCount && (userVote.userCount !== 0)) { // 字段为不为null 或者 票数不为0
        count = userVote.userCount;
      }
      // 是新人
      if (userVote.new) {
        count = (count === 0) ? 0 : (count - newUserCount); // 新人展示时 - newUserCount 票，如果为0时 就为 0
        return (
          <div className={styles.voteNum}>
            {_t('choice.vote.card.des.my.votes', { num: count })}
            {
             count !== 0 && // 为0 时 不展示
              <>
                <span className={styles.extraVote}>+{newUserCount}</span><span className={styles.voteNew}>{_t('choice.vote.card.des.new')}</span>
              </>
            }
          </div>
        );
      }
      // 不是新人
      return (
        <div className={styles.voteNum}>
          {_t('choice.vote.card.des.my.votes', { num: count })}
        </div>
      );
    }
    return (
      <div className={styles.voteNum}>
        {_t('choice.vote.card.voted.end')}
      </div>
    );
  }, [beginStatus, handleClickAtag, status, userLogin, userVote.new, userVote.userCount, currentLang]); // eslint-disable-line

  const desRule = useMemo(() => {
    if (
        (beginStatus !== BEGIN_STATUS.OTHER) // beginStatus 不是其他
        && (beginStatus < BEGIN_STATUS.COUNTED_NO_VOTE) // // 未计票 - 结束计票(不包含)
      ) {
      return <VoteRule label={_t('choice.vote.votes.getmore')} />; // 获取更多投票
    }
    return <VoteRule />; // 投票规则
  }, [beginStatus, currentLang]); // eslint-disable-line

  return (
    <div className={styles.votes}>
      {desVote}{desRule}
    </div>
  );
};

export default ({ clickInvite, name, id, projectLink, status, introZh, introEn, userVote, beginStatus,
  currentLang, facebook, telegram, medium, twitter, wechat, userLogin, handleLogin, isInApp, newUserCount }) => {

  const handleMoreLink = useCallback((url) => {
    if (isInApp) {
      JsBridge.open({
        type: 'jump',
        params: {
          url: `/link?url=${url}`,
        }
      });
      return;
    }
    window.open(url, '_blank');
  }, [isInApp]);

  const shares = useMemo(() => {
    const data = map([facebook, wechat, telegram, twitter, medium], (item, idx) => {
      if (item) {
        return (
          <img key={idx} src={Imgs[idx]} alt="wechat" className={styles.shareIcon} onClick={() => handleMoreLink(item)} />
        );
      }
    });
    return data;
  }, [facebook, handleMoreLink, medium, telegram, twitter, wechat]);

  const inviteProps = useMemo(() => ({
    userVote,
    status,
    beginStatus,
    currentLang,
  }), [beginStatus, currentLang, status, userVote]);

  const inviteBtnProps = useMemo(() => ({
    ...inviteProps,
    clickInvite,
    id,
    name,
  }), [clickInvite, id, inviteProps, name]);

  const InviteDesProps = useMemo(() => ({
    ...inviteProps,
    userLogin,
    handleLogin,
    newUserCount,
  }), [handleLogin, inviteProps, userLogin, newUserCount]);

  return (
    <div className={styles.card}>
      <div className={styles.cardTitle}>{_t('choice.vote.card.currency.name', { currency: name })}</div>
      <div className={styles.cardDes}>
        {currentLang === 'zh_CN' ? introZh : introEn}
      </div>
      <div className={styles.more} href={projectLink} onClick={() => handleMoreLink(projectLink)}>
        {_t('choice.vote.card.link.more')} ——&gt;
      </div>
      <div className={styles.share}>
        {shares}
      </div>
      <div className={styles.voteBtn}>
        <InviteButton {...inviteBtnProps} />
        <InviteDes {...InviteDesProps} />
      </div>
    </div>
  );
}
