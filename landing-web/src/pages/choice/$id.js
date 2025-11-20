/**
 * Owner: jesse.shao@kupotech.com
 */
import { useEffect, useMemo, useCallback, useState } from 'react';
import { useSelector, useDispatch } from 'dva';
import { ThemeProvider } from '@kufox/mui';
import { interval } from 'rxjs';
import { _t } from 'utils/lang';
import Banner from 'components/$/ShowCase/Banner';
import Case from 'components/$/ShowCase/Case';
import Vote from 'components/$/ShowCase/Vote';
import Staking from 'components/$/ShowCase/Staking';
import Rule from 'components/$/ShowCase/Rule';
import RuleDetail from 'components/$/ShowCase/RuleDetail';
import Join from 'components/$/ShowCase/Join';
import CurrentVotes from 'components/$/ShowCase/CurrentVotes';
import brandCheckHoc from 'src/hocs/brandCheckHoc';
import { tenantConfig } from 'src/config/tenant';
import { SHOWCASE_STATUS, BEGIN_STATUS } from 'config';
import JsBridge from 'utils/jsBridge';
import { useIsMobile } from 'components/Responsive';
import BScroll from 'components/common/ScrollWrapper';
import MobileBar from 'components/common/MobileBar';
import Header from 'components/$/ShowCase/Header';
import ModalForbid from 'components/common/Tips/modalForbid';
import { useParams } from 'react-router-dom';
import _ from 'lodash';
import { Helmet } from 'react-helmet';
import { SHOW_CASE_ICO } from 'config';

import AppUpdateDialog from 'components/common/AppUpdateDialog';
import styles from './styles.less';

// let hasCalled = false;
let barStoped = false;
// let pullStop = false;

const IndexPageTmp = ({
  dispatch,
  setConfirmRefresh,
  setIsPullingDown,
  setBeforePullDown,
  isInApp,
  publishDetail,
  kcsHolds,
  userVote,
  scrollInstance,
  isPullingDown,
  isMobile = false,
}) => {
  const currentLang = useSelector((state) => state.app.currentLang);

  const dispatchMobilebarY = useCallback(
    (y) => {
      dispatch({ type: 'showcase/update', payload: { mobileBarY: Math.abs(y) } });
    },
    [dispatch],
  );

  const _dispatchMobilebarY = _.throttle(dispatchMobilebarY, 200);

  const handleScroll = useCallback(
    ({ y = 0 }) => {
      // if (!pullStop && Math.abs(y) >= 75) {
      //   setConfirmRefresh(true); // 拉到该高度时，更新文案
      //   pullStop = true;
      // }
      if (!isInApp) return;
      if (!barStoped && Math.abs(y) <= 500) {
        _dispatchMobilebarY(y);
        barStoped = true;
      } else {
        barStoped = false;
      }
    },
    [_dispatchMobilebarY, isInApp],
  );

  const refreshScroll = useCallback(() => {
    // if (isPullingDown) return;
    scrollInstance && scrollInstance.refresh();
  }, [scrollInstance]);

  useEffect(() => {
    if (scrollInstance) {
      scrollInstance.refresh();
    }
  }, [publishDetail, scrollInstance, kcsHolds, userVote]);

  // const finishPullDown = useCallback(async () => {
  //   await new Promise(resolve => {
  //     setTimeout(() => {
  //       scrollInstance.finishPullDown();
  //       resolve()
  //     }, 1000)
  //   })

  //   setTimeout(() => {
  //     setBeforePullDown(true);
  //     setConfirmRefresh(false);
  //     scrollInstance.refresh();
  //     hasCalled = false;
  //     pullStop = false;
  //   }, 700)
  // }, [scrollInstance, setBeforePullDown, setConfirmRefresh]);

  // const handlePullDown = useCallback(async () => {
  //   if (hasCalled) return;
  //   hasCalled = true;
  //   setBeforePullDown(false);
  //   setIsPullingDown(true);
  //   // const data = await dispatch({ type: 'showcase/init' });
  //   if (true) {
  //     setTimeout(() => {
  //       setIsPullingDown(false);
  //       finishPullDown();
  //     }, 1000)
  //   }
  // }, [finishPullDown, setBeforePullDown, setIsPullingDown]);

  useEffect(() => {
    if (scrollInstance) {
      scrollInstance.on('scroll', handleScroll);
      // scrollInstance.on('pullingDown', handlePullDown);
    }
    return () => {
      scrollInstance && scrollInstance.off('scroll', handleScroll);
    };
  }, [publishDetail, kcsHolds, userVote, scrollInstance, handleScroll]);

  useEffect(() => {
    import('@kc/tdk').then(({ default: tdkManager }) => {
      tdkManager.handleUpdateTdk(
        currentLang,
        {
          title: _t('choice.page.title'),
          description: _t('choice.page.des'),
          keywords: _t('choice.page.keywords'),
        },
        true
      );
    });

    return () => {
      import('@kc/tdk').then(({ default: tdkManager }) => {
        tdkManager.clearHandleUpdateTdk?.();
      });
    };
  }, [currentLang]);

  return (
    <div className={styles.indexPage}>
      <ThemeProvider>
        <AppUpdateDialog />
        <Helmet>
          <link rel="icon" href={SHOW_CASE_ICO} type="image/x-icon" />
        </Helmet>
        {!isInApp && <Header />}
        <Banner />
        <Case refreshScroll={refreshScroll} />
        {publishDetail.id &&
          ((publishDetail.status === SHOWCASE_STATUS.PROCESSING &&
            publishDetail.beginStatus === BEGIN_STATUS.VOTING) ||
            publishDetail.status === SHOWCASE_STATUS.END) && (
            <CurrentVotes refreshScroll={refreshScroll} />
          )}
        <Vote refreshScroll={refreshScroll} />
        <Staking />
        <Rule />
        <RuleDetail />
        <Join />
      </ThemeProvider>
    </div>
  );
};

const IndexPage = () => {
  const publishDetail = useSelector((state) => state.showcase.publishDetail);
  const kcsHolds = useSelector((state) => state.showcase.kcsHolds);
  const userVote = useSelector((state) => state.showcase.userVote);
  const isInApp = useSelector((state) => state.app.isInApp);
  const isMobile = useIsMobile();
  const dispatch = useDispatch();
  const { id } = useParams();
  const [beforePullDown, setBeforePullDown] = useState(true);
  const [isPullingDown, setIsPullingDown] = useState(false);
  const supportCookieLogin = useSelector((state) => state.showcase.supportCookieLogin);
  const { isSub = false } = useSelector((state) => state.user.user || {});
  // const [confirmRefresh, setConfirmRefresh] = useState(false);

  useEffect(() => {
    dispatch({ type: 'app/getUserInfo' });
  }, [dispatch]);

  useEffect(() => {
    if (isInApp) {
      window.onListenEvent('onLogin', () => {
        dispatch({ type: 'showcase/init' });
        dispatch({ type: 'app/getUserInfo' });
      });
    }
  }, [dispatch, isInApp]);

  useEffect(() => {
    dispatch({ type: 'showcase/init', payload: { id } });
  }, [dispatch, id]);

  const getTokenVote = useCallback(() => {
    dispatch({ type: 'showcase/getTokenVote', payload: { showcaseId: publishDetail.id } });
  }, [dispatch, publishDetail.id]);

  useEffect(() => {
    if (!publishDetail.id) return;
    if (
      (publishDetail.status === SHOWCASE_STATUS.PROCESSING &&
        publishDetail.beginStatus === BEGIN_STATUS.VOTING) ||
      publishDetail.status === SHOWCASE_STATUS.END
    ) {
      getTokenVote();
    }
  }, [dispatch, getTokenVote, publishDetail]);

  useEffect(() => {
    if (!publishDetail.id || publishDetail.status === SHOWCASE_STATUS.END) return;
    const $timer = interval(1000 * 60 * 5); // 每隔5分钟查询一次
    $timer.subscribe((x) => {
      getTokenVote();
    });
  }, [dispatch, getTokenVote, publishDetail.id, publishDetail.status]);

  useEffect(() => {
    if (isMobile) {
      JsBridge.open({
        type: 'event',
        params: {
          name: 'updateHeader',
          visible: false,
          statusBarTransparent: true,
          statusBarIsLightMode: false,
        },
      });
      JsBridge.open({
        type: 'event',
        params: {
          name: 'onPageMount',
        },
      });
    }
  }, [isMobile]);

  const pageProps = useMemo(
    () => ({
      kcsHolds,
      userVote,
      publishDetail,
      isMobile,
      isInApp,
      beforePullDown,
      dispatch,
      setBeforePullDown,
      setIsPullingDown,
      isPullingDown,
      // setConfirmRefresh,
    }),
    [beforePullDown, dispatch, isInApp, isMobile, isPullingDown, kcsHolds, publishDetail, userVote],
  );

  if (isSub) {
    return <ModalForbid />;
  }

  if (isMobile) {
    return (
      <div>
        {isInApp && <MobileBar />}
        <BScroll className={styles.bsWrapper}>
          {(scrollInstance) => {
            return (
              <div>
                {/* <div className={styles.pullDownText}>
                  {beforePullDown && (
                   confirmRefresh ? '松开更新信息' : '下拉刷新信息'
                  )}
                  {!beforePullDown && (
                    isPullingDown
                    ? '更新中...'
                    : '更新成功'
                  )}
                </div> */}
                <IndexPageTmp {...pageProps} scrollInstance={scrollInstance} />
              </div>
            );
          }}
        </BScroll>
      </div>
    );
  }

  return <IndexPageTmp publishDetail={publishDetail} isMobile={isMobile} isInApp={isInApp} />;
};

export default brandCheckHoc(IndexPage, () => ['KC_ROUTE'].includes(tenantConfig.siteRoute));
