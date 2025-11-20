/**
 * Owner: roger@kupotech.com
 */
import React, { useEffect, useCallback, useMemo } from 'react';
import { throttle, noop } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { Trans } from '@tools/i18n';
import { isPropValid, styled, useTheme, useSnackbar, Box, Divider } from '@kux/mui';
import { NAMESPACE } from '../constants';
import { useLang } from '../../hookTool';
import { MAIL_AUTHORIZE_EXPIRE_CODE } from '../../common/constants';
import { kcsensorsManualTrack } from '../../common/tools';
import emailAuthorizeSvg from '../../../static/email-authorize.svg';
import emailAuthorizeSvgDark from '../../../static/email-authorize-dark.svg';

const Title = styled.h2`
  font-weight: 600;
  font-size: 24px;
  line-height: 130%;
  margin-top: 24px;
  margin-bottom: 0;
  color: ${({ theme }) => theme.colors.text};
  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 18px;
    line-height: 26px;
    text-align: center;
  }
`;

const Guide = styled(Box)`
  font-weight: 400;
  font-size: 16px;
  line-height: 130%;
  margin-top: 24px;
  color: ${({ theme }) => theme.colors.text60};
  & .highlight {
    color: ${({ theme }) => theme.colors.primary};
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 14px;
    line-height: 20px;
    text-align: center;
  }
`;

const Tip = styled(Box)`
  font-weight: 400;
  font-size: 16px;
  line-height: 130%;
  margin-top: 24px;
  color: ${({ theme }) => theme.colors.text40};
  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 14px;
    line-height: 20px;
    text-align: center;
  }
`;

const KCDivider = styled(Divider)`
  margin: 24px 0;
`;

const NoReceiveMail = styled(Box, {
  shouldForwardProp: (props) => isPropValid(props),
})(({ theme }) => {
  return {
    lineHeight: '24px',
    color: theme.colors.text40,
    fontSize: '16px',
    '& .highlight': {
      color: theme.colors.text,
      fontWeight: 500,
    },
    '& .resent': {
      color: theme.colors.primary,
      cursor: 'pointer',
    },
    '@media screen and (max-width: 768px)': {
      fontSize: '16px',
      lineHeight: '20px',
      width: '100%',
      textAlign: 'center',
    },
  };
});

const NoReceiveMailTitle = styled('div', {
  shouldForwardProp: (props) => isPropValid(props),
})(({ theme }) => {
  return {
    marginBottom: 12,
    color: theme.colors.text,
    fontWeight: 600,
    lineHeight: '130%',
    '@media screen and (max-width: 768px)': {
      fontWeight: 500,
    },
  };
});

const NoReceiveMailImg = styled(Box, {
  shouldForwardProp: (props) => isPropValid(props),
})(() => {
  return {
    width: 136,
    height: 136,
  };
});

const Content = styled(Box, {
  shouldForwardProp: (props) => isPropValid(props),
})(({ inDrawer }) => {
  return {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: inDrawer ? '0 32px' : '0px',
    flex: 1,
    '@media screen and (max-width: 768px)': {
      alignItems: 'center',
    },
  };
});

export default function ForgetPwdAuthorize(props) {
  const { classes = {}, inDrawer } = props;

  const theme = useTheme();

  const { currentTheme } = theme;

  const { message } = useSnackbar();

  const { t } = useLang();
  const dispatch = useDispatch();

  const { displayEmail, riskTag, isShowAuthorizePage } = useSelector((state) => state[NAMESPACE]);

  useEffect(() => {
    kcsensorsManualTrack(
      {
        checkID: false,
        data: { page_id: 'B1EmailAuthorizationforgetPassword' },
      },
      'expose',
    );
    dispatch({
      type: `${NAMESPACE}/triggerPolling`,
    }).then(() => {
      startPolling();
    });
    return () => {
      cancelPolling();
    };
  }, []);

  const startPolling = useCallback(() => {
    dispatch({
      type: `${NAMESPACE}/getMailVerifyResult@polling`,
    });
  }, []);

  const cancelPolling = useCallback(() => {
    dispatch({
      type: `${NAMESPACE}/getMailVerifyResult@polling:cancel`,
    });
  }, []);

  const resent = useMemo(
    () =>
      throttle(
        () => {
          kcsensorsManualTrack(
            {
              kc_pageid: 'B1EmailAuthorizationforgetPassword',
              spm: ['B1EmailAuthorizationforgetPassword', ['restart', '1']],
            },
            'page_click',
          );
          dispatch({
            type: `${NAMESPACE}/resendMail`,
          })
            .then((res) => {
              if (res?.success) {
                message.success(t('voice_send_success'));
                cancelPolling();
                startPolling();
              }
            })
            .catch((e) => {
              // 授权过期, 返回第一步登录
              if (e?.code === MAIL_AUTHORIZE_EXPIRE_CODE) {
                dispatch({
                  type: `${NAMESPACE}/reset`,
                });
              }
            });
        },
        5000,
        { leading: true },
      ),
    [startPolling, cancelPolling],
  );

  return (
    <Box display="flex" flexDirection="column" height="100%">
      <Content flex="1" inDrawer={inDrawer}>
        <NoReceiveMailImg
          as="img"
          src={currentTheme === 'dark' ? emailAuthorizeSvgDark : emailAuthorizeSvg}
          alt="receiveMailImg"
        />
        <Title className={classes.title} theme={theme}>
          {t('ceMRFBcioziivREZjWSbmj')}
        </Title>
        <Guide className={classes.guide} theme={theme}>
          <Trans i18nKey="msdWaUrfiS4AUyvebgvKYm" ns="entrance" values={{ a: displayEmail }}>
            _<span className="highlight">_</span>_
          </Trans>
        </Guide>
        <Tip theme={theme} className={classes.tip}>
          {t('2dwSCBRo4BhnQ4wRjDnMUt')}
        </Tip>
        <KCDivider color={theme.colors.divider} />
        <NoReceiveMail className={classes.noReceiveMail}>
          <NoReceiveMailTitle className={classes.noReceiveMailTitle}>
            {t('pN4HQ7gVKL8y3bJhqERfHF')}
          </NoReceiveMailTitle>
          <div>
            <Trans i18nKey="qUDyvur199QMeNMDRT39qb" ns="entrance">
              _<span className="highlight">_</span>_
            </Trans>
          </div>
          <div>
            <Trans i18nKey="tDWJZxy1MDHzVhmWsg1mdV" ns="entrance">
              _<span className="highlight">_</span>
            </Trans>
          </div>
          <div>
            <Trans i18nKey="3SUHx4KsXKkvMZw1TgBChZ" ns="entrance">
              _
              <Box
                as="a"
                className="resent"
                onClick={!riskTag && isShowAuthorizePage ? noop : resent}
              >
                _
              </Box>
            </Trans>
          </div>
        </NoReceiveMail>
      </Content>
    </Box>
  );
}
