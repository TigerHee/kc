/**
 * Owner: iron@kupotech.com
 */
import React, { useEffect, useState, useRef, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useResponsive, useTheme, ResizeObserver } from '@kux/mui';
import { queryPersistence } from '@kc/gbiz-base/lib/QueryPersistence';
import { includes } from 'lodash';
import { ICMenuOutlined } from '@kux/icons';
import storage from '@utils/storage';
import { exposeGbizStateForSSG } from '@tools/exposeGbizStateForSSG';
import throttle from 'lodash/throttle';
import { CompliantBox } from '@packages/compliantCenter';
import HeadRoom from './HeadRoom';
import NavLink from './Nav/Nav';
import NavUser from './NavUser';
import { filterNavUserMenuByBrandSite } from './NavUser/const';
import SearchBox from './SearchBox';
import { namespace as headerModal } from './model';
import MenuDrawer from './MenuDrawer';
import I18nDrawer from './I18nDrawer';
import EntranceTab from './EntranceTab';
import {
  checkIsSub,
  gaClickNew,
  getGaElement,
  kcsensorsClick,
  isSSG,
  isMobileSSG,
  addLangToPath,
  checkIfIsStandAlone,
  kcsensorsManualTrack,
  raf,
  NoSSG,
} from '../common/tools';
import {
  Nav,
  Links,
  NavUserDom,
  LogoLink,
  LogoImg,
  UnionBox,
  MenuBox,
  NavLinks,
  NavLinksWrapper,
  Root,
  NavBar,
  HeaderNavLoadingMask,
} from './styled';
import { WITHOUT_QUERY_PARAM, LOGO } from './config';
import useVariablesCheck from '../hookTool/useVariablesCheck';
import { tenantConfig } from '../tenantConfig';
import Skeleton from '../components/Skeleton';
import unionIconSrc from '../../static/inviter/union_icon.svg';
import unionIconDarkSrc from '../../static/inviter/union_icon_dark.svg';

const SearchBoxWidth = 170; // 搜索框宽度
const DEFAULT_BLANK_OFFSET = 72 + (tenantConfig.showSearchBox ? 0 : SearchBoxWidth); // 不展示搜索框，导致宽度计算不一致，需要加上搜索框宽度170
// 设置最小安全距离，这个是上面几个距离缩小到最小算出来的，防止setState++疯狂死循环
const WINDOW_MIN_WIDTH = 320;

const regexHeader = /headers\d/;
const headerGa = (e) => {
  // 捕获冒泡，统一上报，后续上报新标准统一了再统一处理
  const { target } = e;
  if (target) {
    let useNode = null;
    if (target.getAttribute('data-modid')) {
      useNode = target;
    } else {
      useNode = getGaElement(target, 'data-ga');
    }
    if (useNode) {
      const modid = useNode.getAttribute('data-modid') || '';
      const idx = useNode.getAttribute('data-idx') || 0;
      if (modid) {
        // 可上报新格式
        const map = {
          siteid: 'kucoinWeb',
          pageid: 'homepage',
          modid,
          eleid: Number(idx),
        };
        if (regexHeader.test(modid)) {
          // 头部导航需要上报id
          const id = useNode.getAttribute('data-ga') || '';
          map.id = id;
        }
        gaClickNew('eleClickCollectionV1', map);
        if (includes(['person', 'assets', 'orders', 'appDowload'], modid)) {
          kcsensorsClick([modid, String(idx || 1)]);
        }
      }
    }
  }
};

export default (props) => {
  const {
    theme: themeType, // light dark
    mainTheme,
    onThemeChange,
    transparent,
    currentLang,
    KUCOIN_HOST, // kucoin主站地址
    TRADE_HOST, // 交易地址
    KUMEX_HOST, // kumex地址
    KUMEX_BASIC_HOST, // KuMEX简约版地址
    SANDBOX_HOST, // 沙盒地址
    FASTCOIN_HOST, // 一键买币地址
    MAINSITE_API_HOST, // kucoin主站API地址
    POOLX_HOST, // pool-x地址
    KUCOIN_HOST_CHINA, //  kucoin国内站地址
    LANDING_HOST, // 流量落地页地址
    userInfo = {},
    // header顶部需要动态插入的内容
    topInsertRender,
    renderLogoSuffix,
    menuConfig,
    miniMode = false, // 是否是迷你导航模式（在交易页面使用）， 正常导航：常规高度80px，h5:64px  mini导航常规高度56px，h5:48px
    inTrade = false,
    customLogin, // customLogin: () => {} // 自定义登录动作，需要g-biz把登录操作放出来
    simplify = false, // 最简化header，为true后只保留登录注册按钮
    drawKeepMounted = true,
    restrictNoticeStayDuration,
    showWeb3EntranceTab = true, // 是否展示 Web3 切换控件，默认展示
    // 合伙人侧需要自定义LOGO
    brandLogoUrl,
  } = props;
  const theme = useTheme();
  const isSub = checkIsSub(userInfo);
  const rv = useResponsive();
  const dispatch = useDispatch();
  const [showMenuDrawer, setShowMenuDrawer] = useState(false);
  const [showI18nDrawer, setShowI18nDrawer] = useState(false);
  const [isNav, setIsNav] = useState(false);
  const [showNavMask, setShowNavMask] = useState(() => {
    // 当前【租户】支持渲染 WEB3 入口
    // 不是【移动端SSG 生成】
    // 不是【简洁】模式
    // 不是 props 控制不展示【Web3】控件
    // 最终 则渲染菜单栏蒙层
    return tenantConfig.showWeb3EntranceTab && !isMobileSSG && !simplify && showWeb3EntranceTab;
  });
  const [i18nType, setI18nType] = useState('lang');
  const [status, setStatus] = useState(0); // 0 - 5
  const [triggerMutation, setTriggerMutation] = useState(0);
  const isStandAlone = checkIfIsStandAlone();
  const navLinksRef = useRef(null);
  const navUserRef = useRef(null);
  const navInviterRef = useRef(null);
  const cacheWidthsRef = useRef([]);
  useVariablesCheck();
  const { data: inviterInfo } = useSelector((state) => state.$entrance_signUp?.inviter) || {};

  const hostConfig = {
    KUCOIN_HOST,
    TRADE_HOST,
    KUMEX_HOST,
    SANDBOX_HOST,
    MAINSITE_API_HOST,
    FASTCOIN_HOST,
    KUMEX_BASIC_HOST,
    POOLX_HOST,
    KUCOIN_HOST_CHINA,
    LANDING_HOST,
  };
  const maintenanceConfig = {
    pathname: props.pathname,
    maintenance: props.maintenance,
    maintainancePath: props.maintainancePath,
    showMaintenance: props.showMaintenance,
    onCloseMaintenance: props.onCloseMaintenance,
  };

  const filteredMenuConfig = filterNavUserMenuByBrandSite(menuConfig);

  const handleShowDrawer = (type, state, i18nTp) => {
    if (type === 'menu') {
      setIsNav(true);
      setShowMenuDrawer(state);
    } else if (type === 'i18n') {
      setShowI18nDrawer(state);
      i18nTp && setI18nType(i18nTp);
    } else if (type === 'user') {
      setIsNav(false);
      setShowMenuDrawer(state);
    }
  };

  useEffect(() => {
    dispatch({ type: `${headerModal}/pullLangList` });
  }, [dispatch]);

  useEffect(() => {
    if (status === 1) {
      setShowI18nDrawer(false);
      setShowMenuDrawer(false);
    }
  }, [status]);

  useEffect(() => {
    exposeGbizStateForSSG((dvaState, commonState) => {
      const state = dvaState[headerModal];
      commonState[headerModal] = {
        navList: state.navList || [],
        showNewbieNav: state.showNewbieNav || false,
      };
    });
  }, []);

  useEffect(() => {
    let observer = null;
    let handleResize = null;

    function autoTriggerResponsive() {
      const navLinks = navLinksRef.current;
      const navUser = navUserRef.current;
      const navInviter = navInviterRef.current;

      const calculateWidth = () => {
        const _width =
          navLinks.offsetWidth +
          navUser.offsetWidth +
          navInviter.offsetWidth +
          DEFAULT_BLANK_OFFSET;
        return _width;
      };

      const checkAndUpdateWidth = () => {
        const _width = calculateWidth();
        if (_width >= window.innerWidth && _width >= WINDOW_MIN_WIDTH) {
          cacheWidthsRef.current.push(_width);
          setStatus((v) => v + 1);
          cacheWidthsRef.current = Array.from(new Set(cacheWidthsRef.current));
        } else if (cacheWidthsRef.current.length) {
          const lastWidth = cacheWidthsRef.current.slice(-1);
          if (lastWidth[0] < window.innerWidth) {
            cacheWidthsRef.current.pop();
            setStatus((v) => (v === 0 ? 0 : v - 1));
          }
        }
      };

      observer = new MutationObserver(() => {
        raf(checkAndUpdateWidth);
      });

      observer.observe(navLinks, {
        attributes: true,
        childList: true,
        subtree: true,
        characterData: true,
      });
      observer.observe(navUser, {
        attributes: true,
        childList: true,
        subtree: true,
        characterData: true,
      });
      observer.observe(navInviter, {
        attributes: true,
        childList: true,
        subtree: true,
        characterData: true,
      });
    }

    if (isMobileSSG) {
      setStatus(4);
    } else if (isSSG) {
      setStatus(0);
    } else {
      autoTriggerResponsive();
      setTriggerMutation(window.innerWidth);
      handleResize = throttle(() => {
        setTriggerMutation(window.innerWidth);
      }, 500);
      window.addEventListener('resize', handleResize);
    }

    return () => {
      if (observer) observer.disconnect();
      if (handleResize) window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    // pwa 曝光上报，在pwa里面才有该逻辑
    if (isStandAlone) {
      // 是否已上报过
      const pwaManualTrack = storage.getItem('__pwa_ManualTrack__');
      if (!pwaManualTrack) {
        kcsensorsManualTrack(['pwaInStandAlone', '4']);
        storage.setItem('__pwa_ManualTrack__', true);
      }
    }
  }, [isStandAlone]);

  // 计算是否渲染【导航栏蒙层】
  const showNavMaskMemo = useMemo(() => {
    const renderEntranceTab = !userInfo ? status < 4 : status < 5;
    // showWeb3EntranceTab：且当前业务的 props 可以渲染 Web3 切换控件
    // renderEntranceTab：当前界面大小是否可以渲染 Web3 切换控件
    // showNavMask：当前是否渲染蒙层
    // simplify: 简洁模式

    // 含义：可以渲染蒙层，
    //  1. 界面大小可以渲染，
    //  2. 而且业务的props 可以渲染，
    //  3. 租户可以渲染，
    //  4. 非简洁模式，
    // 则才出现「导航栏蒙层」
    // 因为：【web3 控件】的出现会引起【导航栏结构抖动】，因此才出现蒙层
    return showNavMask && showWeb3EntranceTab && renderEntranceTab && !simplify;
  }, [showNavMask, userInfo, status, showWeb3EntranceTab, simplify]);

  const onResize = throttle(({ height }) => {
    dispatch({
      type: `${headerModal}/updateHeaderHeight`,
      payload: { headerHeight: height },
    });
  }, 500);

  return (
    <>
      <Root className="gbiz-Header">
        <HeadRoom
          transparent={transparent}
          theme={themeType}
          {...maintenanceConfig}
          topInsertRender={topInsertRender}
          miniMode={miniMode}
          userInfo={userInfo}
          currentLang={currentLang}
          restrictNoticeStayDuration={restrictNoticeStayDuration}
        >
          <Nav onClick={headerGa} className="Header-Nav" inTrade={inTrade}>
            {/* onResize 被调用时入参，是根据「NavBar」的 CSS 计算值来进行控制传入 */}
            <ResizeObserver onResize={onResize}>
              <NavBar miniMode={miniMode} inTrade={inTrade}>
                <NavLinksWrapper id="hook_nav_links" ref={navLinksRef}>
                  {showNavMaskMemo && (
                    <HeaderNavLoadingMask>
                      <Skeleton width="80px" height="20px" />
                      <Skeleton width="80px" height="20px" />
                      <Skeleton width="80px" height="20px" />
                      <Skeleton width="80px" height="20px" />
                      <Skeleton width="80px" height="20px" />
                      <Skeleton width="80px" height="20px" />
                    </HeaderNavLoadingMask>
                  )}
                  <Links>
                    <LogoLink
                      href={addLangToPath(
                        queryPersistence.formatUrlWithStore(`${KUCOIN_HOST}`, WITHOUT_QUERY_PARAM),
                        currentLang,
                      )}
                      aria-label="Kucoin logo (header)"
                      onClick={() => {
                        kcsensorsClick(['navigationLogo', '1'], {
                          pagecate: 'navigationLogo',
                        });
                      }}
                      data-inspector="inspector_header_logo"
                    >
                      <LogoImg
                        src={brandLogoUrl || window?._BRAND_LOGO_ || LOGO}
                        alt={window?._BRAND_NAME_ || 'KuCoin'}
                      />
                    </LogoLink>

                    {!simplify && (
                      <>
                        {renderLogoSuffix && renderLogoSuffix()}
                        {(!userInfo ? status < 4 : status < 5) && (
                          <>
                            {showWeb3EntranceTab && tenantConfig.showWeb3EntranceTab && (
                              <NoSSG>
                                <EntranceTab
                                  ml={6}
                                  mr={6}
                                  lang={currentLang}
                                  onInitFinishHandle={() => {
                                    setShowNavMask(false);
                                  }}
                                />
                              </NoSSG>
                            )}
                            <NavLinks id="hook_nav_link" data-lang={currentLang}>
                              <NavLink
                                {...props}
                                hostConfig={hostConfig}
                                isSub={isSub}
                                navStatus={status}
                              />
                            </NavLinks>
                          </>
                        )}
                      </>
                    )}
                  </Links>
                  {!simplify && (
                    <>
                      {status < 3 && tenantConfig.showSearchBox && (
                        <SearchBox
                          id="hook_nav_search"
                          lang={currentLang}
                          miniMode={miniMode}
                          inTrade={inTrade}
                        />
                      )}
                      {/* 注意：该行用于触发header响应式计算，不能删除！ */}
                      <div className={`_nav_status_${triggerMutation}_`} />
                    </>
                  )}
                </NavLinksWrapper>
                <UnionBox show={!!inviterInfo} ref={navInviterRef}>
                  <img
                    src={theme.currentTheme === 'dark' ? unionIconDarkSrc : unionIconSrc}
                    alt="union-icon"
                  />
                  <span>{inviterInfo?.nickname}</span>
                </UnionBox>
                <NavUserDom
                  id="hook_nav_user"
                  ref={navUserRef}
                  data-status={isSSG ? status : 'none'}
                >
                  <NavUser
                    {...props}
                    menuConfig={filteredMenuConfig}
                    hostConfig={hostConfig}
                    isSub={isSub}
                    handleShowDrawer={handleShowDrawer}
                    navStatus={status}
                    inTrade={inTrade}
                    onThemeChange={onThemeChange}
                    mainTheme={mainTheme}
                    customLogin={customLogin}
                  />
                  <MenuBox
                    data-lang={currentLang}
                    status={status}
                    className="MenuBox"
                    inTrade={inTrade}
                    onClick={() => handleShowDrawer('menu', true)}
                  >
                    <ICMenuOutlined
                      size={!rv.sm || inTrade ? 16 : 20}
                      color={theme.colors.text}
                      style={{ cursor: 'pointer' }}
                    />
                  </MenuBox>
                </NavUserDom>
              </NavBar>
            </ResizeObserver>
          </Nav>
        </HeadRoom>
      </Root>
      <MenuDrawer
        rv={rv}
        show={showMenuDrawer}
        keepMounted={drawKeepMounted}
        onClose={() => handleShowDrawer('menu', false)}
        {...props}
        menuConfig={filteredMenuConfig}
        hostConfig={hostConfig}
        isSub={isSub}
        handleShowDrawer={handleShowDrawer}
        isNav={isNav}
        navStatus={status}
        inTrade={inTrade}
        onThemeChange={onThemeChange}
        mainTheme={mainTheme}
        showWeb3EntranceTab={showWeb3EntranceTab}
      />
      <I18nDrawer
        show={showI18nDrawer}
        keepMounted={drawKeepMounted}
        onClose={() => handleShowDrawer('i18n', false)}
        {...props}
        hostConfig={hostConfig}
        isSub={isSub}
        type={i18nType}
        theme={themeType}
        mainTheme={mainTheme}
      />
      {/* 用于初始化合规接口数据拉取 */}
      <CompliantBox userInfo={userInfo} spm="_placeholder_" />
    </>
  );
};
