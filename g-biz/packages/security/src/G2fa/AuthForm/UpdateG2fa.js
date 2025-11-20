/**
 * Owner: iron@kupotech.com
 */
import React from 'react';
import { Box, Form, Input, useTheme } from '@kufox/mui';
import { css } from '@emotion/react';
import { useLang } from '../../hookTool';

const { FormItem } = Form;

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
      line-height: 24px;
      margin-block-start: 0;
      margin-block-end: 0;
    `,
    subtitle: css`
      font-size: 14px;
      line-height: 22px;
      margin-top: 4px;
      color: ${theme.colors.text60};
    `,
    container: css`
      display: flex;
      justify-content: space-between;
    `,
  };
};

function UpdateG2fa() {
  const theme = useTheme();
  const classes = useStyles(theme);
  const { t } = useLang();

  const commonRule = [{ required: true, message: t('form.required') }];

  return (
    <Box css={classes.root}>
      <header>
        <h3 css={classes.title}>{t('g2fa.update.form.title')}</h3>
        <div css={classes.subtitle}>{t('g2fa.update.form.subtitle')}</div>
      </header>
      <FormItem
        label={t('form.google.code')}
        name="code"
        rules={commonRule}
        validateTrigger={['onBlur']}
      >
        <Input variant="standard" size="large" label={t('form.google.code')} />
      </FormItem>
    </Box>
  );
}
export default UpdateG2fa;
