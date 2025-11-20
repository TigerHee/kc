/**
 * Owner: iron@kupotech.com
 */
import React, { useState, useEffect } from 'react';
import { map } from 'lodash';
import { useSelector, useDispatch } from 'react-redux';
import { useResponsive } from '@kux/mui';
import { ICSearchOutlined } from '@kux/icons';
import { useCompliantShow } from '@packages/compliantCenter';
import { kcsensorsManualTrack } from '@utils/sensors';
import Link from '../../components/Link';
import { USER_NAV_KEY_LIST, USER_NAV_KEY, filterNavUserMenuByBrandSite } from './const';
import GoldEntry from '../GoldEntry';
import { namespace } from '../model';
import {
  getOtcVisible,
  kcsensorsClick,
  composeSpmAndSave,
  addLangToPath,
} from '../../common/tools';
import { useLang } from '../../hookTool';
import { NavUser, UserBoxWrapper, UserBoxComponent, Divider, SearchWrapper } from './styled';
import ThemeBox from '../ThemeBox';
import UserBox from '../UserBox';
import AssetsBox from '../AssetsBox';
import OrderBox from '../OrderBox';
import DownloadBox from '../DownloadBox';
import I18nBox from '../I18nBox';
import { DOWNLOAD_CPLT_SPM } from '../config';
import { tenantConfig } from '../../tenantConfig';

export default (props) => {
  const {
    currentLang,
    currency,
    menuConfig = USER_NAV_KEY_LIST,
    userInfo,
    onSinin,
    onSinup,
    inDrawer,
    handleShowDrawer,
    navStatus,
    inTrade,
    mainTheme,
    onThemeChange,
    customLogin,
    simplify,
    hiddenSignInAndUp = false,
  } = props;

  const { t } = useLang();
  const [otcVisible, setOtcVisible] = useState(false);

  const { otcLanguageList } = useSelector((state) => state[namespace]);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!otcLanguageList) {
      dispatch({ type: `${namespace}/pullOtcLanguageList` });
    }
  }, []);

  useEffect(() => {
    const visible = getOtcVisible(otcLanguageList, currentLang, currency);
    setOtcVisible(visible);
  }, [currentLang, currency, otcLanguageList]);

  const loginHref = onSinin
    ? undefined
    : `${addLangToPath(
        `/ucenter/signin?backUrl=${encodeURIComponent(window.location.href)}`,
        currentLang,
      )}`;
  const signHref = onSinup
    ? undefined
    : `${addLangToPath(
        `/ucenter/signup?backUrl=${encodeURIComponent(window.location.href)}`,
        currentLang,
      )}`;

  const handleSinin = (e) => {
    e.stopPropagation();
    e.preventDefault();
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
  const handleSinup = (e) => {
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

  const rv = useResponsive();
  const showStatus = navStatus <= 5 + (menuConfig.includes(USER_NAV_KEY.SEARCH) ? 1 : 0);
  const showHeaderDownloadBtn = useCompliantShow(DOWNLOAD_CPLT_SPM);
  return (
    <NavUser inDrawer={inDrawer} navStatus={navStatus} inTrade={inTrade}>
      {Boolean(userInfo) && !userInfo.isSub && (
        <GoldEntry
          navStatus={navStatus}
          userInfo={userInfo}
          inTrade={inTrade}
          showStatus={showStatus}
          lang={currentLang}
        />
      )}
      {/* {!rv.sm && !userInfo && pathname === '/' && !isInApp && (
        <MobileSignUpBtn handleSinup={handleSinup} signHref={signHref} />
      )} */}
      {/* 登录注册模块 */}
      {!userInfo && !hiddenSignInAndUp ? (
        <UserBoxWrapper id="unLoginBox" data-lang={currentLang} inDrawer={inDrawer}>
          <Link
            href={loginHref}
            className="navUserItem signinLink"
            onClick={handleSinin}
            data-modid="login"
            data-inspector="header_login"
            onlyLink={!customLogin}
          >
            <div className="signinBtn">{t('login')}</div>
          </Link>
          <Link
            href={signHref}
            className="navUserItem signUpLink"
            onClick={handleSinup}
            data-inspector="header_signup"
          >
            <div className="signUpBtn" data-modid="register">
              {t('sign.up')}
            </div>
          </Link>
          <Divider style={{ display: inDrawer ? 'none' : 'block' }} />
        </UserBoxWrapper>
      ) : null}
      {userInfo && !inDrawer && navStatus >= 4 && !simplify ? (
        <UserBoxComponent data-lang={currentLang} data-menu={USER_NAV_KEY.PERSON}>
          <UserBox
            {...props}
            userInfo={userInfo}
            handleShowDrawer={handleShowDrawer}
            minNav
            navStatus={navStatus}
            inTrade={inTrade}
          />
        </UserBoxComponent>
      ) : null}
      {map(filterNavUserMenuByBrandSite(menuConfig), (menu, index) => {
        if (typeof menu === 'string' && USER_NAV_KEY[menu.toUpperCase()]) {
          let comp;
          switch (menu) {
            case USER_NAV_KEY.ASSET:
              comp = userInfo ? <AssetsBox {...props} otcVisible={otcVisible} /> : null;
              break;
            case USER_NAV_KEY.ORDER:
              comp = userInfo ? <OrderBox {...props} otcVisible={otcVisible} /> : null;
              break;
            case USER_NAV_KEY.PERSON:
              comp = userInfo ? (
                <UserBox {...props} userInfo={userInfo} handleShowDrawer={handleShowDrawer} />
              ) : null;
              break;
            case USER_NAV_KEY.SEARCH:
              comp = (
                <SearchWrapper
                  status={navStatus}
                  inTrade={inTrade}
                  onClick={() => handleShowDrawer('menu', true)}
                >
                  <ICSearchOutlined size={rv.sm && !inTrade ? '20' : '16'} />
                </SearchWrapper>
              );
              break;
            case USER_NAV_KEY.DOWNLOAD:
              comp = <DownloadBox {...props} />;
              break;
            case USER_NAV_KEY.I18N:
              comp = <I18nBox {...props} showType="lang" />;
              break;
            case USER_NAV_KEY.CURRENCY:
              comp = <I18nBox {...props} />;
              break;
            case USER_NAV_KEY.THEME:
              comp = <ThemeBox onChange={onThemeChange} inTrade={inTrade} mainTheme={mainTheme} />;
              break;
            default:
              comp = null;
          }
          // 下载菜单，不显示的情况下，设置display：none
          let downloadStyles = {};
          if (
            menu === USER_NAV_KEY.DOWNLOAD &&
            !tenantConfig.ignoreShowDownloadCompliance &&
            !showHeaderDownloadBtn
          ) {
            downloadStyles = { style: { display: 'none' } };
          }

          return comp ? (
            <div
              className="navUserItem"
              key={menu}
              data-lang={currentLang}
              data-menu={menu}
              {...downloadStyles}
            >
              {comp}
            </div>
          ) : (
            comp
          );
        }
        return (
          <div
            className={menu ? 'navUserItem' : ''}
            key={`menu${index}`}
            data-lang={currentLang}
            data-menu="notice"
          >
            {menu}
          </div>
        );
      })}
    </NavUser>
  );
};
