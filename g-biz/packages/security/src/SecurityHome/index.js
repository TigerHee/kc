/**
 * Owner: iron@kupotech.com
 */
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { Box, Divider, Button, useTheme, ThemeProvider, Snackbar, Notification } from '@kufox/mui';
import { css } from '@emotion/react';
import { PASSWORD_KEY, GOOGLE2FA_KEY, EMAIL_KEY } from '../common/constants';
import { useLang } from '../hookTool';

import { namespace } from './model';

import lockIcon from '../../static/lock.svg';
import googleIcon from '../../static/google.svg';
import emailIcon from '../../static/email.svg';

const { NotificationProvider } = Notification;
const { SnackbarProvider } = Snackbar;

// 安全设置枚举，isLabel -- 是否显示小的角标，isBtn -- 是否显示跳转按钮
const getSecurityEnums = (t) => {
  return [
    {
      key: PASSWORD_KEY,
      icon: lockIcon,
      title: t('security_label_password'),
      subtitle: t('security_label_password_subtitle'),
      isLabel: false,
      isBtn: true,
    },
    {
      key: GOOGLE2FA_KEY,
      icon: googleIcon,
      title: t('security_label_google'),
      subtitle: (
        <>
          {t('security_label_google_subtitle')}
          <a href="#/">{t('security_label_google_subtitle_label')}</a>
        </>
      ),
      isLabel: true,
      isBtn: true,
      closeLabel: t('security_close'),
      openLabel: t('security_already_open'),
    },
    {
      key: EMAIL_KEY,
      icon: emailIcon,
      title: t('security_label_email'),
      subtitle: t('security_label_email_subtitle'),
      isLabel: true,
      isBtn: false,
      isText: 'email',
      closeLabel: t('security_off'),
      openLabel: t('security_bind'),
    },
  ];
};

const useStyles = (theme) => {
  return {
    root: css`
      margin: 64px auto 160px;
      width: 60%;
      min-width: 820px,
      'button': {
        height: 32px;
        padding: 0 27px;
      }
    `,
    title: css`
      font-size: 34px;
      line-height: 48px;
      margin-bottom: 32px;
    `,
    item: css`
      display: flex;
      justify-content: space-between;
      padding: 24px 0;
    `,
    leftBox: css`
      display: flex;
    `,
    imgBox: css`
      display: flex;
      width: 48px;
      height: 48px;
      'img': {
        width: auto;
      }
    `,
    itemLabel: css`
      padding: 0 4px;
      margin-left: 8px;
    `,
    success: css`
      color: ${theme.colors.primary};
      background-color: ${theme.colors.primary8};
    `,
    error: css`
      color: ${theme.colors.secondary};
      background-color: ${theme.colors.secondary8};
    `,
    labelBox: css`
      font-size: 12px;
      line-height: 20px;
      margin-left: 16px;
    `,
    labelTitle: css`
      display: flex;
      align-items: center;
      margin-bottom: 8px;
      font-size: 12px;
      line-height: 20px;
      'h3': {
        margin-block-start: 0;
        margin-block-end: 0;
        font-size: 20px;
        line-height: 28px;
      }
    `,
    subTitle: css`
      'a': {
        cursor: pointer,
        color: ${theme.colors.primary};
        text-decoration: none;
        ':hover,:visited,:active': {
          text-decoration: underline;
        }
      }
    `,
    rightText: css`
      display: flex;
      align-items: center;
      margin-bottom: 8px;
      font-size: 14px;
      line-height: 22px;
      color: ${theme.colors.main};
    `,
  };
};

function SecurityHome(props = {}) {
  const { onClick = () => {} } = props;
  const theme = useTheme();
  const classes = useStyles(theme);

  const { securityMethods, userInfo } = useSelector((state) => state[namespace]);
  const dispatch = useDispatch();
  const { t } = useLang();

  useEffect(() => {
    dispatch({ type: `${namespace}/getUserInfo` });
    dispatch({ type: `${namespace}/getSecurityMethods` });
  }, []);

  return (
    <Box css={classes.root}>
      <h1 css={classes.title}>{t('security.title')}</h1>
      <div css={classes.container}>
        {getSecurityEnums(t).map(
          ({ key, title, icon, subtitle, isLabel, isBtn, isText, closeLabel, openLabel }) => {
            const isOpen = securityMethods[key] !== undefined ? securityMethods[key] : true; // 如果参数里面没有，默认为true
            return (
              <div key={key} css={classes.itemBox}>
                <div css={classes.item}>
                  <div css={classes.leftBox}>
                    <div css={classes.imgBox}>
                      <img src={icon} alt="icon" />
                    </div>
                    <div css={classes.labelBox}>
                      <div css={classes.labelTitle}>
                        <h3>{title}</h3>
                        {isLabel ? (
                          <div
                            css={`
                              ${classes.itemLabel} ${isOpen ? classes.success : classes.error}
                            `}
                          >
                            {isOpen ? openLabel : closeLabel}
                          </div>
                        ) : null}
                      </div>
                      <div css={classes.subTitle}>{subtitle}</div>
                    </div>
                  </div>
                  <div css={classes.rightBox}>
                    {isBtn ? (
                      <Button
                        onClick={() => onClick(key)}
                        variant={isOpen ? 'outlined' : 'contained'}
                      >
                        {isOpen ? t('security_edit') : t('security_open')}
                      </Button>
                    ) : isText ? (
                      <div css={classes.rightText}>{userInfo[isText]}</div>
                    ) : null}
                  </div>
                </div>
                <Divider color="default" />
              </div>
            );
          },
        )}
      </div>
    </Box>
  );
}

export default (props) => {
  return (
    <ThemeProvider theme={props.theme || 'light'}>
      <SnackbarProvider>
        <NotificationProvider>
          <SecurityHome {...props} />
        </NotificationProvider>
      </SnackbarProvider>
    </ThemeProvider>
  );
};
