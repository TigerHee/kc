/**
 * Owner: iron@kupotech.com
 */
import React from 'react';
import { Box, useSnackbar, useTheme } from '@kufox/mui';
import { css } from '@emotion/react';
import InputCopy from '../../components/InputCopy';
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
      font-size: 16px;
      line-height: 22px;
      margin-block-start: 0;
      margin-block-end: 0;
    `,
    subtitle: css`
      font-size: 14px;
      line-height: 20px;
      margin-top: 4px;
      color: ${theme.colors.secondary};
    `,
    container: css`
      display: flex;
      justify-content: space-between;
    `,
  };
};

function BackupKey(props = {}) {
  const { secretKey } = props;

  const theme = useTheme();
  const classes = useStyles(theme);
  const { message } = useSnackbar();

  const { t } = useLang();

  const handleCopySuccess = () => {
    message.success(t('copy.success'));
  };

  return (
    <Box css={classes.root}>
      <header>
        <h3 css={classes.title}>{t('g2fa.backup.title')}</h3>
        <div css={classes.subtitle}>{t('g2fa.backup.subtitle')}</div>
      </header>
      <div css={classes.container}>
        <InputCopy onCopy={handleCopySuccess} size="large" value={secretKey} t={t} />
      </div>
    </Box>
  );
}
export default BackupKey;
