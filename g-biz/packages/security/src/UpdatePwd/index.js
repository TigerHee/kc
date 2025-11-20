/**
 * Owner: iron@kupotech.com
 */
import React, { useEffect } from 'react';

import {
  Form,
  Input,
  Button,
  Box,
  Breadcrumb,
  useSnackbar,
  ThemeProvider,
  Notification,
  Snackbar,
} from '@kufox/mui';
import { css } from '@emotion/react';

import { useDispatch, useSelector } from 'react-redux';

import { REGEXP, loopCrypto } from '../common/tools';

import { namespace } from './model';
import { useLang } from '../hookTool';

const { FormItem, useForm } = Form;

const commonInputProps = { variant: 'standard', type: 'password', size: 'large' };

const { NotificationProvider } = Notification;
const { SnackbarProvider } = Snackbar;

const useStyles = () => {
  return {
    root: css`
      width: 480px;
      margin: 0 auto;
      margin-bottom: 80px;
      padding-top: 25px;
      .muilink-root: {
        cursor: pointer;
      }
    `,
    title: css`
      font-size: 34px;
      line-height: 48px;
      margin: 40px 0;
    `,
    btn: css`
      margin-top: 35px;
    `,
  };
};

const UpdatePwd = (props = {}) => {
  const { onSuccess = () => {}, onClickBread = () => {} } = props;
  const [form] = useForm();
  const classes = useStyles();
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

  const handleClickParentLink = () => {
    onClickBread(props.match, dispatch);
  };

  const handleSubmit = async (e) => {
    if (loading) return;
    e && e.preventDefault();
    form.validateFields().then(async (values) => {
      dispatch({ type: `${namespace}/update`, payload: { loading: true } });
      const { newPassword, oldPassword } = values;
      const payload = {
        newPassword: loopCrypto(newPassword, 2),
        oldPassword: loopCrypto(oldPassword, 2),
      };
      try {
        const isOk = await dispatch({
          type: `${namespace}/updatePassword`,
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

  const commonRule = [{ required: true, message: t('form.required') }];

  // 校验新密码输入框，如果跟原密码相同，给出提示
  const handleCheckEqualOldPwd = (rule, value, callback) => {
    const oValue = form.getFieldValue('oldPassword');
    if (!value) {
      callback(() => t('form.required'));
    } else if (oValue === value) {
      callback(() => t('form.password.equal'));
    } else if (!REGEXP.pwd.test(value)) {
      callback(() => t('form.password.error'));
    } else {
      callback();
    }
  };

  // 校验确认密码输入框，如果跟新密码不一致，给出提示
  const handleCheckIsNewPwd = (rule, value, callback) => {
    const nValue = form.getFieldValue('newPassword');
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
      <Breadcrumb>
        <Breadcrumb.Item onClick={handleClickParentLink}>{t('security.title')}</Breadcrumb.Item>
        <Breadcrumb.Item>{t('update.password.title')}</Breadcrumb.Item>
      </Breadcrumb>
      <div css={classes.container}>
        <h1 css={classes.title}>{t('update.password.title')}</h1>
        <Form size="large" form={form}>
          <FormItem
            label={t('old.password')}
            name="oldPassword"
            rules={commonRule}
            validateTrigger={['onBlur']}
          >
            <Input {...commonInputProps} />
          </FormItem>
          <FormItem
            label={t('new.password')}
            name="newPassword"
            validateTrigger={['onBlur']}
            rules={[
              ...commonRule,
              {
                validator: handleCheckEqualOldPwd,
              },
            ]}
          >
            <Input {...commonInputProps} />
          </FormItem>
          <FormItem
            label={t('confirm.password')}
            name="sPassword"
            rules={[
              ...commonRule,
              {
                validator: handleCheckIsNewPwd,
              },
            ]}
          >
            <Input {...commonInputProps} />
          </FormItem>
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
        </Form>
      </div>
    </Box>
  );
};

export default (props) => {
  return (
    <ThemeProvider theme={props.theme || 'light'}>
      <SnackbarProvider>
        <NotificationProvider>
          <UpdatePwd {...props} />
        </NotificationProvider>
      </SnackbarProvider>
    </ThemeProvider>
  );
};
