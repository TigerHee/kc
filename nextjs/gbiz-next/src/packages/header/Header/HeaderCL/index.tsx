/**
 * Owner: iron@kupotech.com
 */
import React, { useEffect, useState, useRef, FC } from 'react';
import clsx from 'clsx';
import { queryPersistence } from 'tools/base/QueryPersistence';
import { includes } from 'lodash-es';
import { MenuIcon } from '@kux/iconpack';
import { useResponsive, Divider } from '@kux/design';
import { IS_SSG_ENV, IS_MOBILE_SSG_ENV } from 'kc-next/env';
import { useTranslation } from 'tools/i18n';
import addLangToPath from 'tools/addLangToPath';
import HeadRoom from './HeadRoom';
import NavUser from './NavUser';
import MenuDrawer from './MenuDrawer';
import I18nDrawer from '../I18nDrawer';
import { gaClickNew, getGaElement, kcsensorsClick } from '../../common/tools';
import { WITHOUT_QUERY_PARAM, LOGO } from '../config';
import useVariablesCheck from '../../hookTool/useVariablesCheck';
import { useHeaderStore } from '../model';
import { bootConfig } from 'kc-next/boot';
import headerStyles from '../styles.module.scss';
import styles from './styles.module.scss';

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
        const map: {
          siteid: string;
          pageid: string;
          modid: string;
          eleid: number;
          id?: string;
        } = {
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

interface HeaderCLProps {
  theme: string;
  onThemeChange: (theme: string) => void;
  transparent: any;
  currentLang: string;
  KUCOIN_HOST: string;
  userInfo: any;
  restrictNoticeStayDuration: any;
  pathname: any;
  maintenance: any;
  maintainancePath: any;
  showMaintenance: any;
  onCloseMaintenance: any;
  miniMode?: boolean;
  inTrade?: boolean;
}

const HeaderCL: FC<HeaderCLProps> = props => {
  const {
    onThemeChange,
    currentLang,
    KUCOIN_HOST, // kucoin主站地址
    miniMode,
    inTrade = false,
  } = props;
  const rv = useResponsive();
  useVariablesCheck();
  const { t: _t } = useTranslation('header');
  const [showMenuDrawer, setShowMenuDrawer] = useState(false);
  const [showI18nDrawer, setShowI18nDrawer] = useState(false);
  const [isNav, setIsNav] = useState(false);
  const [i18nType, setI18nType] = useState('lang');
  const pullLangList = useHeaderStore(state => state.pullLangList);

  const handleShowDrawer = (type: string, state: boolean, i18nTp?: string) => {
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
    pullLangList?.();
  }, []);

  return (
    <>
      <header className={clsx('gbiz-Header', headerStyles.Root)} data-theme={props.theme}>
        <HeadRoom>
          <div onClick={headerGa} className={clsx('Header-Nav', headerStyles.Nav)}>
            <div
              className={clsx(headerStyles.NavBar, {
                [headerStyles.NavBarMiniMode]: miniMode,
                [headerStyles.NavBarInTrade]: inTrade,
              })}
            >
              <div id="hook_nav_links" className={clsx(headerStyles.NavLinksWrapper, styles.navLinksWrapper)}>
                <div className={headerStyles.Links}>
                  <a
                    className={headerStyles.LogoLink}
                    href={addLangToPath(queryPersistence.formatUrlWithStore(`${KUCOIN_HOST}`, WITHOUT_QUERY_PARAM))}
                    aria-label="Kucoin logo (header)"
                    onClick={() => {
                      kcsensorsClick(['navigationLogo', '1'], {
                        pagecate: 'navigationLogo',
                      });
                    }}
                    data-inspector="inspector_header_logo"
                  >
                    <img
                      className={headerStyles.LogoImg}
                      src={bootConfig?._BRAND_LOGO_ || LOGO}
                      alt={bootConfig?._BRAND_NAME_ || 'KuCoin'}
                    />
                  </a>
                  {/* logo 后缀 */}
                  <Divider direction="vertical" orientation="center" className={styles.simplifyLogoDivider} />
                  <span className={styles.simplifyLogoSuffixContent}>{_t('b312de5446da4000a722')}</span>
                </div>
              </div>
              <div className={headerStyles.NavUserDom} id="hook_nav_user">
                <NavUser handleShowDrawer={handleShowDrawer} {...props} onThemeChange={onThemeChange} />
                <div data-lang={currentLang} className={clsx('MenuBox', headerStyles.MenuBox, styles.menuBox)}>
                  <MenuIcon
                    onClick={() => handleShowDrawer('menu', true)}
                    size={rv === 'sm' ? 16 : 20}
                    color="var(--kux-text)"
                    style={{ cursor: 'pointer' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </HeadRoom>
      </header>
      <MenuDrawer
        {...props}
        show={showMenuDrawer}
        onClose={() => handleShowDrawer('menu', false)}
        handleShowDrawer={handleShowDrawer}
        isNav={isNav}
        onThemeChange={onThemeChange}
      />
      <I18nDrawer {...props} show={showI18nDrawer} onClose={() => handleShowDrawer('i18n', false)} type={i18nType} />
    </>
  );
};

export default HeaderCL;
