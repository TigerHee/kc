/**
 * Owner: iron@kupotech.com
 */
import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Dropdown, useTheme, useSnackbar } from '@kux/mui';
import { css } from '@emotion/react';
import { ICCopyOutlined } from '@kux/icons';
import CopyToClipboard from 'react-copy-to-clipboard';
import Link from '../../components/Link';
import { useLang } from '../../hookTool';
import { kcsensorsClick, addLangToPath } from '../../common/tools';
import { namespace } from '../model';
import { long_language } from '../config';

const useStyles = ({ color, inDrawer, isLong_language, breakpoints }) => {
  return {
    root: css`
      display: flex;
      align-items: center;
    `,
    navItem: css`
      color: ${color.text};
      cursor: pointer;
      font-size: 14px;
      line-height: 22px;
      &:hover {
        color: ${color.primary};
      }
    `,
    userFlag: css`
      position: relative;
      border: 1px solid ${color.cover20};
      border-radius: 50%;
      width: 38px;
      height: 38px;
      line-height: 130%;
      text-align: center;
      cursor: pointer;
      color: ${color.text};
      font-size: 16px;
      font-weight: 500;
      display: flex;
      align-items: center;
      justify-content: center;
      &:hover {
        border: 1px solid ${color.primary};
        color: ${color.primary};
      }
      transition: all 0.3s ease;
      ${breakpoints.down('sm')} {
        width: 30px;
        height: 30px;
        font-size: 14px;
      }
    `,
    overlayWrapper: css`
      width: ${inDrawer ? 'auto' : isLong_language ? '340px' : '300px'};
      margin-top: ${inDrawer ? '0' : '20px'};
      padding: ${inDrawer ? '0' : '16px 0'};
      background: ${color.base};
      box-shadow: ${inDrawer ? 'none' : '0px 10px 60px rgba(0, 0, 0, 0.1)'};
      border-radius: 4px;
      max-height: calc(100vh - 100px);
      overflow: auto;
      & hr {
        margin: 8px 24px;
      }
    `,
    menuItem: css`
      display: block;
      padding: 14px 24px;
      cursor: pointer;
      color: ${color.text};
      text-decoration: none !important;
      font-size: 14px;
      font-weight: 400;
      line-height: 1.4;
      position: relative;
      white-space: break-spaces;
      word-break: break-all;
      &:hover {
        background: ${color.cover4};
        color: ${color.text};
        & .uid {
          border-color: ${color.divider};
        }

        & .in {
          border-color: ${color.divider};
        }
      }
      @keyframes move {
        0% {
          right: 20px;
        }
        100% {
          right: 18px;
        }
      }
      @keyframes move-rtl {
        0% {
          left: 20px;
        }
        100% {
          left: 18px;
        }
      }
      @keyframes changeColor {
        0% {
          fill: #737e8d;
        }
        100% {
          fill: #18bb97;
        }
      }
      & .arrow {
        display: none;
      }
      &:hover .arrow {
        display: block;
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        right: 20px;
        transform-origin: center center;
        animation: move 0.3s linear forwards;
        -webkit-animation: move 0.3s linear forwards;

        & path {
          animation: changeColor 0.3s linear forwards;
          -webkit-animation: changeColor 0.3s linear forwards;
        }

        [dir='rtl'] & {
          right: unset;
          left: 20px;
          transform: rotate(180deg) translateY(50%);
          -webkit-animation: move-rtl 0.3s linear forwards;
          animation: move-rtl 0.3s linear forwards;
        }
      }
      &.center {
        text-align: center;
      }
      & .nameView {
        display: flex;
        align-items: center;
      }
      & .email {
        font-size: 20px;
        line-height: 1.4;
        color: ${color.text};
        margin-right: 8px;
        font-weight: 500;
      }

      & .tagView {
        display: flex;
        align-items: center;
        margin-top: 8px;
      }
      & .subAccount {
        font-size: 12px;
        line-height: 1.5;
        color: ${color.text60};
        margin-right: 8px;
      }
      & .uid {
        display: flex;
        align-items: center;
        width: auto;
        height: auto;
        padding: 2px 8px;
        background: ${color.cover4};
        border-radius: 12px;
        font-size: 12px;
        line-height: 1.6;
        color: ${color.text60};
        font-weight: 500;
        cursor: pointer;
        border: 1px solid transparent;
      }
    `,

    flex: css`
      display: flex;
      font-size: 12px;
      font-weight: 400;
      align-items: center;
    `,

    hr: css`
      background: ${color.divider};
      border: none;
      height: 1px;
    `,

    link: css`
      font-size: 14px;
      line-height: 22px;
      color: #00142a;
      text-decoration: none;
      &:hover {
        color: ${color.primary};
      }
      &.mg {
        margin-bottom: 16px;
      }
    `,
  };
};

const doNothing = (e) => {
  e.stopPropagation();
  e.preventDefault();
};

// 获取用户表示标示：昵称>邮箱>手机，从用户已有的里面选优先级最高的那个，取前两个字符展示
const getUserFlag = (user, isSub = false) => {
  const { nickname = '', email = '', phone = '', subAccount = '' } = user || {};
  let userFlag = '';
  try {
    if (nickname) {
      const nicknameStr = `${nickname}`;
      userFlag += nicknameStr[0];
      if (
        nicknameStr[1] &&
        nicknameStr[0].charCodeAt() <= 255 &&
        nicknameStr[1].charCodeAt() <= 255
      ) {
        userFlag += nicknameStr[1];
      }
    } else if (email) {
      userFlag += email.substring(0, 2);
    } else if (phone) {
      userFlag += phone.substring(phone.length - 2);
    }
    if (isSub) {
      userFlag = subAccount.substring(0, 2) || '';
    }
  } catch (e) {
    console.log(e);
  }
  return userFlag.toUpperCase();
};

export default (props) => {
  const {
    currentLang,
    userInfo,
    hostConfig,
    isSub = false,
    handleShowDrawer,
    minNav,
    inDrawer,
  } = props;
  const theme = useTheme();
  const { KUCOIN_HOST } = hostConfig;
  const isLong_language = long_language.indexOf(currentLang) > -1;
  const { t } = useLang();

  const { serviceInfo } = useSelector((state) => state[namespace]);
  // serviceStatus: 专属客服经理状态：EFFECTIVE-生效期, EXP-延长期, INEFFECTIVE-已失效
  const { serviceStatus } = serviceInfo || {};
  const { breakpoints, colors } = theme;
  const classes = useStyles({
    color: colors,
    inDrawer,
    isLong_language,
    serviceStatus,
    breakpoints,
  });
  const dispatch = useDispatch();

  const { message } = useSnackbar();

  const handleLogout = (e) => {
    kcsensorsClick(['person', !(currentLang.indexOf('zh_') === 0) && !isSub ? '9' : '8']);
    if (e && e.preventDefault) {
      e.preventDefault();
      e.stopPropagation();
      e.nativeEvent.stopImmediatePropagation();
    }
    const to = '';
    dispatch({ type: `${namespace}/logout`, payload: { to, spm: ['person', '9'] } });
  };

  const handleRouter = useCallback(() => {
    kcsensorsClick(['percenter', '1']);
    const _url = addLangToPath(`${KUCOIN_HOST}/account`, currentLang);
    window.location.href = _url;
  }, [currentLang, KUCOIN_HOST]);

  const Overlay = () => {
    const { nickname = '', email = '', phone = '', subAccount = '' } = userInfo || {};
    const userName = isSub ? subAccount : nickname || email || phone || '';
    const accountHref = isSub ? `${KUCOIN_HOST}/account/security` : `${KUCOIN_HOST}/account`;
    return (
      <div css={classes.overlayWrapper}>
        <Link
          href={accountHref}
          css={classes.menuItem}
          data-ga="person"
          data-modid="person"
          data-idx={2}
          lang={currentLang}
          onClick={() => {
            kcsensorsClick(['percenter', '1']);
          }}
        >
          <div className="nameView">
            <span className="email">{userName}</span>
          </div>
          <div className="tagView">
            {isSub && <span className="subAccount">{t('subaccount.subaccount')} : </span>}
            <div onClick={doNothing}>
              <CopyToClipboard
                text={userInfo && userInfo.uid}
                onCopy={() => {
                  message.success(t('copy.succeed'));
                }}
              >
                <div className="uid">
                  UID: {userInfo && userInfo.uid}
                  <ICCopyOutlined size="18" style={{ marginLeft: 4 }} />
                </div>
              </CopyToClipboard>
            </div>
          </div>
        </Link>
        <hr css={classes.hr} />
        <div
          onClick={handleLogout}
          className="center"
          css={classes.menuItem}
          data-modid="person"
          data-idx={!(currentLang.indexOf('zh_') === 0) && !isSub ? '10' : '9'}
        >
          {t('logout')}
        </div>
      </div>
    );
  };
  if (inDrawer) {
    return <Overlay />;
  }
  return (
    <div css={classes.root}>
      {minNav ? (
        <div
          onClick={() => {
            kcsensorsClick(['percenter', '1']);
            handleShowDrawer('user', true);
          }}
          css={classes.userFlag}
          data-lang={currentLang}
        >
          {getUserFlag(userInfo, isSub)}
        </div>
      ) : (
        <Dropdown
          trigger="hover"
          overlay={<Overlay />}
          css={classes.navItem}
          placement="bottom"
          anchorProps={{ style: { display: 'block' } }}
          keepMounted
        >
          <div onClick={handleRouter} css={classes.userFlag}>
            {getUserFlag(userInfo, isSub)}
          </div>
        </Dropdown>
      )}
    </div>
  );
};
