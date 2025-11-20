/**
 * Owner: iron@kupotech.com
 */
import React from 'react';
import { Box, useTheme } from '@kufox/mui';
import { css } from '@emotion/react';
import { useLang } from '../hookTool';

const useStyles = (theme) => {
  return {
    progressBox: css`
      position: releative;
      overflow: hidden;
      margin-bottom: 13px;
    `,
    progressBar: css`
      width: 100%;
      height: 4px;
      margin-bottom: 5px;
      background-color: ${theme.colors.text20};
    `,
    progress: css`
      height: 100%;
      background-color: ${theme.colors.primary};
      transition: all 0.35s;
    `,
    iconBox: css`
      display: flex;
      justify-content: space-between;
    `,
    label: css`
      font-size: 12px;
      line-height: 20px;
      text-align: right;
    `,
    iconItem: css`
      width: 148px;
      height: 48px;
      border-radius: 4px;
      border: 1px solid ${theme.colors.text20};
      cursor: pointer;
    `,
  };
};

function Steps(props = {}) {
  const { className, style = {}, value = '0%', showLabel = true } = props;
  const theme = useTheme();
  const classes = useStyles(theme);

  const { t } = useLang();

  return (
    <Box className={className} style={style}>
      <div css={classes.progressBox}>
        <div css={classes.progressBar}>
          <div css={classes.progress} style={{ width: value }} />
        </div>
        <div css={classes.label}>{showLabel ? `${t('complete.tips')} ${value}` : null}</div>
      </div>
    </Box>
  );
}
export default React.memo(Steps);
