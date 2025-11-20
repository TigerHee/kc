/**
 * Owner: iron@kupotech.com
 */
import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { debounce, useResponsive } from '@kux/design';
import ResizeObserver from '../components/ResizeObserver';
import { bootConfig } from 'kc-next/boot';
import { queryPersistence } from 'tools/base/QueryPersistence';
import { throttle, includes } from 'lodash-es';
import { ICMenuOutlined } from '@kux/icons';
import { IS_SSG_ENV, IS_MOBILE_SSG_ENV, IS_CLIENT_ENV } from 'kc-next/env';
import storage from 'tools/storage';
import addLangToPath from 'tools/addLangToPath';
import { CompliantBox } from 'packages/compliantCenter';
import HeadRoom from './HeadRoom';
import NavLink from './Nav/Nav';
import NavUser from './NavUser';
import { filterNavUserMenuByBrandSite } from './NavUser/const';
import SearchBox from './SearchBox';
import MenuDrawer from './MenuDrawer';
import I18nDrawer from './I18nDrawer';
import EntranceTab from './EntranceTab';
import {
  checkIsSub,
  gaClickNew,
  getGaElement,
  kcsensorsClick,
  checkIfIsStandAlone,
  kcsensorsManualTrack,
  NoSSG,
} from '../common/tools';
import styles from './styles.module.scss';
import { WITHOUT_QUERY_PARAM, LOGO } from './config';
import useVariablesCheck from '../hookTool/useVariablesCheck';
import { useTenantConfig } from '../tenantConfig';
import Skeleton from '../components/Skeleton';
import clsx from 'clsx';
import unionIconSrc from '../static/inviter/union_icon.svg';
import unionIconDarkSrc from '../static/inviter/union_icon_dark.svg';
import { useHeaderStore } from './model';
import HorizontalScrollContainer from '../components/HorizonTalScrollContainer';
import useIsH5 from '../hookTool/useIsH5';

// 设置最小安全距离，这个是上面几个距离缩小到最小算出来的，防止setState++疯狂死循环
const WINDOW_MIN_WIDTH = 320;

// 2边间距 24 * 2 + (左菜单 <-> 右用户) 间距 20 = 76
const DEFAULT_GAPS = 24 * 2 + 20;

const regexHeader = /headers\d/;
const headerGa = e => {
  // 捕获冒泡，统一上报，后续上报新标准统一了再统一处理
  const { target } = e;
  if (target) {
    let useNode: HTMLElement | null = null;
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
        } as any;
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

export default props => {
  const {
    theme: themeType, // light dark
    platform,
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

  const IS_H5 = useIsH5();

  const tenantConfig = useTenantConfig();
  const isSub = checkIsSub(userInfo);
  const isLogin = userInfo ? userInfo.uid : false;
  const rv = useResponsive();
  const [showMenuDrawer, setShowMenuDrawer] = useState(false);
  const [showI18nDrawer, setShowI18nDrawer] = useState(false);
  const [isNav, setIsNav] = useState(false);
  const [showNavMask, setShowNavMask] = useState(() => {
    // 当前【租户】支持渲染 WEB3 入口
    // 不是【移动端SSG 生成】
    // 不是【简洁】模式
    // 不是 props 控制不展示【Web3】控件
    // 最终 则渲染菜单栏蒙层
    return tenantConfig.showWeb3EntranceTab && !IS_MOBILE_SSG_ENV && !simplify && showWeb3EntranceTab;
  });
  const [i18nType, setI18nType] = useState('lang');
  const [computedStatus, setStatus] = useState(IS_H5 ? 4 : 0); // 0 - 4
  const [triggerMutation, setTriggerMutation] = useState(0);
  const isStandAlone = checkIfIsStandAlone();
  const navLinksRef = useRef<HTMLDivElement | null>(null);
  const navUserRef = useRef<HTMLDivElement | null>(null);
  const cacheWidthsRef = useRef<number[]>([]);
  useVariablesCheck();
  const inviterInfo = useHeaderStore(state => state.inviter);

  // 有些项目传进来的 props.pathname 是固定的，也有些没传，所以不能完全信任
  const pathnameFromUrl = IS_CLIENT_ENV ? window.location.pathname : (props.pathname || '');
  // 澳洲站，如果 url 包含 futures，则展示 Powered by 文案
  const showPoweredByText = useMemo(() => {
    if (tenantConfig.futuresPoweredBy && pathnameFromUrl.split('/').includes('futures')) {
      return tenantConfig.futuresPoweredBy;
    } else {
      return false;
    }
  }, [tenantConfig.futuresPoweredBy, pathnameFromUrl]);

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

  const handleShowDrawer = (type: string, state: boolean, i18nTp?: string) => {
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

  // 注意：依赖 status 的副作用需在 status 定义之后再声明

  // 回退：使用最初的 MutationObserver 逻辑，辅以 clamp 与 rAF
  useEffect(() => {
    let observer: MutationObserver | null = null;
    let handleResize: EventListenerOrEventListenerObject | null = null;
    function autoTriggerResponsive() {
      const navLinks: HTMLDivElement = navLinksRef.current as HTMLDivElement;
      const navUser: HTMLDivElement = navUserRef.current as HTMLDivElement;
      const calculateWidth = () => {
        const _width = navLinks.offsetWidth + navUser.offsetWidth + DEFAULT_GAPS;
        return _width;
      };
      const checkAndUpdateWidth = () => {
        const _width = calculateWidth();
        if (_width > window.innerWidth && _width > WINDOW_MIN_WIDTH) {
          cacheWidthsRef.current.push(_width);
          cacheWidthsRef.current = Array.from(new Set(cacheWidthsRef.current));
          // clamp 上限 4
          setStatus(v => (v + 1 > 4 ? 4 : v + 1));
        } else if (cacheWidthsRef.current.length) {
          const lastWidth = cacheWidthsRef.current.slice(-1);
          if (lastWidth[0] < window.innerWidth) {
            cacheWidthsRef.current.pop();
            // clamp 下限 0
            setStatus(v => (v - 1 < 0 ? 0 : v - 1));
          }
        }
      };
      observer = new MutationObserver(() => {
        requestAnimationFrame(checkAndUpdateWidth);
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
    }
    if (IS_H5) return;
    if (IS_SSG_ENV) {
      setStatus(0);
      return;
    }
    autoTriggerResponsive();
    setTriggerMutation(window.innerWidth);
    handleResize = debounce(() => {
      setTriggerMutation(window.innerWidth);
    }, 150);
    window.addEventListener('resize', handleResize!);

    return () => {
      if (observer) observer.disconnect();
      if (handleResize) window.removeEventListener('resize', handleResize);
    };
  }, [IS_H5]);

  useEffect(() => {
    // pwa 曝光上报，在pwa里面才有该逻辑
    if (isStandAlone) {
      // 是否已上报过
      const pwaManualTrack = storage.getItem('__pwa_ManualTrack__');
      if (!pwaManualTrack) {
        kcsensorsManualTrack(['pwaInStandAlone', '4']);
        storage.setItem('__pwa_ManualTrack__', 'true');
      }
    }
  }, [isStandAlone]);

  // 计算是否渲染【导航栏蒙层】(skeleton动画)
  const showNavMaskMemo = useMemo(() => {
    const renderEntranceTab = isLogin ? computedStatus < 3 : computedStatus < 2;
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
  }, [showNavMask, isLogin, computedStatus, showWeb3EntranceTab, simplify]);

  const updateHeaderHeight = useHeaderStore(state => state.updateHeaderHeight);

  useEffect(() => {
    if (inTrade) {
      updateHeaderHeight?.({ headerHeight: 48 });
    }
  }, [inTrade]);

  const onResize = useCallback(
    throttle(({ height }) => {
      updateHeaderHeight?.({ headerHeight: height });
    }, 500),
    []
  );

  return (
    <>
      <header className={clsx(styles.Root, 'gbiz-Header')} data-theme={props.theme}>
        <HeadRoom
          {...maintenanceConfig}
          topInsertRender={topInsertRender}
          miniMode={miniMode}
          userInfo={userInfo}
          currentLang={currentLang}
          restrictNoticeStayDuration={restrictNoticeStayDuration}
        >
          <div onClick={headerGa} className={clsx('Header-Nav', styles.Nav)}>
            {/* onResize 被调用时入参，是根据「NavBar」的 CSS 计算值来进行控制传入 */}
            <ResizeObserver onResize={onResize}>
              <div
                className={clsx(styles.NavBar, {
                  [styles.NavBarMiniMode]: miniMode,
                  [styles.NavBarInTrade]: inTrade,
                })}
              >
                <div className={styles.NavLinksWrapper} id="hook_nav_links" ref={navLinksRef}>
                  {showNavMaskMemo && (
                    <div className={styles.HeaderNavLoadingMask}>
                      <Skeleton />
                      <Skeleton />
                      <Skeleton />
                      <Skeleton />
                      <Skeleton />
                      <Skeleton />
                    </div>
                  )}
                  <div className={styles.Links}>
                    <a
                      className={styles.LogoLink}
                      href={addLangToPath(queryPersistence.formatUrlWithStore(`${KUCOIN_HOST}`, WITHOUT_QUERY_PARAM))}
                      aria-label="Kucoin logo (header)"
                      onClick={() => {
                        kcsensorsClick(['navigationLogo', '1'], {
                          pagecate: 'navigationLogo',
                        });
                      }}
                      data-inspector="inspector_header_logo"
                    >
                      <>
                        <img
                          className={styles.LogoImg}
                          src={brandLogoUrl || bootConfig._BRAND_LOGO_ || LOGO}
                          alt={bootConfig._BRAND_NAME_ || 'KuCoin'}
                        />
                        {showPoweredByText && <span className={styles.PoweredByText}>{showPoweredByText}</span>}
                      </>
                    </a>

                    {/* 目前确定只有 simplify 模式下才会出现邀请信息 */}
                    <div className={styles.UnionBox} style={{ display: inviterInfo ? 'flex' : 'none' }}>
                      <img src={themeType === 'dark' ? unionIconDarkSrc : unionIconSrc} alt="union-icon" />
                      <span>{inviterInfo?.nickname}</span>
                    </div>

                    {!simplify && (
                      <>
                        {renderLogoSuffix && renderLogoSuffix()}
                        {(isLogin ? computedStatus < 3 : computedStatus < 2) && (
                          <>
                            {showWeb3EntranceTab && tenantConfig.showWeb3EntranceTab && (
                              <NoSSG>
                                <EntranceTab
                                  lang={currentLang}
                                  onInitFinishHandle={() => {
                                    setShowNavMask(false);
                                  }}
                                />
                              </NoSSG>
                            )}
                            <HorizontalScrollContainer
                              id="hook_nav_link"
                              data-lang={currentLang}
                              scrollDisable={isLogin ? computedStatus < 2 : computedStatus < 1}
                            >
                              <NavLink {...props} hostConfig={hostConfig} isSub={isSub} />
                            </HorizontalScrollContainer>
                          </>
                        )}
                      </>
                    )}
                  </div>
                  {/* 注意：该行用于触发header响应式计算，不能删除！ */}
                  <div className={`_nav_status_${triggerMutation}_`} />
                </div>

                <div
                  className={styles.NavUserDom}
                  id="hook_nav_user"
                  ref={navUserRef}
                  data-status={IS_SSG_ENV ? computedStatus : 'none'}
                >
                  <NavUser
                    {...props}
                    isLogin={isLogin}
                    menuConfig={filteredMenuConfig}
                    hostConfig={hostConfig}
                    isSub={isSub}
                    handleShowDrawer={handleShowDrawer}
                    navStatus={computedStatus}
                    inTrade={inTrade}
                    onThemeChange={onThemeChange}
                    customLogin={customLogin}
                  />
                  <div
                    data-lang={currentLang}
                    style={{ display: computedStatus !== 0 ? 'flex' : 'none' }}
                    className={clsx('MenuBox', styles.MenuBox, { inTrade })}
                    onClick={() => handleShowDrawer('menu', true)}
                  >
                    <ICMenuOutlined
                      size={16}
                      color={themeType === 'dark' ? '#fff' : '#000'}
                      style={{ cursor: 'pointer' }}
                    />
                  </div>
                </div>

                <div className={styles.borderBottom} />
              </div>
            </ResizeObserver>
          </div>
        </HeadRoom>
      </header>
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
        navStatus={computedStatus}
        inTrade={inTrade}
        onThemeChange={onThemeChange}
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
      />
      {/* 用于初始化合规接口数据拉取 */}
      <CompliantBox spm="_placeholder_" />
    </>
  );
};
