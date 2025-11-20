/**
 * Owner: jesse.shao@kupotech.com
 */
import React, { useState, useEffect, useCallback, Fragment, useMemo, useRef } from 'react';
import { useSelector, useDispatch } from 'dva';
import { delay, debounce, size } from 'lodash';
import { _t } from 'utils/lang';
import QRCode from 'qrcode.react';

import { styled } from '@kufox/mui/emotion';
import { ThemeProvider as KuFoxThemeProvider } from '@kufox/mui';
import { useEventCallback } from '@kufox/mui/hooks';
import { useIsMobile } from 'components/Responsive';
import JsBridge from 'utils/jsBridge';
import brandCheckHoc from 'src/hocs/brandCheckHoc';
import { tenantConfig } from 'src/config/tenant';
import { Event, calcPx, openPage } from 'helper';
import UserLimitedInfoDialog from 'components/UserLimitedInfoDialog'; // 身份限制提醒弹窗
import { Content, Wrapper as ContentWrapper, Holder } from 'components/$/NFTQuiz/Home';
import Header from 'components/$/NFTQuiz/Header';
import { HeaderTitle } from 'components/$/NFTQuiz/Header/styled';
import PageInfo from 'components/$/NFTQuiz/Info';
import CountDown from 'components/$/NFTQuiz/CountDown';
import QuestionGuide from 'components/$/NFTQuiz/QuestionGuide';
import Question from 'components/$/NFTQuiz/Question';
import QuestionResult from 'components/$/NFTQuiz/Question/Result';
import LearnNFT from 'components/$/NFTQuiz/LearnNFT';
import BuyNFT from 'components/$/NFTQuiz/LearnNFT/Buy';
import ActivityDesc from 'components/$/NFTQuiz/ActivityDesc';
import BackTop from 'components/$/NFTQuiz/BackTop';
import HistoryList from 'components/$/NFTQuiz/HistoryList';
import LearnNFTVideo from 'components/$/NFTQuiz/LearnNFTVideo';
import PosterShare from 'components/$/NFTQuiz/PosterShare';
import TipDialog from 'components/$/NFTQuiz/Tip';
import { QuizContext } from 'components/$/NFTQuiz/context';
import { LANDING_HOST } from 'utils/siteConfig';
import { NFT_QUIZ_TYPES as TYPES, NFT_QUIZ_STATUS } from 'config';
import { M_KUCOIN_HOST, TRADE_HOST, KUMEX_HOST } from 'utils/siteConfig';
import { sensors } from 'utils/sensors';
import 'animate.css';
import styles from './style.less';

const TRADE_URL = {
  // 现货
  SPOT: {
    appUrl: `/trade`,
    pcUrl: `${TRADE_HOST}/BTC-USDT`,
    h5Url: `${M_KUCOIN_HOST}/trade/BTC-USDT`,
  },
  // 合约
  FUTURE: {
    appUrl: `/kumex/trade`,
    pcUrl: `${KUMEX_HOST}/trade/XBTUSDTM`,
    h5Url: `${KUMEX_HOST}/lite/brawl/XBTUSDTM`,
  },
};

// --- 样式start ---
const Wrapper = styled.div`
  position: relative;
  width: 100%;
  min-height: 100vh;
  overflow-x: hidden;
  overflow-y: auto;
  /* @media (min-width: 1040px) {
    background: black;
  } */
`;
const Page = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;

  overflow-x: hidden;
  overflow-y: auto;
  @media (min-width: 1040px) {
    margin: 0 auto;
    max-width: 375px;
    ::-webkit-scrollbar {
      background: transparent;
      width: 2px;
      height: 2px;
    }
    ::-webkit-scrollbar-track {
      background: transparent;
    }
    ::-webkit-scrollbar-thumb {
      border-radius: 2px;
      background: rgba(0, 20, 42, 0.2);
    }
  }
`;
// --- 样式 end ---

const getCurrentConfig = activityConfig => {
  if (!activityConfig) return null;
  const config = activityConfig.config && activityConfig.config[0];
  return config;
};

const IndexPage = () => {
  const isMobile = useIsMobile();
  const dispatch = useDispatch();
  const { isLogin, user } = useSelector(state => state.user);
  const { appReady, isInApp, supportCookieLogin, currentLang } = useSelector(state => state.app);
  const {
    inviteCode,
    viewType,
    // isActivityRegister, // 是否参与活动
    activityConfig, // 活动配置，包含活动参与最低限额、奖池数量、
    answerList, // 题目列表
    todayAnswerInfo, // 用户当天答题情况
    answerListProgress, // 答题进度
    historyList, // 答题历史记录
  } = useSelector(state => state.nftQuiz);

  /**
   * 显示限制弹窗与否 用户必须是 type 为1 才可以参加活动
   */
  const isAllow = useMemo(
    () => {
      return user && user.type === 1;
    },
    [user],
  );

  // 是否显示活动受限弹窗
  const showUserLimitedDialog = user && !isAllow;

  // 分享给好友的链接
  const shareLink = inviteCode
    ? `${LANDING_HOST}/LearnToEarn?rcode=${inviteCode}`
    : `${LANDING_HOST}/LearnToEarn`;

  // 数据初始化, 需登录态
  useEffect(
    () => {
      if (!isLogin) return;
      // 获取邀请码
      dispatch({
        type: 'nftQuiz/getInviteCode',
      });
      // 获取用户活动参与情况，如果没有参与活动，会自动调用接口，让其参与
      dispatch({
        type: 'nftQuiz/getIsActivityRegister',
        payload: {
          userPass: !showUserLimitedDialog,
        },
      });
    },
    [isLogin, showUserLimitedDialog],
  );

  const refreshTodayAnswerInfo = useCallback(
    debounce(id => {
      // 获取当天答题情况
      dispatch({
        type: 'nftQuiz/getTodayAnswerInfo',
        payload: {
          id,
        },
      });
    }, 300),
    [dispatch],
  );

  // 每天一轮活动（答题），拿到当期活动id后，请求用户答题情况。
  useEffect(
    () => {
      if (isLogin) {
        refreshTodayAnswerInfo(activityConfig?.currentId);
      }
    },
    [activityConfig, isLogin],
  );

  // 数据初始化，通用数据
  useEffect(
    () => {
      // 获取答题列表，未登录、或未满足条件，也要显示题目
      dispatch({
        type: 'nftQuiz/getAnswerList',
      });
      // 获取活动配置，及参数
      dispatch({
        type: 'nftQuiz/getQuizConfig',
        payload: {
          underway: true,
        },
      });
    },
    [dispatch],
  );

  // 初始化动画
  /* useEffect(() => {
    new WOW({
      offset: 200,
    }).init();
  }, []); */

  // 上传页面加载
  const handleJSOpen = useCallback(() => {
    JsBridge.open({
      type: 'event',
      params: {
        name: 'onPageMount',
      },
    });
  }, []);

  useEffect(
    () => {
      appReady && delay(handleJSOpen, 300);
    },
    [appReady],
  );

  // 跳转现货界面
  // 跳转页面
  const goToTrade = useEventCallback(
    debounce(
      type => {
        const urlObj = TRADE_URL[type];
        let url;
        if (isInApp) {
          url = urlObj?.appUrl;
        } else if (isMobile) {
          url = urlObj?.h5Url;
        } else {
          url = urlObj?.pcUrl;
        }
        // 埋点
        // sensors.trackClick([type === 'SPOT' ? 'Spot' : 'Futures', '1']);
        // 跳转
        if (url) {
          openPage(isInApp, url);
        }
      },
      500,
      { leading: true, trailing: false },
    ),
    [openPage, isInApp, isMobile],
  );

  // 发起登录操作
  const handleLogin = useCallback(
    () => {
      // 在App里面，同时支持注入Cookie登录
      if (isInApp && supportCookieLogin) {
        JsBridge.open({
          type: 'jump',
          params: {
            url: '/user/login',
          },
        });
        return;
      }
      dispatch({
        type: 'user/update',
        payload: {
          showLoginDrawer: true,
        },
      });
    },
    [isInApp, supportCookieLogin, dispatch],
  );

  // 拉起分享流程
  const shareRef = useRef(null);
  const openShare = useCallback(
    () => {
      if (shareRef.current) {
        shareRef.current.goShare();
        // 埋点
        sensors.trackClick(['Share', '1'], {
          language: currentLang,
        });
      }
    },
    [currentLang],
  );

  // 界面加载完毕，初始化scroll事件
  const [fix, updateHeaderFix] = useState({ header: false, pin: false });

  const handlePageScroll = useEventCallback(element => {
    if (!isMobile) return;
    if (viewType === TYPES.LEARN) {
      updateHeaderFix({
        header: false,
        pin: false,
      });
      return;
    }
    const scrollTop = element?.scrollTop || 0;
    const relPx = calcPx(scrollTop);
    const isFix = relPx > 32;
    const isPin = relPx > 150;
    updateHeaderFix({
      header: isFix,
      pin: isPin,
    });
  });

  const isExpired = activityConfig.activityStatus === NFT_QUIZ_STATUS.EXPIRED;

  // 倒计时结束后，需要再次请求接口，刷新数据
  const handleCountEnd = useEventCallback(() => {
    if (isExpired) return;
    // 获取活动配置，及参数
    delay(async () => {
      const config = await dispatch({
        type: 'nftQuiz/getQuizConfig',
        payload: {
          underway: true,
        },
      });
      if (config.currentId !== config._oldCurrentId) {
        // 活动轮次刷新了，刷新题目
        dispatch({
          type: 'nftQuiz/update',
          payload: {
            answerListProgress: {
              current: 0,
            },
            answerList: [],
          },
        });
        dispatch({
          type: 'nftQuiz/getAnswerList',
        });
      } else {
        if (size(answerList) < 1) {
          dispatch({
            type: 'nftQuiz/getAnswerList',
          });
        }
      }
      if (isLogin) {
        // 获取当天答题情况
        refreshTodayAnswerInfo(config?.currentId);
      }
    }, 300);
  });

  useEffect(() => {
    const element = document.documentElement;
    if (!element) return;
    const handler = debounce(() => {
      handlePageScroll(element);
    }, 100);
    Event.addHandler(window, 'scroll', handler);
    Event.addHandler(window, 'resize', handler);
    return () => {
      Event.removeHandler(window, 'scroll', handler);
      Event.removeHandler(window, 'resize', handler);
    };
  }, []);

  // 统一检查登录、报名等所有前置条件, 未登陆就先登录
  const btnClickCheck = useCallback(
    // 防抖处理
    debounce(
      async () => {
        if (!isLogin) {
          handleLogin();
          return false;
        }
        return true;
      },
      300,
      { leading: true, trailing: false },
    ),
    [isLogin, handleLogin],
  );

  // 分享海报的二维码
  const getQRCode = useMemo(
    () => {
      return (
        <QRCode
          size={50}
          value={shareLink}
          id="nftQuiz-QRCode-url"
          style={{ position: 'absolute', visibility: 'hidden', zIndex: -1 }}
        />
      );
    },
    [shareLink],
  );

  const contentRef = useRef(null);
  const handleBacktop = useCallback(
    debounce(
      top => {
        window.scrollTo({
          top: top || 0,
          behavior: 'smooth',
        });
      },
      300,
      { leading: true, trailing: false },
    ),
    [],
  );

  const mainPageTopRef = useRef(0);
  const scrollToPageStart = useEventCallback(() => {
    const top = mainPageTopRef?.current;
    if (!top) return;
    handleBacktop(top);
  });

  // 界面切换
  const updateViewType = useEventCallback((type = TYPES.MAIN) => {
    // 记录 scrollTop
    if (viewType === TYPES.MAIN && type !== TYPES.MAIN) {
      const element = document.documentElement;
      if (element) {
        mainPageTopRef.current = element.scrollTop || 0;
      }
    }
    if (type === TYPES.MAIN) {
      // 刷新倒计时
      // 获取活动配置，及参数
      dispatch({
        type: 'nftQuiz/getQuizConfig',
        payload: {
          underway: true,
        },
      });
      scrollToPageStart();
    } else if (type === TYPES.HIS) {
      // 活动答题历史记录
      dispatch({
        type: 'nftQuiz/getActivityRecords',
        payload: {
          underway: true,
          currentPage: 1,
        },
      });
    } else if (type === TYPES.LEARN) {
    }
    dispatch({
      type: 'nftQuiz/update',
      payload: {
        viewType: type,
      },
    });
  });

  const headerView = useMemo(
    () => {
      let headerCfg = {};
      if (viewType === TYPES.HIS) {
        headerCfg = {
          showRightBox: false,
          headerTitle: <HeaderTitle>{_t('9jzAKeoYMqZnMLD4bWCdZy')}</HeaderTitle>,
          onClickLogo: updateViewType,
        };
      } else if (viewType === TYPES.LEARN) {
        headerCfg = {
          showRightBox: false,
          onClickLogo: updateViewType,
        };
      }
      return (
        <>
          <Header {...headerCfg} isFix={fix?.header} />
          {fix?.header && <Holder />}
        </>
      );
    },
    [viewType, fix],
  );

  const bgSource = useMemo(
    () => {
      const config = {};
      switch (viewType) {
        case TYPES.MAIN:
          config.className = styles.mainBg;
          break;
        case TYPES.HIS:
          config.className = styles.historyBg;
          break;
        case TYPES.LEARN:
          config.className = styles.learnBg;
          break;
      }
      return config;
    },
    [viewType],
  );

  // 相关业务参数，逻辑控制计算
  /**
   * 用户答题情况（是否参与答题，答题情况（通过、不通过，答对数量））
   */
  const isAnswered = useMemo(
    () => {
      if (isExpired) return false;
      const { correctNum, totalNum } = todayAnswerInfo || {};
      return correctNum !== null && totalNum > 0;
    },
    [todayAnswerInfo, isExpired],
  );

  const isTodayPass = useMemo(
    () => {
      if (isExpired) return false;
      if (!todayAnswerInfo) return false;
      const { todayCanAnswer, pass } = todayAnswerInfo || {};
      if (!todayCanAnswer || !isAnswered) return false;
      return pass;
    },
    [todayAnswerInfo, isAnswered, isExpired],
  );

  // 是否显示答题区域
  const isShowAnswerLayer = useMemo(
    () => {
      if (isExpired) return true;
      if (isAnswered) return false;
      return size(answerList) > 0;
    },
    [answerList, isAnswered, isExpired],
  );

  // 是否显示答题结果
  const isShowAnswerResult = useMemo(
    () => {
      if (isTodayPass === undefined || isExpired) return false;
      return isAnswered;
    },
    [isTodayPass, isAnswered, isExpired],
  );

  // 答题区域是否不可点击
  const isAnserLayerDisable = useMemo(
    () => {
      if (!isLogin || isExpired) return true;
      if (activityConfig?.activityStatus !== NFT_QUIZ_STATUS.CURRENT) return true;
      const { todayCanAnswer } = todayAnswerInfo || {};
      if (!todayCanAnswer) return true;
      return !getCurrentConfig(activityConfig);
    },
    [isLogin, activityConfig, todayAnswerInfo, isExpired],
  );

  // 是否开启视频学习抽奖，是否唤起活动参数
  const isOpenLearn = useMemo(
    () => {
      return activityConfig?.activityStatus !== NFT_QUIZ_STATUS.NOT_BEGIN;
    },
    [activityConfig],
  );

  const mainContent = useMemo(
    () => {
      // if (viewType !== TYPES.MAIN) return null;
      const isShow = viewType === TYPES.MAIN;
      const { learnVideoUrl } = activityConfig || {};
      return (
        <div className={!isShow && styles.hidden}>
          {/* PageInfo, 包含项目方，slogan， 动效logo等 */}
          <PageInfo config={activityConfig} />
          {/* 活动开始倒计时 */}
          <CountDown config={activityConfig} handleCountEnd={handleCountEnd} />
          {/* 答题主区域-引导 */}
          <QuestionGuide>
            {/* 答题主区域-答题 */}
            {isShowAnswerLayer && <Question disabled={isAnserLayerDisable} />}
            {/* 答题主区域-答题结果 */}
            {isShowAnswerResult && <QuestionResult />}
          </QuestionGuide>
          {/* NFT有奖视频学习 */}
          {learnVideoUrl && <LearnNFT />}
          {/* 购买NFT */}
          <BuyNFT />
          {/* 活动说明 */}
          <ActivityDesc />
        </div>
      );
    },
    [
      viewType,
      activityConfig,
      handleCountEnd,
      isShowAnswerLayer,
      isAnserLayerDisable,
      isShowAnswerResult,
    ],
  );

  const hisContent = useMemo(
    () => {
      // if (viewType !== TYPES.HIS) return null;
      const isShow = viewType === TYPES.HIS;
      return <div className={!isShow && styles.hidden}>{isShow && <HistoryList />}</div>;
    },
    [viewType],
  );

  const learnContent = useMemo(
    () => {
      // if (viewType !== TYPES.LEARN) return null;
      const isShow = viewType === TYPES.LEARN;
      return <div className={!isShow && styles.hidden}>{isShow && <LearnNFTVideo />}</div>;
    },
    [viewType],
  );

  const combinedContent = (
    <Wrapper>
      <Content ref={contentRef} id="nft-quiz-content" viewType={viewType}>
        {/* header区域 */}
        {headerView}
        <ContentWrapper padding={viewType !== TYPES.LEARN} isHis={viewType === TYPES.HIS}>
          {mainContent}
          {hisContent}
          {learnContent}
        </ContentWrapper>
      </Content>
    </Wrapper>
  );

  /**
   * 是否显示返回顶部icon
   */
  const isShowBackTop = useMemo(
    () => {
      return viewType !== TYPES.LEARN && fix?.pin;
    },
    [viewType, fix],
  );

  const [tradeTipVisible, updateTradeTip] = useState(false);
  const toggleTradeTip = useEventCallback(() => {
    const visible = !tradeTipVisible;
    updateTradeTip(visible);
    if (visible) {
      sensors.trackClick(['Explain', '1']);
    }
  });

  // 点击事件必须登录，否则不执行
  const contextValue = {
    dispatch,
    btnClickCheck,
    updateViewType,
    viewType,
    activityConfig,
    historyList,
    answerList,
    todayAnswerInfo,
    answerListProgress,
    isLogin,
    isInApp,
    isMobile,
    handleLogin,
    openShare,
    isOpenLearn,
    isAnswered,
    goToTrade,
    getCurrentConfig,
    toggleTradeTip,
    currentLang,
  };

  const tradeMinAmount = useMemo(
    () => {
      const { answer } = activityConfig || {};
      const { tradeAmount } = answer || {};
      return tradeAmount;
    },
    [activityConfig],
  );

  return (
    <KuFoxThemeProvider>
      <Page className={`${bgSource.className}`} data-inspector="LearnToEarnPage">
        {isShowBackTop && <BackTop onClick={handleBacktop} />}
        {<QuizContext.Provider value={contextValue}>{combinedContent}</QuizContext.Provider>}
        {/* 二维码弹窗内容 */}
        {getQRCode}
      </Page>
      {/* 用户不符合条件-提示：类型不符合 */}
      <Fragment>
        {showUserLimitedDialog ? (
          <UserLimitedInfoDialog
            open={showUserLimitedDialog}
            title={_t('1a4L5Ysnyaj5krrKHJy9mz')}
            des={_t('eKmbjLkJHCf3c3WCVAiUro')}
            okText={_t('eVEdpvzVgzuJYNHVpUxggB')}
          />
        ) : (
          ''
        )}
        {tradeTipVisible ? (
          <TipDialog
            open={tradeTipVisible}
            size={isMobile ? 'mini' : 'basic'}
            showCloseX={false}
            title={_t('4Ws9poMLVPaxcKWsYnFkMs')}
            onOk={toggleTradeTip}
            onCancel={toggleTradeTip}
            cancelText={null}
            okText={_t('6ujEEezFW8cnaTUTVRd2C5')}
          >
            <p>
              {_t('muj7w5YuM1uBTY6cWxjQxA', {
                Amount: tradeMinAmount,
              })}
            </p>
            <p>{_t('1wLzh6o8xybokYhKVep8CE')}</p>
          </TipDialog>
        ) : null}
      </Fragment>
      <PosterShare ref={shareRef} type="activity" />
    </KuFoxThemeProvider>
  );
};

export default brandCheckHoc(IndexPage, () => ['KC_ROUTE'].includes(tenantConfig.siteRoute));
