/**
 * Owner: iron@kupotech.com
 */
import React, { useEffect } from 'react';

import {
  Button,
  Box,
  Input,
  Form,
  useSnackbar,
  useTheme,
  ThemeProvider,
  Snackbar,
  Notification,
} from '@kufox/mui';
import { css } from '@emotion/react';
import { useDispatch, useSelector } from 'react-redux';

import { REGEXP, loopCrypto } from '../common/tools';

import { namespace } from './model';
import { useLang } from '../hookTool';

const { NotificationProvider } = Notification;
const { SnackbarProvider } = Snackbar;

const { FormItem, useForm } = Form;

const commonInputProps = { variant: 'standard', type: 'password', size: 'large' };

const useStyles = (theme) => {
  return {
    root: css`
      margin: 0 auto;
      margin-bottom: 80px;
      paddingtop: 25px;
    `,
    title: css`
      color: ${theme.colors.text};
      font-size: 24px;
      line-height: 36px;
      margin-top: 40px;
      margin-bottom: 11px;
    `,
    tips: css`
      font-size: 12px;
      color: ${theme.colors.text60};
      line-height: 20px;
      margin-bottom: 32px;
    `,
    btn: css`
      margin-top: 35px;
    `,
  };
};

const SetTradePwd = (props = {}) => {
  const { onSuccess = () => {} } = props;

  const theme = useTheme();
  const classes = useStyles(theme);
  const [form] = useForm();
  const { message } = useSnackbar();

  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state[namespace]);
  const { t } = useLang();

  useEffect(() => {
    dispatch({ type: `${namespace}/getUserInfo` });
    return () => {
      dispatch({ type: `${namespace}/resetInit` });
    };
  }, []);

  const handleSubmit = async (e) => {
    if (loading) return;
    e && e.preventDefault();
    form.validateFields().then(async (values) => {
      dispatch({ type: `${namespace}/update`, payload: { loading: true } });
      const { withdrawPassword } = values;
      const payload = {
        withdrawPassword: loopCrypto(withdrawPassword, 2),
      };
      try {
        const isOk = await dispatch({
          type: `${namespace}/setTradePwd`,
          payload,
        });
        if (isOk) {
          message.success(t('update.password.success'));
          onSuccess();
        }
      } finally {
        dispatch({ type: `${namespace}/update`, payload: { loading: false } });
      }
    });
  };

  // 校验新密码输入框，如果跟原密码相同，给出提示
  const handleCheckEqualOldPwd = (rule, value, callback) => {
    if (!value) {
      callback(() => t('form.required'));
    } else if (!REGEXP.tradePwd.test(value)) {
      callback(() => t('form_trade_pwd_error'));
    } else {
      callback();
    }
  };

  // 校验确认密码输入框，如果跟新密码不一致，给出提示
  const handleCheckIsNewPwd = (rule, value, callback) => {
    const nValue = form.getFieldValue('withdrawPassword');
    if (!value) {
      callback(() => t('form.required'));
    } else if (nValue !== value) {
      callback(() => t('form.password.not.equal'));
    } else {
      callback();
    }
  };

  return (
    <Box css={classes.root}>
      <div css={classes.container}>
        <h1 css={classes.title}>{t('set_trade_pwd_title')}</h1>
        <div css={classes.tips}>{t('set_trade_pwd_tip')}</div>
        <Form form={form} size="large">
          <Box mb={2}>
            <FormItem
              name="withdrawPassword"
              label={t('set_trade_pwd')}
              validateTrigger="onBlur"
              rules={[
                {
                  validator: handleCheckEqualOldPwd,
                },
              ]}
            >
              <Input {...commonInputProps} />
            </FormItem>
          </Box>

          <FormItem
            name="sPassword"
            label={t('set_trade_pwd_twice')}
            rules={[
              {
                validator: handleCheckIsNewPwd,
              },
            ]}
          >
            <Input {...commonInputProps} />
          </FormItem>
        </Form>
        <Box mt={0.75}>
          <Button
            onClick={handleSubmit}
            loading={loading}
            css={classes.btn}
            fullWidth
            type="primary"
            size="large"
          >
            {t('update.password.submit')}
          </Button>
        </Box>
      </div>
    </Box>
  );
};

export default (props) => {
  return (
    <ThemeProvider theme={props.theme || 'light'}>
      <SnackbarProvider>
        <NotificationProvider>
          <SetTradePwd {...props} />
        </NotificationProvider>
      </SnackbarProvider>
    </ThemeProvider>
  );
};
