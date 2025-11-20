/**
 * Owner: iron@kupotech.com
 */
import React, { FC } from 'react';
import { Divider } from '@kux/design';
import clsx from 'clsx';
import { getHref } from 'kc-next/boot';
import Link from '../../../components/Link';
import { USER_NAV_KEY } from '../../NavUser/const';
import { kcsensorsClick, composeSpmAndSave } from '../../../common/tools';
import { useTranslation } from 'tools/i18n';
import addLangToPath from 'tools/addLangToPath';
import UserBox from '../UserBox';
import I18nBox, { type I18nBoxProps } from '../I18nBox';
import ThemeBox from '../../ThemeBox';
import navUserStyles from '../../NavUser/styles.module.scss';
import styles from './styles.module.scss';

interface NavUserProProps extends I18nBoxProps {
  currentLang: string;
  userInfo: any;
  onSinin?: () => void;
  customLogin?: () => void;
  hiddenSignInAndUp?: boolean;
  onThemeChange: (theme: string) => void;
  inDrawer?: boolean;
  handleShowDrawer: (type: string, state: boolean, i18nTp?: string) => void;
}

const NavUserPro: FC<NavUserProProps> = props => {
  const {
    currentLang,
    userInfo,
    onSinin,
    customLogin,
    hiddenSignInAndUp = false,
    onThemeChange,
    inDrawer,
    handleShowDrawer,
  } = props;
  const { t } = useTranslation('header');

  const loginHref = onSinin
    ? undefined
    : `${addLangToPath(`/ucenter/signin?backUrl=${encodeURIComponent(getHref())}`)}`;

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

  return (
    <div
      className={clsx(navUserStyles.navUser, {
        [styles.navUser]: !inDrawer,
        [navUserStyles.navUserInDrawer]: inDrawer,
      })}
    >
      {!userInfo && !hiddenSignInAndUp ? (
        <div
          id="unLoginBox"
          className={clsx(navUserStyles.userBoxWrapper, inDrawer && navUserStyles.userBoxWrapperInDrawer)}
          data-lang={currentLang}
        >
          <Link
            href={customLogin ? '' : loginHref}
            className={clsx(
              navUserStyles.navUserItem,
              navUserStyles.signinLink,
              styles.signinLink,
              inDrawer && styles.signinLinkInDrawer
            )}
            onClick={handleSinin}
            data-modid="login"
            data-inspector="header_login"
          >
            <div className={navUserStyles.signinBtn}>{t('login')}</div>
          </Link>
          <Divider className={navUserStyles.divider} style={{ display: 'block' }} />
        </div>
      ) : null}
      {!inDrawer && userInfo && (
        <div
          className={navUserStyles.navUserItem}
          key={USER_NAV_KEY.PERSON}
          data-lang={currentLang}
          data-menu={USER_NAV_KEY.PERSON}
        >
          <UserBox {...props} userInfo={userInfo} />
        </div>
      )}
      <div
        className={clsx(navUserStyles.navUserItem, styles.navUserItem)}
        key={USER_NAV_KEY.I18N}
        data-lang={currentLang}
        data-menu={USER_NAV_KEY.I18N}
      >
        <I18nBox {...props} showType="lang" />
      </div>
      <div
        className={clsx(navUserStyles.navUserItem, styles.navUserItem)}
        key={USER_NAV_KEY.THEME}
        data-lang={currentLang}
        data-menu={USER_NAV_KEY.THEME}
      >
        <ThemeBox onChange={onThemeChange} />
      </div>
    </div>
  );
};

export default NavUserPro;
