/**
 * Owner: iron@kupotech.com
 */
import React from 'react';
import { Box, Tooltip, useTheme } from '@kufox/mui';
import { css } from '@emotion/react';
import QRCode from 'qrcode.react';

import { useLang } from '../hookTool';
import { areEqual } from '../common/tools';

import appStoreIcon from '../../static/appstore.svg';
import googlePlayIcon from '../../static/googleplay.svg';
import myAppIcon from '../../static/myapp.svg';

// 谷歌验证器下载
let downloadMethod = [
  {
    key: 'appStore',
    icon: appStoreIcon,
    tips: (
      <QRCode
        value="https://apps.apple.com/cn/app/google-authenticator/id388497605"
        size={140}
        level="M"
      />
    ),
  },
  {
    key: 'googlePlay',
    icon: googlePlayIcon,
    tips: (
      <QRCode
        value="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2"
        size={140}
        level="M"
      />
    ),
  },
  {
    key: 'myApp',
    icon: myAppIcon,
    tips: (
      <QRCode
        value="https://android.myapp.com/myapp/detail.htm?apkName=com.google.android.apps.authenticator2"
        size={140}
        level="M"
      />
    ),
  },
];

const useStyles = (theme) => {
  return {
    root: css`
      & header {
        margin-bottom: 24px;
      }
    `,
    title: css`
      font-size: 16px;
      lineheight: 24px;
      margin-block-start: 0;
      margin-block-end: 0;
    `,
    subtitle: css`
      font-size: 12px;
      lineheight: 20px;
      margin-top: 4px;
      color: ${theme.colors.text60};
    `,
    iconBox: css`
      display: flex;
      justify-content: space-between;
    `,
    iconItem: css`
      width: 148px;
      height: 48px;
      borderradius: 4px;
      border: 1px solid ${theme.colors.text40};
      cursor: pointer;
    `,
  };
};

function DownloadApp() {
  const theme = useTheme();
  const classes = useStyles(theme);

  const { t } = useLang();
  const currentLang = t('locale');
  // 判断是否为中文
  if (currentLang === 'zh_CN' && downloadMethod[0].key !== 'myApp') {
    const dMethods = [...downloadMethod];
    const last = dMethods.pop();
    dMethods.unshift(last);
    downloadMethod = [...dMethods];
  }

  return (
    <Box css={classes.root}>
      <header>
        <h3 css={classes.title}>{t('g2fa.download.title')}</h3>
        <div css={classes.subtitle}>{t('g2fa.download.subtitle')}</div>
      </header>
      <div css={classes.iconBox}>
        {downloadMethod.map(({ key, icon, tips }) => (
          <div key={key} css={classes.iconItem}>
            <Tooltip placement="top" title={tips}>
              <img src={icon} alt="download app icon" />
            </Tooltip>
          </div>
        ))}
      </div>
    </Box>
  );
}
export default React.memo(DownloadApp, areEqual);
