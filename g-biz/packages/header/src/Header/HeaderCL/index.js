/**
 * Owner: iron@kupotech.com
 */
import React, { useEffect, useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { queryPersistence } from '@kc/gbiz-base/lib/QueryPersistence';
import { includes } from 'lodash';
import { ICMenuOutlined } from '@kux/icons';
import { useResponsive, useTheme, styled, Divider } from '@kux/mui';
import { exposeGbizStateForSSG } from '@tools/exposeGbizStateForSSG';
import { useTranslation } from '@tools/i18n';
import throttle from 'lodash/throttle';
import HeadRoom from './HeadRoom';
import NavUser from './NavUser';
import { namespace as headerModal } from '../model';
import MenuDrawer from './MenuDrawer';
import I18nDrawer from '../I18nDrawer';
import {
  gaClickNew,
  getGaElement,
  kcsensorsClick,
  addLangToPath,
  isSSG,
  isMobileSSG,
  raf,
} from '../../common/tools';
import {
  Nav,
  Links,
  NavUserDom,
  LogoLink,
  LogoImg,
  NavLinksWrapper,
  Root,
  NavBar,
  MenuBox,
} from '../styled';
import { WITHOUT_QUERY_PARAM, LOGO } from '../config';
import useVariablesCheck from '../../hookTool/useVariablesCheck';

const SimplifyLogoDivider = styled(Divider)`
  background: ${(props) => props.theme.colors.primary};
  opacity: 0.4;
  font-size: 21px;
  margin: ${(props) => (props.theme.breakpoints.down('sm') ? '0 8px' : '0 20px')};
`;

const SimplifyLogoSuffixContent = styled.span`
  color: ${(props) => props.theme.colors.primary};
  font-size: ${(props) => (props.theme.breakpoints.down('sm') ? '20px' : '22px')};
  font-style: normal;
  font-weight: 600;
  line-height: 120%;
`;

const DEFAULT_BLANK_OFFSET = 72 + 170; // 不展示搜索框，导致宽度计算不一致，需要加上搜索框宽度170
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
    userInfo = {},
    restrictNoticeStayDuration,
  } = props;
  const theme = useTheme();
  const rv = useResponsive();
  const dispatch = useDispatch();
  const navLinksRef = useRef(null);
  const navUserRef = useRef(null);
  useVariablesCheck();
  const { t: _t } = useTranslation('header');
  const [status, setStatus] = useState(0); // 0 - 5
  const [triggerMutation, setTriggerMutation] = useState(0);
  const cacheWidthsRef = useRef([]);
  const [showMenuDrawer, setShowMenuDrawer] = useState(false);
  const [showI18nDrawer, setShowI18nDrawer] = useState(false);
  const [isNav, setIsNav] = useState(false);
  const [i18nType, setI18nType] = useState('lang');

  const maintenanceConfig = {
    pathname: props.pathname,
    maintenance: props.maintenance,
    maintainancePath: props.maintainancePath,
    showMaintenance: props.showMaintenance,
    onCloseMaintenance: props.onCloseMaintenance,
  };

  const handleShowDrawer = (type, state, i18nTp) => {
    // 打开菜单
    if (type === 'menu') {
      setIsNav(true);
      setShowMenuDrawer(state);
    } else if (type === 'i18n') {
      // 多语言
      setShowI18nDrawer(state);
      i18nTp && setI18nType(i18nTp);
    } else if (type === 'user') {
      // 用户
      setIsNav(false);
      setShowMenuDrawer(state);
    }
  };

  useEffect(() => {
    dispatch({ type: `${headerModal}/pullLangList` });
  }, [dispatch]);

  useEffect(() => {
    let observer = null;
    let handleResize = null;

    function autoTriggerResponsive() {
      const navLinks = navLinksRef.current;
      const navUser = navUserRef.current;

      const calculateWidth = () => {
        const _width = navLinks.offsetWidth + navUser.offsetWidth + DEFAULT_BLANK_OFFSET;
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
    };
  }, []);

  useEffect(() => {
    exposeGbizStateForSSG((dvaState, commonState) => {
      const state = dvaState[headerModal];
      commonState[headerModal] = {
        navList: state.navList || [],
        showNewbieNav: state.showNewbieNav || false,
      };
    });
  }, []);

  return (
    <>
      <Root className="gbiz-Header">
        <HeadRoom
          transparent={transparent}
          theme={themeType}
          {...maintenanceConfig}
          userInfo={userInfo}
          currentLang={currentLang}
          restrictNoticeStayDuration={restrictNoticeStayDuration}
        >
          <Nav onClick={headerGa} className="Header-Nav">
            <NavBar>
              <NavLinksWrapper id="hook_nav_links" ref={navLinksRef}>
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
                      src={window?._BRAND_LOGO_ || LOGO}
                      alt={window?._BRAND_NAME_ || 'KuCoin'}
                    />
                  </LogoLink>
                  {/* logo 后缀 */}
                  <SimplifyLogoDivider type="vertical" orientation="center" />
                  <SimplifyLogoSuffixContent>
                    {_t('b312de5446da4000a722')}
                  </SimplifyLogoSuffixContent>
                </Links>
                <>
                  {/* 注意：该行用于触发header响应式计算，不能删除！ */}
                  <div className={`_nav_status_${triggerMutation}_`} />
                </>
              </NavLinksWrapper>
              <NavUserDom id="hook_nav_user" ref={navUserRef} data-status={isSSG ? status : 'none'}>
                <NavUser
                  {...props}
                  mainTheme={mainTheme}
                  onThemeChange={onThemeChange}
                  navStatus={status}
                />
                <MenuBox data-lang={currentLang} status={status} className="MenuBox">
                  <ICMenuOutlined
                    onClick={() => handleShowDrawer('menu', true)}
                    size={!rv.sm ? 16 : 20}
                    color={theme.colors.text}
                    style={{ cursor: 'pointer' }}
                  />
                </MenuBox>
              </NavUserDom>
            </NavBar>
          </Nav>
        </HeadRoom>
      </Root>
      <MenuDrawer
        rv={rv}
        show={showMenuDrawer}
        onClose={() => handleShowDrawer('menu', false)}
        {...props}
        handleShowDrawer={handleShowDrawer}
        isNav={isNav}
        navStatus={status}
        onThemeChange={onThemeChange}
        mainTheme={mainTheme}
      />
      <I18nDrawer
        show={showI18nDrawer}
        onClose={() => handleShowDrawer('i18n', false)}
        {...props}
        type={i18nType}
        theme={themeType}
        mainTheme={mainTheme}
      />
    </>
  );
};
