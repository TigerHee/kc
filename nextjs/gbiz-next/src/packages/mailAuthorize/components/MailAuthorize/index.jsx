/**
 * Owner: tiger@kupotech.com
 */
import React, { useEffect, useCallback, useState, useRef } from 'react';
import { noop } from 'lodash-es';
import {
  Dialog,
  Spin,
  Box,
  styled,
  useSnackbar,
  ThemeProvider,
  Snackbar,
  Notification,
} from '@kux/mui';
import { Trans } from 'tools/i18n';
import useLang from '../../hooks/useLang';
import { usePolling } from 'hooks';
import { saTrackForBiz } from '../../utils';
import { useMailAuthorizeStore } from './store';
import emailAuthorizeSvg from './assets/email-authorize.svg';

const { SnackbarProvider } = Snackbar;
const { NotificationProvider } = Notification;

/** style开始 */
const Content = styled.main`
  font-size: 14px;
  color: ${(props) => props.theme.colors.text};
`;
const ImgBox = styled.section`
  text-align: center;
`;
const Title = styled.h2`
  font-weight: 500;
  font-size: 18px;
  margin-top: 35px;
`;
const Guide = styled.p`
  margin-top: 24px;
  .highlight {
    color: ${(props) => props.theme.colors.primary};
  }
  span {
    color: ${(props) => props.theme.colors.primary};
  }
`;
const Tip = styled.p`
  margin-top: 24px;
  color: ${(props) => props.theme.colors.text60};
`;
const NoReceiveMail = styled.section`
  margin-top: 36px;
  color: ${(props) => props.theme.colors.text60};
  .highlight {
    color: ${(props) => props.theme.colors.text};
  }
  div {
    span {
      color: ${(props) => props.theme.colors.text};
    }
  }
`;
const NoReceiveMailTitle = styled.div`
  font-weight: 500;
  margin-bottom: 12px;
  color: ${(props) => props.theme.colors.text};
`;
const TextButton = styled.a`
  cursor: ${(props) => (props.disabled ? 'default' : 'pointer')};
  color: ${(props) => (props.disabled ? props.theme.colors.text60 : props.theme.colors.primary)};
`;
/** style结束 */

const NormalmailAuthorize = ({
  bizType,
  onSuccess = () => {},
  open = false,
  checkRiskParams = null,
}) => {
  const { t } = useLang();
  const timer = useRef(null);
  const { message } = useSnackbar();
  const visible = useMailAuthorizeStore((state) => state.visible);
  const email = useMailAuthorizeStore((state) => state.email);
  const checkRisk = useMailAuthorizeStore((state) => state.checkRisk);
  const reset = useMailAuthorizeStore((state) => state.reset);
  const getMailVerifyResult = useMailAuthorizeStore((state) => state.getMailVerifyResult);

  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(0);

  const disabled = count > 0;

  const onError = useCallback((e, hideMessage) => {
    if (!hideMessage && e?.msg) message.error(e.msg);
    // 500017： 授权过期   500020： 授权失败
    if (['500017', '500020'].includes(e?.code)) {
      reset();
    }
  }, [message, reset]);

  const clearTimer = useCallback(() => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
  }, []);

  const countdown = useCallback((nextCount) => {
    setCount(nextCount);
    if (nextCount <= 0) {
      clearTimer();
    } else {
      timer.current = setTimeout(() => countdown(nextCount - 1), 1000);
    }
  }, [clearTimer]);

  // 使用 usePolling hook 来替代 dva polling
  const polling = usePolling(
    async () => {
      await getMailVerifyResult({
        onSuccess,
        onError,
      });
    },
    {
      interval: 5 * 1000,
      autoStart: false,
      immediate: true,
    }
  );

  useEffect(() => {
    if (open && checkRiskParams) {
      checkRisk({
        bizType,
        params: checkRiskParams,
        onSuccess,
        onError,
      });
    }
  }, [open, checkRiskParams, bizType, checkRisk, onSuccess, onError]);

  useEffect(() => {
    return () => {
      clearTimer();
      polling.stop();
    };
  }, [polling, clearTimer]);

  useEffect(() => {
    if (visible) {
      polling.start();
      saTrackForBiz({}, ['emailAuthorizationRestart', '1']);
    } else {
      setCount(0);
      setLoading(false);
      clearTimer();
      polling.stop();
    }
  }, [visible, polling, clearTimer]);

  const onCancel = useCallback(() => {
    reset();
  }, [reset]);

  const resendEmail = useMailAuthorizeStore((state) => state.resendEmail);

  const resend = () => {
    if (disabled || loading) return;
    setLoading(true);
    saTrackForBiz({ saType: 'click' }, ['emailAuthorizationRestart', '1']);
    resendEmail({ bizType })
      .then((res) => {
        if (res?.success) {
          message.success(t('iBsXv5QsHeP8wpAWSNFZaS'));
          countdown(60);
          polling.stop();
          polling.start();
        }
      })
      .catch((e) => onError(e, true))
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Dialog
      footer={null}
      open={visible}
      title={t('baXa9AEkqjrk9YkLe9nM7g')}
      onCancel={loading ? noop : onCancel}
    >
      <Content>
        <ImgBox>
          <img src={emailAuthorizeSvg} alt="" />
        </ImgBox>
        <Title>{t('8JDS5CK7Qg2C7eFKb5cYvq')}</Title>
        <Guide>
          <Trans i18nKey="qvXxQhQy1SeuAxmM51aFE3" ns="common-base" values={{ email }} />
        </Guide>
        <Tip>{t('aWraMbu1VTMzskoUX44puZ')}</Tip>
        <NoReceiveMail>
          <NoReceiveMailTitle>{t('bGGSwLk9n6gSxapYQMzad4')}</NoReceiveMailTitle>
          <div>
            1.
            <Trans i18nKey="3pJd1o7HS7Mc7RP61KBt3j" ns="common-base" />
          </div>
          <div>
            2.
            <Trans i18nKey="8E7WgVPbNC4K56218gDkPu" ns="common-base" />
          </div>
          <div>
            3.{t('5H1kxNCtmaz678kvjrsyPF')}{' '}
            <Box display="inline-block">
              <Spin spinning={loading}>
                <TextButton onClick={resend} disabled={disabled}>
                  {disabled
                    ? t('vt2AqpbRG2bxpioX9zDQYS', { a: count })
                    : t('puaUwRAmKgrg7fdRQ3F2mN')}
                </TextButton>
              </Spin>
            </Box>
          </div>
        </NoReceiveMail>
      </Content>
    </Dialog>
  );
};

export default React.memo((props) => {
  return (
    <ThemeProvider theme={props.theme || 'theme'}>
      <SnackbarProvider>
        <NotificationProvider>
          <NormalmailAuthorize {...props} />
        </NotificationProvider>
      </SnackbarProvider>
    </ThemeProvider>
  );
});
