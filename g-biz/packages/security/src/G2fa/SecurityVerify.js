/**
 * Owner: iron@kupotech.com
 */
import React, { forwardRef } from 'react';
import { Box, Form, Input, useTheme } from '@kufox/mui';
import { css } from '@emotion/react';
import { useLang } from '../hookTool';

const { FormItem, useForm } = Form;

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
    container: css`
      display: flex;
      justify-content: space-between;
    `,
  };
};

function SecurityVerify() {
  const [form] = useForm();
  const theme = useTheme();
  const classes = useStyles(theme);

  const { t } = useLang();

  return (
    <Box css={classes.root}>
      <header>
        <h3 css={classes.title}>{t('g2fa.verify.security.title')}</h3>
        <div css={classes.subtitle}>{t('g2fa.verify.security.subtitle')}</div>
      </header>
      <Form form={form}>
        <FormItem
          name="code"
          validateTrigger={['onBlur']}
          rules={[{ required: true, message: t('form.required') }]}
          label={t('form.google.code')}
        >
          <Input variant="standard" size="large" />
        </FormItem>
      </Form>
    </Box>
  );
}
export default forwardRef(SecurityVerify);
