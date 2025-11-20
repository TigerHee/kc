/**
 * Owner: tom@kupotech.com
 */
import React from 'react';
import { useTheme, useMediaQuery } from '@kux/mui';
import { css } from '@emotion/react';
import Link from '../../components/Link';
import { USER_NAV_KEY } from './const';
import UserBox from '../UserBox';
import DownloadBox from '../DownloadBox';
import I18nBox from '../I18nBox';
import { kcsensorsClick } from '../../common/tools';
import { useLang } from '../../hookTool';
import { SURPORT_LANG } from '../config';

const useStyles = ({ color, inDrawer, breakpoints, currentTheme }) => {
  return {
    showItem: css`
      display: flex;
      align-items: center;
      justify-content: center;
      background-clip: padding-box !important;
    `,
    navUser: css`
      display: flex;
      align-items: center;
      flex-direction: ${inDrawer ? 'column' : 'row'};
      & .search {
        .KuxInput-container {
          width: 240px;
        }
      }
      & .searchImg {
        cursor: pointer;
        display: flex;
        align-items: center;
      }
      & .signinLink {
        width: ${inDrawer ? '50%' : 'auto'};
        margin-right: ${inDrawer ? '12px' : 'unset'};
        @media screen and (max-width: 414px) {
          display: ${inDrawer ? 'unset' : 'none'};
        }
        &:hover {
          opacity: 0.6;
        }
        &:active {
          opacity: 1;
        }
      }
      & .navUserItem {
        color: ${color.text};
        cursor: pointer;
        padding-left: ${inDrawer ? '0' : `16px`};
        text-decoration: none !important;
        font-size: 14px;
        display: flex;
        align-items: center;
        justify-content: center;
        width: ${inDrawer ? '100%' : 'auto'};
        white-space: nowrap;
        background-clip: border-box !important;
        &[data-menu='i18n'],
        &[data-menu='download'] {
          display: 'flex';
        }

        &[data-menu='person'] {
          display: 'flex';
        }
        & .signinBtn {
          width: ${inDrawer ? '100%' : 'unset'};
          padding: ${inDrawer ? '12.5px 0' : '9px 24px'};
          font-weight: 500;
          font-size: ${inDrawer ? '16px' : '14px'};
          line-height: 130%;
          text-align: center;
          color: ${color.text};
          margin: 0;
          transition: all 0.3s ease;
          border: ${inDrawer ? `1px solid ${color.text}` : 'unset'};
          border-radius: 24px;
          ${breakpoints.down('sm')} {
            font-size: ${inDrawer ? '16px' : '12px'};
          }
          [dir='rtl'] & {
            margin: ${inDrawer ? '0 0 0 24px' : '0'};
          }
        }
        & .signUpBtn {
          width: ${inDrawer ? '100%' : 'unset'};
          padding: ${inDrawer ? '13.61px 0' : '9px 28px'};
          border-radius: 90px;
          font-weight: 700;
          font-size: ${inDrawer ? '16px' : '14px'};
          line-height: 130%;
          text-align: center;
          color: ${color.textEmphasis};
          background: ${currentTheme === 'dark' ? color.primary : color.text};
          position: relative;
          transition: all 0.3s ease;
          ${breakpoints.down('sm')} {
            padding: ${inDrawer ? '13.61px 0' : '8px 16px'};
            font-size: ${inDrawer ? '16px' : '12px'};
          }
        }
      }
    `,
    smSearch: css`
      position: fixed;
      z-index: 100;
      width: 100%;
      left: 0;
      top: 64px;
      background: #fff;
      padding: 8px 16px;
      .KuxInput-container {
        width: 100% !important;
      }
    `,
    userBox: css`
      display: flex;
      margin-right: 0;
      flex-direction: row;
      width: ${inDrawer ? '100%' : 'auto'};
      padding: ${inDrawer ? '0 24px' : '0'};
    `,
    userBoxComponent: css`
      margin-left: 20px;
      [dir='rtl'] & {
        margin-left: 0px;
      }
    `,
  };
};

export default (props) => {
  const {
    currentLang,
    userInfo,
    customColors = {},
    hostConfig,
    onSinin,
    onSinup,
    inDrawer,
    handleShowDrawer,
  } = props;
  const { KUCOIN_HOST } = hostConfig;
  const isPc = useMediaQuery('(min-width: 1025px)');
  const theme = useTheme();
  const color = { ...theme.colors, ...customColors };
  const { breakpoints, currentTheme } = theme;
  const cls = useStyles({ color, inDrawer, breakpoints, currentTheme });

  const { t } = useLang();

  const loginHref = onSinin
    ? undefined
    : `${KUCOIN_HOST}/ucenter/signin?backUrl=${encodeURIComponent(window.location.href)}`;
  const signHref = onSinup
    ? undefined
    : `${KUCOIN_HOST}/ucenter/signup?backUrl=${encodeURIComponent(window.location.href)}`;

  const handleSinin = (e) => {
    if (onSinin) {
      e.stopPropagation();
      e.preventDefault();
      onSinin();
    }
    kcsensorsClick(['login', '1']);
  };
  const handleSinup = (e) => {
    if (onSinup) {
      e.stopPropagation();
      e.preventDefault();
      onSinup();
    }
    kcsensorsClick(['signUp', '1']);
  };

  return (
    <div css={cls.navUser} className="navUsernavUser">
      {/* pc 展示登录&注册 */}
      {!userInfo && (isPc || inDrawer) && (
        <div css={cls.userBox} data-lang={currentLang}>
          <Link
            href={loginHref}
            className="navUserItem signinLink"
            onClick={handleSinin}
            data-modid="login"
          >
            <div className="signinBtn">{t('login')}</div>
          </Link>
          <Link href={signHref} className="navUserItem" onClick={handleSinup}>
            <div className="signUpBtn" data-modid="register">
              {t('sign.up')}
            </div>
          </Link>
        </div>
      )}
      {/* pad 和 h5 只展示注册 */}
      {!userInfo && !isPc && !inDrawer && (
        <Link href={signHref} className="navUserItem" onClick={handleSinup}>
          <div className="signUpBtn" data-modid="register">
            {t('sign.up')}
          </div>
        </Link>
      )}
      {userInfo && !inDrawer ? (
        <div css={cls.userBoxComponent} data-lang={currentLang} data-menu={USER_NAV_KEY.PERSON}>
          <UserBox
            {...props}
            userInfo={userInfo}
            handleShowDrawer={handleShowDrawer}
            minNav={!isPc}
          />
        </div>
      ) : null}
      {isPc && (
        <div className="navUserItem" data-lang={currentLang} data-menu={USER_NAV_KEY.I18N}>
          <I18nBox {...props} showType="lang" css={cls.showItem} surportLanguages={SURPORT_LANG} />
        </div>
      )}
      {isPc && (
        <div className="navUserItem" data-lang={currentLang} data-menu={USER_NAV_KEY.DOWNLOAD}>
          <DownloadBox {...props} />
        </div>
      )}
    </div>
  );
};
