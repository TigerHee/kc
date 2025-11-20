/**
 * Owner: chris@kupotech.com
 */
import sentry from '@kc/sentry';
import JsBridge from '@knb/native-bridge';
import { useLocale } from '@kucoin-base/i18n';
import {
  css,
  EmotionCacheProvider,
  Global,
  styled,
  ThemeProvider,
  useResponsive,
  useSnackbar,
  useTheme,
} from '@kux/mui';
import { useDebounceFn } from 'ahooks';
import AppMeta from 'components/AppMeta';
import GlobalTransferScope from 'components/Root/GlobalTransferScope';
import { add, evtEmitter } from 'helper';
import { keyBy, last } from 'lodash';
import { Fragment, useEffect, useReducer, useRef } from 'react';
import { useDispatch } from 'react-redux';
import {
  getAccountBalance,
  getKcsRights,
  getKycConfig,
  getKycStatus,
  getProductKCSOverview,
} from 'services/kcs';
import NoSSG from 'src/components/NoSSG';
import { useHideScollBarInApp } from 'src/components/Premarket/hooks';
import { useSelector } from 'src/hooks/useSelector';
import sensors from 'tools/ext/kc-sensors';
import About from './components/About';
import AppHeader from './components/AppHeader';
import Banner from './components/Banner';
import BottomButton from './components/BottomButton';
import Context from './components/Context';
import Eligibility from './components/Eligibility';
import ExclusiveBenefits from './components/ExclusiveBenefits';
import SafeArea from './components/SafeArea';
import SkeletonLoading from './components/SkeletonLoading';
import Staking from './components/Staking';
import { EVENT, levelConfigMap, totalLevel } from './config';
import KycModal from './modals/KycModal';
import RuleModal from './modals/RuleModal';
import UpgradeModal from './modals/UpgradeModal';
import { getScene, goLock, goLogin, lottieStore } from './utils';
const { getEvt } = evtEmitter;
const event = getEvt(EVENT);

const Wrapper = styled.div`
  border-radius: 12px 12px 0px 0px;
  background: ${({ currentLevel }) => levelConfigMap[currentLevel]?.overlayColor || '#000'};
  // transition: 0.3s;
  .help {
    cursor: help;
  }
`;
const Content = styled.div`
  max-width: 1440px;
  width: 100%;
  margin: 0px auto;
  border-radius: 20px 20px 0px 0px;
  padding-bottom: 50px;
  // transition: 0.3s;
  background: ${({ theme, currentLevel }) =>
    levelConfigMap[currentLevel]?.overlayColor || theme.colors.overlay};
  ${(props) => props.theme.breakpoints.down('sm')} {
    padding-bottom: calc(140px + env(safe-area-inset-bottom, 0px));
  }
`;

/*
 * 初始状态
 */
const initState = {
  currentLevel: 0,
  userLevel: 0,
  originalLevel: 0, // 用户等级，后端返回 默认为0
  ruleVisible: false,
  upgradeVisible: false,
  overview: {},
  totalKcs: '',
  kycConfig: {},
  kycModalVisible: false,
  verifyStatus: '',
  kcsRights: [],
  loading: true,
  isLottieReady: false,
  showBottomButton: false,
};

function reducer(state, action) {
  const { payload = {} } = action;
  switch (action.type) {
    case 'update':
      return { ...state, ...payload };
    case 'reset':
      return { ...initState };
    default:
      return state;
  }
}

const KCS = () => {
  const timerRef = useRef(null);
  const contentRef = useRef(null);
  const dispatch = useDispatch();
  const { message } = useSnackbar();
  const [state, dispatchState] = useReducer(reducer, initState);
  const setState = (payload = {}) => {
    dispatchState({
      type: 'update',
      payload: payload,
    });
  };
  const {
    currentLevel,
    userLevel,
    ruleVisible,
    upgradeVisible,
    overview,
    totalKcs,
    kycConfig,
    kycModalVisible,
    verifyStatus,
    kcsRights,
    loading,
    isLottieReady,
    originalLevel,
    showBottomButton,
  } = state;
  const isLogin = useSelector((state) => state.user.isLogin);
  const { colors } = useTheme();
  const levelConfig =
    (isLogin && currentLevel > 0 ? levelConfigMap[currentLevel] : { color: colors.text }) || {};
  const isInApp = JsBridge.isApp();
  const { isRTL } = useLocale();

  const screens = useResponsive();
  const currentScreen = last(Object.keys(screens).filter((s) => !!screens[s]));

  const isSm = currentScreen === 'xs';
  const isMd = currentScreen === 'sm';
  const isLg = !isSm && !isMd;

  // app 内隐藏滚动条
  useHideScollBarInApp();

  // 获取 kcs 产品信息
  const getKcsOverview = async () => {
    try {
      const { data } = await getProductKCSOverview();
      // 兼容不支持的等级
      const _level = +data?.kcs_level || 1;
      const level = _level > totalLevel ? 0 : _level;
      const _sensors = window.sensors;
      _sensors.setProfile({ KCSLevel: level });
      if (level > 0) {
        setTimeout(() => {
          event.emit('updateLevel', level, { init: true });
        }, 10);
      }
      setState({
        overview: data,
        userLevel: level,
        currentLevel: level,
        loading: false,
        originalLevel: +data?.kcs_level || 0,
      });
    } catch (error) {
      setState({
        loading: false,
      });
      error?.msg && message.error(error.msg);
    }
  };

  // 监听登录成功事件
  useEffect(() => {
    if (isInApp) {
      window.onListenEvent('onLogin', () => {
        dispatch({
          type: 'app/initApp',
        });
      });

      // 调用onPageMount，击中离线包缓存
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      timerRef.current = setTimeout(() => {
        JsBridge.open({
          type: 'event',
          params: {
            name: 'onPageMount',
            dclTime: window.DCLTIME,
            pageType: window._useSSG ? 'SSG' : 'CSR', //'SSR|SSG|ISR|CSR'
          },
        });
      }, 300);

      return () => {
        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }
      };
    }
  }, [dispatch, isInApp]);

  useEffect(() => {
    // 获取kcs 权益
    const getRights = async () => {
      try {
        const { data } = await getKcsRights();
        setState({
          kcsRights: data.map((d) => ({
            ...d,
            kcsRightsMap: keyBy(d.kcsRights, 'level'),
          })),
        });
      } catch (error) {
        error?.msg && message.error(error.msg);
      }
    };
    getRights();
  }, []);

  useEffect(() => {
    if (isLogin) {
      // 用户kyc状态
      const getKycVerifyStatus = async () => {
        try {
          const { data } = await getKycStatus();
          setState({
            verifyStatus: data.verifyStatus,
          });
        } catch (error) {
          message.error(error.msg);
        }
      };
      // 获取kcs余额
      getTotalKcs();
      getKycVerifyStatus();
    }
    getKcsOverview();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, isLogin]);

  useEffect(() => {
    if (isInApp) {
      JsBridge.open({
        type: 'event',
        params: {
          name: 'updateHeader',
          background: '#000000',
          statusBarIsLightMode: false, // 状态栏文字颜色为白色
          visible: false,
        },
      });
      JsBridge.open({
        type: 'event',
        params: { name: 'updateBackgroundColor', color: '#121212' },
      });
      JsBridge.open({
        type: 'func',
        params: { name: 'enableBounces', isEnable: false },
      });
    }

    let sources = Array.from(
      new Set(
        Object.keys(levelConfigMap)
          .map((k) => [levelConfigMap[k].h5srcSource, levelConfigMap[k].srcSource])
          .flat(),
      ),
    );

    Promise.all(
      sources.map((source) =>
        fetch(`${__webpack_public_path__}${DEPLOY_PATH}/static/lottie/${source}.json`).then(
          async (res) => {
            const data = await res.json();
            return data;
          },
        ),
      ),
    )
      .then((values) => {
        sources.forEach((source, idx) => {
          lottieStore[source] = values[idx];
        });
        // 刷新lottie
        setState({
          isLottieReady: true,
        });
      })
      .catch((error) => {
        if (error.message) {
          sentry.captureEvent({
            message: `get lottie error:${error.message || ''}`,
            level: 'info',
            tags: {
              lottieError: 'lottieError',
            },
          });
        }
      });
  }, [isInApp]);

  const { run: debounceListener } = useDebounceFn(() => {
    const scrollTop =
      window.pageYOffset ?? document.documentElement.scrollTop ?? document.body.scrollTop;
    setState({
      showBottomButton: scrollTop > contentRef?.current?.offsetTop - (isInApp ? 40 : 84),
    });
  }, { wait: 10 });

  useEffect(() => {
    if (isSm) {
      setState({
        upgradeVisible: false,
      });
      // 监听滚动
      document.addEventListener('scroll', debounceListener);
      return () => {
        document.removeEventListener('scroll', debounceListener);
      };
    }
  }, [debounceListener, isSm]);

  const getTotalKcs = async () => {
    try {
      const {
        data: { total_balance: main_total_balance },
      } = await getAccountBalance({
        currency: 'KCS',
        type: 'MAIN',
      });
      const {
        data: { total_balance: trade_total_balance },
      } = await getAccountBalance({
        currency: 'KCS',
        type: 'TRADE',
      });
      setState({
        totalKcs: add(main_total_balance, trade_total_balance),
      });
    } catch (error) {
      message.error(error.msg);
    }
  };

  // kyc弹窗信息
  const getKycInfo = async () => {
    try {
      const { data } = await getKycConfig({ status: 'KYC_LIMIT' });
      setState({
        kycConfig: data,
      });
    } catch (error) {
      message.error(error.msg);
    }
  };

  // 切换等级
  const updateLevel = (l, forceUpdate = false) => {
    if (l === currentLevel && !forceUpdate) return;
    setState({
      currentLevel: l,
    });
  };

  /**
   * 去锁仓
   * 未登录: 去登录
   * 已登录：如果未做kyc，去做kyc，否则直接跳转到锁仓
   * */
  const goUpgradeHandle = () => {
    if (isLogin) {
      // verifyStatus 1 通过， -1 不通过，
      if (verifyStatus !== 1) {
        getKycInfo();
        setState({
          kycModalVisible: true,
        });
        return;
      } else {
        goLock(overview);
      }
    } else {
      goLogin();
    }
  };

  const ruleHandle = () => {
    const _ruleVisible = !ruleVisible;
    if (_ruleVisible) {
      sensors.trackClick(['rules', '1']);
    }
    setState({
      ruleVisible: _ruleVisible,
    });
  };

  const upgradeHandle = () => {
    const _upgradeVisible = !upgradeVisible;
    if (_upgradeVisible) {
      sensors.trackClick([`UpdateStrategy`, `1`], {
        kcs_level: userLevel,
        pagePosition: `${currentLevel}`,
        ...getScene(),
      });
    }
    setState({
      upgradeVisible: _upgradeVisible,
    });
  };

  const closeKycModal = () => {
    setState({
      kycModalVisible: false,
    });
  };

  const isLoading = isInApp && loading;

  return (
    <EmotionCacheProvider isRTL={isRTL}>
      <ThemeProvider theme="dark">
        <Context.Provider value={{ isSm, isMd, isLg, overview }}>
          <AppMeta />
          <main>
            <div>
              <SafeArea position="top" currentLevel={currentLevel} />
            </div>
            <AppHeader
              isInApp={isInApp}
              currentLevel={currentLevel}
              userLevel={userLevel}
              updateLevel={updateLevel}
              levelConfig={levelConfig}
              goUpgradeHandle={goUpgradeHandle}
              ruleHandle={ruleHandle}
              isLogin={isLogin}
              loading={isLoading}
              originalLevel={originalLevel}
            />
            {isLoading ? (
              <SkeletonLoading />
            ) : (
              <Fragment>
                <Banner
                  levelConfig={levelConfig}
                  currentLevel={currentLevel}
                  userLevel={userLevel}
                  updateLevel={updateLevel}
                  goUpgradeHandle={goUpgradeHandle}
                  isLogin={isLogin}
                  currentScreen={currentScreen}
                  ruleHandle={ruleHandle}
                  upgradeHandle={upgradeHandle}
                  isInApp={isInApp}
                  isLottieReady={isLottieReady}
                  originalLevel={originalLevel}
                />
                <Wrapper ref={contentRef} currentLevel={currentLevel}>
                  <Content currentLevel={currentLevel}>
                    <NoSSG>
                      <ExclusiveBenefits
                        currentScreen={currentScreen}
                        currentLevel={currentLevel}
                        userLevel={userLevel}
                        kcsRights={kcsRights}
                        goUpgradeHandle={goUpgradeHandle}
                        isLogin={isLogin}
                        originalLevel={originalLevel}
                        updateLevel={updateLevel}
                      />
                    </NoSSG>
                    <Staking
                      overview={overview}
                      totalKcs={totalKcs}
                      currentLevel={currentLevel}
                      userLevel={userLevel}
                      getTotalKcs={getTotalKcs}
                      isSm={isSm}
                      goUpgradeHandle={goUpgradeHandle}
                      isLogin={isLogin}
                      originalLevel={originalLevel}
                    />
                    <Eligibility currentLevel={currentLevel} />
                    <About isSm={isSm} currentLevel={currentLevel} />
                    <BottomButton
                      currentLevel={currentLevel}
                      userLevel={userLevel}
                      goUpgradeHandle={goUpgradeHandle}
                      isLogin={isLogin}
                      showBottomButton={showBottomButton}
                      originalLevel={originalLevel}
                    />
                  </Content>
                </Wrapper>
              </Fragment>
            )}
            <UpgradeModal
              currentLevel={currentLevel}
              userLevel={userLevel}
              upgradeHandle={upgradeHandle}
              currentScreen={currentScreen}
              upgradeVisible={upgradeVisible}
              goUpgradeHandle={goUpgradeHandle}
            />
            <RuleModal
              currentScreen={currentScreen}
              ruleVisible={ruleVisible}
              ruleHandle={ruleHandle}
            />
            <KycModal
              kycConfig={kycConfig}
              kycModalVisible={kycModalVisible}
              onCancel={closeKycModal}
            />
            <GlobalTransferScope />
          </main>
        </Context.Provider>
      </ThemeProvider>
      <Global
        styles={css`
          html {
            min-height: 100vh;
            background: #121212;
          }
        `}
      />
    </EmotionCacheProvider>
  );
};
export default KCS;
