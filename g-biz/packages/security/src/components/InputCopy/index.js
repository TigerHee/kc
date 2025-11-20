/**
 * Owner: iron@kupotech.com
 */
import React from 'react';
import { Input, useTheme } from '@kufox/mui';
import { css } from '@emotion/react';
import CopyToClipboard from 'react-copy-to-clipboard';

const useStyles = (theme) => {
  return {
    root: css`
      width: 100%;
    `,
    clipSpan: css`
      display: 'inline-block',
      min-width: '40px',
      padding: '4px',
      cursor: 'pointer',
      color: ${theme.colors.primary},
      font-size: '14px',
      line-height: '22px'
    `,
  };
};

export default function InputCopy(props = {}) {
  const { t, value, onCopy = () => {}, ...other } = props;
  const theme = useTheme();
  const classes = useStyles(theme);

  return (
    <Input
      css={classes.root}
      value={value}
      {...other}
      suffix={
        <CopyToClipboard text={value} onCopy={onCopy}>
          <span css={classes.clipSpan}>{t('copy')}</span>
        </CopyToClipboard>
      }
    />
  );
}
