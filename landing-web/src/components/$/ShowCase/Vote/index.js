/**
 * Owner: jesse.shao@kupotech.com
 */
import { useState, useMemo, useCallback, useEffect } from 'react';
import InviteModal from 'components/$/ShowCase/InviteModal';
import { useSelector, useDispatch } from 'dva';
import map from 'lodash/map';
import { _t } from 'utils/lang';
import { LANDING_HOST } from 'utils/siteConfig';
import LoginDrawer from 'components/common/LoginDrawer';
import { SHOWCASE_STATUS, BEGIN_STATUS } from 'config';
import { useIsMobile } from 'components/Responsive';
import JsBridge from 'utils/jsBridge';
import Card from './Card';
import VoteDialog from './VoteDialog';
import { useParams } from 'react-router-dom';
import styles from './styles.less';

const { VoteSuccess } = VoteDialog;

// 活动状态对应time label
const TITLE_LABEL_MAP = {
  1: () => _t('choice.vote.start.soon'), // 活动即将开始
  2: () => _t('choice.vote.start.soon'), // 活动即将开始
  3: () => _t('choice.vote.start.soon'), // 活动即将开始
  4: () => _t('choice.vote.start'), // 立即投票
  0: () => _t('choice.vote.end'),
};

const Vote = ({ refreshScroll }) => {
  const [visible, setVisible] = useState(false);
  const publishDetail = useSelector(state => state.showcase.publishDetail);
  const currentLang = useSelector(state => state.app.currentLang);
  const userLogin = useSelector(state => state.showcase.userLogin);
  const finish = useSelector(state => state.showcase.finish);
  const userVote = useSelector(state => state.showcase.userVote);
  const isInApp = useSelector(state => state.app.isInApp);
  const [tokens, setTokens] = useState([]);
  const [openLogin, setOpenLogin] = useState(false);
  const dispatch = useDispatch();
  const isMobile = useIsMobile();
  const [currentTokenId, setCurrentTokenId] = useState('');
  const [currentTokenName, setCurrentTokenName] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogSuccessOpen, setDialogSuccessOpen] = useState(false);
  const supportCookieLogin = useSelector(state => state.showcase.supportCookieLogin);
  const user = useSelector(state => state.app.user);
  const { id: activityId } = useParams();

  useEffect(() => {
    refreshScroll();
  }, [refreshScroll, tokens]);

  useEffect(() => {
    if (!publishDetail.id) return;
    setTokens(publishDetail.tokens);
  }, [publishDetail]);

  const handleLoginSuccess = useCallback(() => {
    dispatch({ type: 'showcase/init' });
    dispatch({ type: 'app/getUserInfo' });
    setOpenLogin(false);
    window.scrollTo(0, 0);
  }, [dispatch]);

  const handleLogin = useCallback(() => {
    if (isInApp && supportCookieLogin) {
      JsBridge.open({
        type: 'jump',
        params: {
          url: '/user/login',
        },
      });
      return;
    }
    setOpenLogin(true);
  }, [isInApp, supportCookieLogin]);

  // const shareUrl = useMemo(() => {
  //   if (!user) return '';
  //   const host = window.location.origin;
  //   const pathname = window.location.pathname;
  //   const searchs = queryString.parse(window.location.search);
  //   const referralCode = user.referralCode;

  //   // // 如果已经存在referralCode，则删除
  //   delete searchs['rcode'];
  //   delete searchs['?rcode'];

  //   let needQute = false;
  //   if (JSON.stringify(searchs) === '{}') {
  //     needQute = true;
  //   }

  //   searchs.rcode = referralCode;
  //   const parsedSearch = queryString.stringify(searchs);

  //   const url = `${host}${pathname}${needQute ? `?${parsedSearch}` : parsedSearch}`;
  //   return decodeURIComponent(url); // 问号不识别
  // } , [user]);

  const rcode = useMemo(() => {
    return (user && user.referralCode) || '';
  }, [user]);

  const handleInvite = useCallback(async ({ id, coin }) => {
    if (!userLogin || !user) {
      handleLogin();
      return;
    }

    if (publishDetail.status !== SHOWCASE_STATUS.PROCESSING) return;
    // 活动开始时，未计票和计票中都可以邀请好友
    if (publishDetail.beginStatus <= BEGIN_STATUS.COUNTING ) {
      if (isMobile && isInApp) {
        // 直接调用原生webview，生成新页面
        // const encodedUrl = encodeURIComponent(`http://192.168.3.56:8000/choice/mobileInvitePage?lang=${currentLang}&rcode=${rcode}&id=${activityId}`);
        const encodedUrl = encodeURIComponent(`${LANDING_HOST}/choice/mobileInvitePage?lang=${currentLang}&rcode=${rcode}&id=${activityId}`);
        JsBridge.open({
          type: 'jump',
          params: {
            url: `/link?url=${encodedUrl}`,
          }
        });
        return;
      }
      setVisible(true); // 邀请好友
      return;
    }
    // 活动开始时，投票中
    if (publishDetail.beginStatus === BEGIN_STATUS.VOTING) {
      setCurrentTokenId(id);
      setCurrentTokenName(coin);
      setDialogOpen(true);
    }
  }, [activityId, currentLang, handleLogin, isInApp, isMobile, publishDetail.beginStatus, publishDetail.status, rcode, user, userLogin]);

  const inviteModalProps = useMemo(() => ({
    visible,
    onCancel: () => setVisible(false),
    rcode,
  }), [rcode, visible]);

  const loginDrawerProps = useMemo(() => ({
    openLogin,
    handleCloseLogin: () => setOpenLogin(false),
    handleLoginSuccess,
  }), [handleLoginSuccess, openLogin]);

  const cardProps = useMemo(() => ({
    userLogin,
    status: publishDetail.status,
    clickInvite: handleInvite,
    currentLang,
    handleLogin,
    finish,
    userVote,
    beginStatus: publishDetail.beginStatus,
    newUserCount: publishDetail.newUserCount,
    isInApp,
  }), [currentLang, finish, handleInvite, handleLogin, isInApp, publishDetail.beginStatus, publishDetail.status, publishDetail.newUserCount, userLogin, userVote]);

  const titleLabel = useMemo(() => {
    if (!publishDetail.id || publishDetail.status === SHOWCASE_STATUS.END) {
      return TITLE_LABEL_MAP[0]()
    };
    return TITLE_LABEL_MAP[publishDetail.beginStatus]();
  }, [publishDetail, currentLang]); // eslint-disable-line

  const onVote = useCallback(async () => {
    const data = await dispatch({
      type: 'showcase/postVote',
      payload: {
        channel: isMobile ? 3 : 2,
        showcaseId: publishDetail.id,
        tokenId: currentTokenId,
      }
    });
    if (!data) return;
    setDialogOpen(false);
    setDialogSuccessOpen(true);
    await dispatch({ type: 'showcase/init' });
    refreshScroll()
  }, [currentTokenId, dispatch, isMobile, publishDetail.id, refreshScroll]);

  const voteDialogProps = useMemo(() => ({
    open: dialogOpen,
    onOk: onVote,
    coin: currentTokenName,
    onCancel: () => setDialogOpen(false),
    vote: userVote.userCount || 0,
    isMobile,
  }), [currentTokenName, dialogOpen, isMobile, onVote, userVote.userCount]);

  const voteSuccessProps = useMemo(() => ({
    open: dialogSuccessOpen,
    onOk: () => setDialogSuccessOpen(false),
    onCancel: () => setDialogSuccessOpen(false),
    isMobile,
  }), [dialogSuccessOpen, isMobile]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>
        <div className={styles.title}>
          {titleLabel}
        </div>
        <div className={styles.cards}>
          {
            map(tokens, (item, idx) => (
              <Card {...item} key={idx} {...cardProps} />
            ))
          }
        </div>
      </div>
      <InviteModal {...inviteModalProps} />
      <LoginDrawer {...loginDrawerProps} needBox={isMobile} />
      <VoteDialog {...voteDialogProps} />
      <VoteSuccess {...voteSuccessProps} />
    </div>
  );
}

export default Vote;
