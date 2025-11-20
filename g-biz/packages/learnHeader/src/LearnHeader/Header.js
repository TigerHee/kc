/**
 * Owner: tom@kupotech.com
 */

import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { queryPersistence } from '@kc/gbiz-base/lib/QueryPersistence';
import { ICMenuOutlined, ICSearchOutlined } from '@kux/icons';
import { throttle } from 'lodash';
import { useTheme, ResizeObserver, useResponsive, useMediaQuery } from '@kux/mui';
import { ClassNames } from '@emotion/react';
import { exposeGbizStateForSSG } from '@tools/exposeGbizStateForSSG';
import clsx from 'clsx';
import Headroom from './HeadRoom';
import NavLink from './Nav/Nav';
import NavUser from './NavUser';
import { namespace as headerModal } from './model';
import MenuDrawer from './MenuDrawer';
import I18nDrawer from './I18nDrawer';
import { checkIsSub, addLangToPath } from '../common/tools';
import { Nav, Links, NavUserDom, LogoLink, MenuBox, NavLinks, MenuDivider, Search } from './styled';
import { WITHOUT_QUERY_PARAM, CONTAINER_HEIGHT } from './config';
import { useLang } from '../hookTool';
import logoSrc from '../static/learn_logo.svg';

// app访问界面，隐藏header
const useStyles = () => {
  return {
    root: `
      position: relative;
      z-index: 100;
      width: 100%;
      & .logo {
        vertical-align: middle;
      }
    `,
    navbar: `
      width: 100%;
      height: ${CONTAINER_HEIGHT.common.max}px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      @media screen and (max-width: 768px) {
        height: ${CONTAINER_HEIGHT.common.min}px;
      }
    `,
    headerStart: `
      position: relative;
      flex: auto;
      transition: all 0.3s;
    `,
    logo: `
      height: 31px;
    `,
  };
};
export default (props) => {
  const {
    theme: themeType, // light dark
    currentLang,
    userInfo = {},
    KUCOIN_HOST, // kucoin主站地址
    TRADE_HOST,
    KUMEX_HOST,
    SANDBOX_HOST,
    MAINSITE_API_HOST,
    FASTCOIN_HOST,
    KUMEX_BASIC_HOST,
    POOLX_HOST,
    KUCOIN_HOST_CHINA,
    LANDING_HOST,
  } = props;
  const theme = useTheme();
  const isPc = useMediaQuery('(min-width: 1025px)');
  const isSub = checkIsSub(userInfo);
  const rv = useResponsive();
  const classes = useStyles();
  const dispatch = useDispatch();
  const [showMenuDrawer, setShowMenuDrawer] = useState(false);
  const [showI18nDrawer, setShowI18nDrawer] = useState(false);
  const [i18nType, setI18nType] = useState('lang');
  const [showMenuIcon, setShowMenuIcon] = useState(false);
  const [infoWidth, setInfoWidth] = useState(0);
  const { t } = useLang();

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

  const handleShowDrawer = (type, state, i18nTp) => {
    if (type === 'menu' || type === 'user') {
      setShowMenuDrawer(state);
    } else if (type === 'i18n') {
      setShowI18nDrawer(state);
      i18nTp && setI18nType(i18nTp);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onResize = useCallback(
    throttle((size) => {
      if (isPc && !showMenuDrawer) {
        const infoElement = document.querySelector('#hook_nav_info');
        const userElement = document.querySelector('#hook_nav_user');
        const _infoWidth =
          infoWidth > infoElement.offsetWidth ? infoWidth : infoElement.offsetWidth;

        if (_infoWidth + userElement.offsetWidth > size.offsetWidth) {
          setInfoWidth(_infoWidth);
          setShowMenuIcon(true);
        } else {
          setShowMenuIcon(false);
          setShowMenuDrawer(false);
        }
      }
    }, 300),
    [infoWidth, isPc, showMenuDrawer],
  );

  useEffect(() => {
    dispatch({ type: `${headerModal}/pullLangList` });
    dispatch({
      type: `${headerModal}/getAllNavItems`,
      t,
    });
  }, [dispatch]);

  useEffect(() => {
    if (isPc) {
      setShowMenuDrawer(false);
      setShowI18nDrawer(false);
    }
  }, [isPc]);

  useEffect(() => {
    // TODO: 注入二期分类下拉菜单的数据
    exposeGbizStateForSSG((dvaState, commonState) => {
      const state = dvaState[headerModal];
      commonState[headerModal] = {
        classifyList: state.classifyList || [],
        topicList: state.topicList || [],
        crashCourseList: state.crashCourseList || [],
      };
    });
  }, []);

  return (
    <ClassNames>
      {({ css }) => (
        <header className={css(classes.header)}>
          <div className={`${css(classes.root)} gbiz-Header`}>
            <Headroom theme={themeType}>
              <Nav className="Header-Nav">
                <ResizeObserver onResize={onResize}>
                  <div className={clsx(css(classes.navbar), css(classes.headerStart))}>
                    <Links id="hook_nav_info">
                      <LogoLink
                        href={addLangToPath(
                          queryPersistence.formatUrlWithStore(
                            `${KUCOIN_HOST}/learn`,
                            WITHOUT_QUERY_PARAM,
                          ),
                          currentLang,
                        )}
                        aria-label="Kucoin logo (header)"
                      >
                        <div>
                          <img
                            src={logoSrc}
                            className={`logo ${css(classes.logo)}`}
                            alt="KuCoin Learn"
                          />
                        </div>
                      </LogoLink>

                      <NavLinks
                        id="hook_nav_link"
                        show={isPc && !showMenuIcon}
                        data-lang={currentLang}
                      >
                        <NavLink {...props} hostConfig={hostConfig} isSub={isSub} />
                      </NavLinks>
                    </Links>

                    <NavUserDom id="hook_nav_user" data-status="none">
                      <Search href={addLangToPath(`${KUCOIN_HOST}/learn/search`, currentLang)}>
                        <ICSearchOutlined size={rv.md ? 26 : 24} color="rgba(115, 126, 141, 1)" />
                      </Search>
                      <NavUser
                        {...props}
                        hostConfig={hostConfig}
                        isSub={isSub}
                        handleShowDrawer={handleShowDrawer}
                      />

                      <MenuBox
                        data-lang={currentLang}
                        show={!isPc || showMenuIcon}
                        className="MenuBox"
                      >
                        <MenuDivider type="vertical" color={theme.colors.divider4} />
                        <ICMenuOutlined
                          onClick={() => handleShowDrawer('menu', true)}
                          size={24}
                          color={theme.colors.icon}
                          style={{ cursor: 'pointer' }}
                        />
                      </MenuBox>
                    </NavUserDom>
                  </div>
                </ResizeObserver>
              </Nav>
            </Headroom>
          </div>
          <MenuDrawer
            rv={rv}
            show={showMenuDrawer}
            onClose={() => handleShowDrawer('menu', false)}
            {...props}
            hostConfig={hostConfig}
            isSub={isSub}
            handleShowDrawer={handleShowDrawer}
          />
          <I18nDrawer
            show={showI18nDrawer}
            onClose={() => handleShowDrawer('i18n', false)}
            {...props}
            hostConfig={hostConfig}
            isSub={isSub}
            type={i18nType}
            theme={themeType}
          />
        </header>
      )}
    </ClassNames>
  );
};
