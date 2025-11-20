/**
 * Owner: iron@kupotech.com
 */
import React from 'react';
import { map } from 'lodash-es';
import { Divider, Button } from '@kux/design';
import { SearchIcon } from '@kux/iconpack';
import clsx from 'clsx';
import { getHref } from 'kc-next/boot';
import { useCompliantShow } from 'packages/compliantCenter';
import Link from '../../components/Link';
import { USER_NAV_KEY_LIST, USER_NAV_KEY, filterNavUserMenuByBrandSite } from './const';
import GoldEntry from '../GoldEntry';
import { kcsensorsClick, composeSpmAndSave } from '../../common/tools';
import { kcsensorsManualTrack } from 'tools/sensors';
import ThemeBox from '../ThemeBox';
import UserBox from '../UserBox';
import AssetsBox from '../AssetsBox';
import OrderBox from '../OrderBox';
import DownloadBox from '../DownloadBox';
import I18nBox from '../I18nBox';
import { DOWNLOAD_CPLT_SPM } from '../config';
import { useTenantConfig } from '../../tenantConfig';
import { useTranslation } from 'tools/i18n';
import addLangToPath from 'tools/addLangToPath';
import styles from './styles.module.scss';
import { inputRef } from '../SearchBox';

const NavUser = props => {
  const {
    currentLang,
    menuConfig = USER_NAV_KEY_LIST,
    userInfo,
    isLogin,
    onSinin,
    onSinup,
    inDrawer,
    handleShowDrawer,
    navStatus,
    inTrade,
    onThemeChange,
    customLogin,
    simplify,
    hiddenSignInAndUp = false,
  } = props;

  const tenantConfig = useTenantConfig();
  const { t } = useTranslation('header');

  const loginHref = onSinin
    ? undefined
    : `${addLangToPath(`/ucenter/signin?backUrl=${encodeURIComponent(getHref())}`)}`;
  const signHref = onSinup ? undefined : `${addLangToPath(`/ucenter/signup?backUrl=${encodeURIComponent(getHref())}`)}`;

  const handleSinin = e => {
    e.stopPropagation();
    e.preventDefault();
    handleShowDrawer('menu', false);
    if (customLogin && typeof customLogin === 'function') {
      customLogin();
      return;
    }
    if (onSinin) {
      onSinin();
    }
    kcsensorsClick(['login', '1'], {
      pagecate: 'navigationLogin',
    });
    composeSpmAndSave(loginHref, ['login', '1'], currentLang);
  };
  const handleSinup = e => {
    if (onSinup) {
      e.stopPropagation();
      e.preventDefault();
      onSinup();
    }
    kcsensorsClick(['register', '1'], {
      pagecate: 'navigationRegister',
    });
    kcsensorsManualTrack({
      spm: ['menubar', 'menubarSignup'],
      data: {
        before_click_element_value: '',
        after_click_element_value: 'Sign Up',
      },
    });
    composeSpmAndSave(signHref, ['register', '1'], currentLang);
  };

  // const showStatus = navStatus <= 5 + (menuConfig.includes(USER_NAV_KEY.SEARCH) ? 1 : 0);
  const showHeaderDownloadBtn = useCompliantShow(DOWNLOAD_CPLT_SPM);

  // 同时有【语言】和【货币】的icon配置时，需要整合成一个
  const isBothLangAndCurrency = [USER_NAV_KEY.I18N, USER_NAV_KEY.CURRENCY].every(key => menuConfig.includes(key));

  return (
    <div
      className={clsx(styles.navUser, {
        [styles.navUserInDrawer]: inDrawer,
        [styles.navUserInTrade]: !inDrawer && inTrade,
        [styles.navUser1]: navStatus >= 1,
        [styles.navUser2]: navStatus >= 2,
        [styles.navUser3]: navStatus >= 4,
        [styles.navUser3UnLogin]: !isLogin && navStatus >= 3,
      })}
    >
      {isLogin && !userInfo.isSub && <GoldEntry navStatus={navStatus} inTrade={inTrade} />}
      {/* {!rv.sm && !userInfo && pathname === '/' && !isInApp && (
        <MobileSignUpBtn handleSinup={handleSinup} signHref={signHref} />
      )} */}
      {/* 登录注册模块 */}
      {!isLogin && !hiddenSignInAndUp ? (
        <div
          id="unLoginBox"
          data-lang={currentLang}
          className={clsx(styles.userBoxWrapper, inDrawer && styles.userBoxWrapperInDrawer)}
        >
          <Link
            href={customLogin ? '' : loginHref}
            className={clsx(
              styles.signinLink,
              inDrawer && styles.signinLinkInDrawer,
              !inDrawer && inTrade && styles.signinLinkInTrade,
              !isLogin && navStatus >= 3 && styles.signinLinkUnLogin
            )}
            onClick={handleSinin}
            data-modid="login"
            data-inspector="header_login"
          >
            {inDrawer ? (
              <Button className={inDrawer && styles.btnInDrawer} type="outlined" size="large" fullWidth>
                {t('login')}
              </Button>
            ) : (
              t('login')
            )}
          </Link>
          <Link
            className={inDrawer && styles.signUpBtnInDrawer}
            href={signHref}
            onClick={handleSinup}
            data-inspector="header_signup"
          >
            <Button
              className={clsx(inDrawer && styles.btnInDrawer, inTrade && styles.btnInTrade)}
              data-modid="register"
              type="primary"
              size={inDrawer ? 'large' : inTrade ? 'mini' : 'small'}
              fullWidth
            >
              {t('sign.up')}
            </Button>
          </Link>
          <Divider style={{ display: inDrawer ? 'none' : 'block' }} className={styles.divider} />
        </div>
      ) : null}
      {/* 多了一个？ */}
      {/* {userInfo && !inDrawer && navStatus >= 4 && !simplify ? (
        <div data-lang={currentLang} data-menu={USER_NAV_KEY.PERSON}>
          <UserBox
            {...props}
            userInfo={userInfo}
            handleShowDrawer={handleShowDrawer}
            minNav
            navStatus={navStatus}
            inTrade={inTrade}
          />
        </div>
      ) : null} */}
      {map(filterNavUserMenuByBrandSite(menuConfig), (menu, index) => {
        if (typeof menu === 'string' && USER_NAV_KEY[menu.toUpperCase()]) {
          let comp;
          switch (menu) {
            case USER_NAV_KEY.ASSET:
              comp = isLogin ? <AssetsBox {...props} /> : null;
              break;
            case USER_NAV_KEY.ORDER:
              comp = isLogin ? <OrderBox {...props} /> : null;
              break;
            case USER_NAV_KEY.PERSON:
              comp = isLogin ? <UserBox {...props} userInfo={userInfo} handleShowDrawer={handleShowDrawer} /> : null;
              break;
            case USER_NAV_KEY.SEARCH:
              comp = (
                <div
                  className={clsx(styles.searchWrapper, inTrade && styles.searchWrapperInTrade)}
                  onClick={() => {
                    handleShowDrawer('menu', true);
                    setTimeout(() => {
                      inputRef?.handleSearchFocus?.();
                    }, 100);
                  }}
                >
                  <SearchIcon size={16} />
                </div>
              );
              break;
            case USER_NAV_KEY.DOWNLOAD:
              comp = !inDrawer ? <DownloadBox {...props} /> : null;
              break;
            case USER_NAV_KEY.I18N:
              comp = !inDrawer ? <I18nBox {...props} showType="lang" /> : null;
              break;
            case USER_NAV_KEY.CURRENCY:
              // 同时有【语言】和【货币】的icon配置时，只展示一个
              comp = inDrawer || isBothLangAndCurrency ? null : <I18nBox {...props} showType="lang" />;
              break;
            case USER_NAV_KEY.THEME:
              comp = !inDrawer ? <ThemeBox onChange={onThemeChange} inTrade={inTrade} /> : null;
              break;
            default:
              comp = null;
          }
          // 下载菜单，不显示的情况下，设置display：none
          let downloadStyles = {};
          if (menu === USER_NAV_KEY.DOWNLOAD && !tenantConfig.ignoreShowDownloadCompliance && !showHeaderDownloadBtn) {
            downloadStyles = { style: { display: 'none' } };
          }

          return comp ? (
            <div className={styles.navUserItem} key={menu} data-lang={currentLang} data-menu={menu} {...downloadStyles}>
              {comp}
            </div>
          ) : (
            comp
          );
        }
        return menu ? (
          <div
            className={menu ? styles.navUserItem : ''}
            key={`menu${index}`}
            data-lang={currentLang}
            data-menu="notice"
          >
            {menu}
          </div>
        ) : null;
      })}
    </div>
  );
};

export default NavUser;
