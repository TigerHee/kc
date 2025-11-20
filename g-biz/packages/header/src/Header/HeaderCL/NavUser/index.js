/**
 * Owner: iron@kupotech.com
 */
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Link from '../../../components/Link';
import { USER_NAV_KEY } from '../../NavUser/const';
import { namespace } from '../../model';
import { kcsensorsClick, composeSpmAndSave, addLangToPath } from '../../../common/tools';
import { useLang } from '../../../hookTool';
import { NavUser, UserBoxWrapper, Divider } from '../../NavUser/styled';
import UserBox from '../UserBox';
import I18nBox from '../I18nBox';
import ThemeBox from '../../ThemeBox';

export default (props) => {
  const {
    currentLang,
    userInfo,
    onSinin,
    customLogin,
    hiddenSignInAndUp = false,
    onThemeChange,
    handleShowDrawer,
    mainTheme,
    navStatus,
    inDrawer,
  } = props;

  const { t } = useLang();

  const { otcLanguageList } = useSelector((state) => state[namespace]);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!otcLanguageList) {
      dispatch({ type: `${namespace}/pullOtcLanguageList` });
    }
  }, []);

  const loginHref = onSinin
    ? undefined
    : `${addLangToPath(
        `/ucenter/signin?backUrl=${encodeURIComponent(window.location.href)}`,
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

  return (
    <NavUser inDrawer={inDrawer} navStatus={navStatus}>
      {/* 登录注册模块 */}
      {!userInfo && !hiddenSignInAndUp ? (
        <UserBoxWrapper id="unLoginBox" inDrawer={inDrawer} data-lang={currentLang}>
          <Link
            href={customLogin ? '' : loginHref}
            className="navUserItem signinLink"
            onClick={handleSinin}
            data-modid="login"
            data-inspector="header_login"
          >
            <div className="signinBtn">{t('login')}</div>
          </Link>
          <Divider style={{ display: 'block' }} />
        </UserBoxWrapper>
      ) : null}
      {userInfo && (
        <div
          className="navUserItem"
          key={USER_NAV_KEY.PERSON}
          data-lang={currentLang}
          data-menu={USER_NAV_KEY.PERSON}
        >
          <UserBox {...props} userInfo={userInfo} handleShowDrawer={handleShowDrawer} />
        </div>
      )}
      <div
        className="navUserItem"
        key={USER_NAV_KEY.I18N}
        data-lang={currentLang}
        data-menu={USER_NAV_KEY.I18N}
      >
        <I18nBox {...props} showType="lang" />
      </div>
      <div
        className="navUserItem"
        key={USER_NAV_KEY.THEME}
        data-lang={currentLang}
        data-menu={USER_NAV_KEY.THEME}
      >
        <ThemeBox onChange={onThemeChange} mainTheme={mainTheme} />
      </div>
    </NavUser>
  );
};
