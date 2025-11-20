/**
 * Owner: iron@kupotech.com
 */
import React, { useState, useEffect, useRef } from 'react';

import {
  Button,
  Box,
  Breadcrumb,
  Alert,
  Form,
  useSnackbar,
  ThemeProvider,
  Snackbar,
  Notification,
} from '@kufox/mui';
import { css } from '@emotion/react';

import { useDispatch, useSelector } from 'react-redux';

import Steps from './Steps';
import DownloadApp from './DownloadApp';
import SecurityVerify from './SecurityVerify';
import AuthForm from './AuthForm';

import { namespace } from './model';
import { useLang } from '../hookTool';
import { GOOGLE2FA_KEY } from '../common/constants';

const { NotificationProvider } = Notification;
const { SnackbarProvider } = Snackbar;
const STEPS_VALUE = {
  0: '0%',
  1: '70%',
  2: '80%',
  3: '90%',
};

const { useForm } = Form;

const useStyles = () => {
  return {
    root: css`
      width: 480px;
      margin: 0 auto;
      margin-bottom: 160px;
      padding-top: 25px;
      '.muilink-root': {
        cursor: pointer;
      }
    `,
    title: css`
      font-size: 34px;
      line-height: 48px;
      margin: 40px 0;
    `,
    skeleton: css`
      background: linear-gradient(90deg, #f2f2f2 25%, #e6e6e6 37%, #f2f2f2 63%);
      background-size: 400% 100%,
      color: transparent,
      'div,p,h1,h3,li,a': {
        color: transparent;
      }
    `,
    updateTitle: css`
      margin-bottom: 16px !important;
    `,
    alert: css`
      font-size: 12px;
      line-height: 20px;
      margin-bottom: 24px;
      '.mui-alert-root': {
        padding: 12px 16px 8px;
        '.mui-alert-description': {
          margin: 0;
        }
      }
    `,
    btn: css`
      margin-top: 35px;
    `,
    btnPrev: css`
      margin-top: 8px;
    `,
  };
};

const G2fa = (props = {}) => {
  const { onClickBread = () => {}, onSuccess = () => {} } = props;

  const classes = useStyles();
  const { message } = useSnackbar();

  const authForm = useRef(null);
  const securityForm = useRef(null);

  const [g2faVerify, setG2faVerify] = useState(false);
  const dispatch = useDispatch();
  const { securityMethods, activeStep, loading, userInfo } = useSelector(
    (state) => state[namespace],
  );
  const isSkeleton = !(securityMethods !== null && Object.keys(securityMethods).length);
  const isUpdate = securityMethods[GOOGLE2FA_KEY];

  const { t } = useLang();
  const bizType = isUpdate ? 'UPDATE_GOOGLE_2FA' : 'BIND_GOOGLE_2FA';
  const [form] = useForm();

  useEffect(() => {
    dispatch({ type: `${namespace}/getUserInfo` });
    dispatch({ type: `${namespace}/getSecurityMethods` });
    return () => {
      dispatch({ type: `${namespace}/resetInit` });
    };
  }, []);

  // 10min 倒计时，-- 如果 10min 没有重新操作的话，则回退一页
  const openCountTime = () => {
    let timer = null;
    return (function countTime() {
      if (timer) {
        clearTimeout(timer);
        return;
      }
      timer = setTimeout(() => {
        onClickBread();
      }, 600000);
    })();
  };

  const handleGetSecurityValue = () => {
    let formValue = null;
    // 校验表单值
    securityForm.current.validateFieldsAndScroll((err, values) => {
      if (!err) formValue = values;
    });
    if (!formValue) return false;
    formValue = {
      bizType,
      validations: { google_2fa: formValue.code },
    };
    return formValue;
  };

  const handleClickNext = async (e) => {
    e && e.preventDefault();
    if (loading) return;
    // 如果是更新，则需要判断是否能点击下一步
    if (isUpdate && !g2faVerify) {
      const payload = handleGetSecurityValue();
      if (!payload) return;
      await dispatch({ type: `${namespace}/verifyGoogleCode`, payload });
      openCountTime();
      setG2faVerify(true);
    }
    if (activeStep < 3) {
      dispatch({ type: `${namespace}/update`, payload: { activeStep: activeStep + 1 } });
      return;
    }

    form.validateFields().then(async (formValue) => {
      if (!formValue) return;
      console.log(formValue, 'formValue');
      try {
        dispatch({ type: `${namespace}/update`, payload: { loading: true } });
        // 如果不是更新发起的点击，则需要先校验验证码
        if (!isUpdate) {
          const isOk = await dispatch({
            type: `${namespace}/verifyCode`,
            payload: { ...formValue, bizType, callBack: openCountTime },
          });
          if (isOk) {
            message.success(t('g2fa.open.success'));
            onSuccess();
          }
          return;
        }
        const isOk = await dispatch({
          type: `${namespace}/updateG2fa`,
          payload: formValue,
        });
        if (isOk) {
          message.success(t('g2fa.update.success'));
          onSuccess();
        }
      } finally {
        dispatch({ type: `${namespace}/update`, payload: { loading: false } });
      }
    });
  };

  const handleClickPrev = async (e) => {
    e && e.preventDefault();
    dispatch({ type: `${namespace}/update`, payload: { activeStep: activeStep - 1 } });
  };

  const title = isUpdate ? t('g2fa.update.title') : t('g2fa.open.title');

  return (
    <Box css={classes.root}>
      <Breadcrumb
        css={`
          ${classes.breadcrumbs} ${isSkeleton ? classes.skeleton : null}
        `}
      >
        <Breadcrumb.Item onClick={onClickBread}>{t('security.title')}</Breadcrumb.Item>
        <Breadcrumb.Item>{title}</Breadcrumb.Item>
      </Breadcrumb>
      <div css={classes.container}>
        <h1
          css={`${classes.title} ${isUpdate ? classes.updateTitle : null}  ${
            isSkeleton ? classes.skeleton : null
          }`}
        >
          {title}
        </h1>
        {isUpdate ? (
          <div css={classes.alert}>
            <Alert type="complementary" description={t('g2fa.update.tips')} />
          </div>
        ) : null}
        <Steps value={STEPS_VALUE[activeStep]} />
        <div
          css={`
            ${classes.contBox} ${isSkeleton ? classes.skeleton : null}
          `}
        >
          {activeStep === 0 && !isSkeleton ? (
            !isUpdate ? (
              <DownloadApp />
            ) : (
              <SecurityVerify ref={securityForm} />
            )
          ) : null}
          <div style={{ display: activeStep > 0 ? 'block' : 'none' }}>
            <Form form={form}>
              <AuthForm
                userInfo={userInfo}
                bizType={bizType}
                isUpdate={isUpdate}
                activeStep={activeStep}
                ref={authForm}
                props={props}
              />
            </Form>
          </div>
        </div>
        <Button
          onClick={handleClickNext}
          loading={loading}
          css={classes.btn}
          fullWidth
          type="primary"
          size="large"
        >
          {activeStep === 3 ? t('g2fa.submit') : t('g2fa.next')}
        </Button>
        {activeStep > 0 && !isUpdate ? (
          <Button
            variant="text"
            css={classes.btnPrev}
            onClick={handleClickPrev}
            fullWidth
            type="submit"
            size="large"
          >
            {t('g2fa.prev')}
          </Button>
        ) : null}
      </div>
    </Box>
  );
};

export default (props) => {
  return (
    <ThemeProvider theme={props.theme || 'light'}>
      <SnackbarProvider>
        <NotificationProvider>
          <G2fa {...props} />
        </NotificationProvider>
      </SnackbarProvider>
    </ThemeProvider>
  );
};
