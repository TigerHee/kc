/**
 * Owner: iron@kupotech.com
 */
import React, { useState } from 'react';
import { Box, useTheme, useSnackbar } from '@kufox/mui';
import { css } from '@emotion/react';
import QRCode from 'qrcode.react';

import InputCopy from '../../components/InputCopy';
import DownloadAppModal from './DownloadAppModal';
import { useLang } from '../../hookTool';

const useStyles = (theme) => {
  return {
    root: css`
      margin-top: 8px;
      & header {
        margin-bottom: 24px;
      }
    `,
    title: css`
      margin-top: 8px;
      fontp-size: 16px;
      line-height: 24px;
      margin-block-start: 0;
      margin-block-end: 0;
    `,
    subtitle: css`
      fontp-size: 14px;
      line-height: 22px;
      margin-top: 4px;
      color: ${theme.colors.text60};
      & div {
        display: inline-block;
        cursor: pointer;
        color: ${theme.colors.primary};
      }
    `,
    container: css`
      display: flex;
      justify-content: space-between;
    `,
    qrMsg: css`
      width: 344px;
      display: flex;
      justify-content: space-between;
      flex-direction: column;
    `,
  };
};

function G2faQRCode(props = {}) {
  const {
    isUpdate,
    secretKey,
    userInfo: { email, phone },
  } = props;

  const theme = useTheme();
  const classes = useStyles(theme);
  const { message } = useSnackbar();

  const [downloadVisible, setDownloadVisible] = useState(false);

  const { t } = useLang();

  const handleCopySuccess = () => {
    message.success(t('copy.success'));
  };

  const handleOpenDownloadModal = () => {
    setDownloadVisible(true);
  };

  const handleCloseDownloadModal = () => {
    setDownloadVisible(false);
  };

  // 通过secretKey, hostname, 以及传递进来的userInfo 信息生成二维码
  const createQRValue = () => {
    let hostname = window.location.hostname.split('.');
    hostname = hostname.length > 1 ? hostname[1] : hostname[0];
    return `otpauth://totp/${hostname}-${email || phone}?issuer=${hostname}&secret=${secretKey}`;
  };

  return (
    <Box css={classes.root}>
      <header>
        <h3 css={classes.title}>{t('g2fa.qrcode.title')}</h3>
        <div css={classes.subtitle}>
          <span>{t('g2fa.qrcode.subtitle')}</span>
          {isUpdate ? (
            <div onClick={handleOpenDownloadModal}>{t('g2fa.not.download.tips')}</div>
          ) : null}
        </div>
      </header>
      <div css={classes.container}>
        <div css={classes.qrBox}>
          {secretKey ? <QRCode value={createQRValue()} size={112} level="Q" /> : null}
        </div>
        <div css={classes.qrMsg}>
          <div css={classes.subtitle}>{t('g2fa.qrcode.tips')}</div>
          <div css={classes.inputBox}>
            <InputCopy onCopy={handleCopySuccess} size="large" value={secretKey} t={t} />
          </div>
        </div>
      </div>
      <DownloadAppModal visible={downloadVisible} onClose={handleCloseDownloadModal} />
    </Box>
  );
}
export default G2faQRCode;
