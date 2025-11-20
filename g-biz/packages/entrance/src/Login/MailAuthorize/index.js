/**
 * Owner: willen@kupotech.com
 */

import { useEffect, useCallback, useMemo } from 'react';
import { throttle } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { Trans } from '@tools/i18n';
import { Box, useTheme, useSnackbar, isPropValid, styled, Divider } from '@kux/mui';

import { getTrackingSource, kcsensorsManualTrack } from '@utils/sensors';
import { NAMESPACE } from '../constants';
import { useLang } from '../../hookTool';
import { MAIL_AUTHORIZE_EXPIRE_CODE, TOKEN_INVALID_CODE } from '../../common/constants';
import emailAuthorizeSvg from '../../../static/email-authorize.svg';
import emailAuthorizeSvgDark from '../../../static/email-authorize-dark.svg';

const Title = styled.h2`
  font-weight: 600;
  font-size: 24px;
  line-height: 130%;
  margin-top: 12px;
  margin-bottom: 0;
  text-align: center;
  color: ${({ theme }) => theme.colors.text};
  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 18px;
    line-height: 26px;
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

const NoReceiveMailImgWrap = styled('div')`
  display: flex;
  flex-flow: nowrap row;
  align-items: center;
  justify-content: center;
`;

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
  };
});

export default function MailAuthorize(props) {
  const { onSuccess, trackingConfig = {}, classes = {}, inDrawer, onBack } = props;
  const theme = useTheme();
  const { currentTheme } = theme;
  const { message } = useSnackbar();
  const { t } = useLang();
  const dispatch = useDispatch();
  const { email } = useSelector((state) => state[NAMESPACE]);
  const tracksourceParam = getTrackingSource(trackingConfig);

  useEffect(() => {
    kcsensorsManualTrack({ kc_pageid: 'B1EmailAuthorization', spm: ['B1EmailAuthorization', 1] });
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
      payload: { onSuccess, trackResultParams: { source: tracksourceParam } },
    });
  }, [dispatch, onSuccess, tracksourceParam]);

  const cancelPolling = useCallback(() => {
    dispatch({ type: `${NAMESPACE}/getMailVerifyResult@polling:cancel` });
  }, []);

  const resent = useMemo(
    () =>
      throttle(
        () => {
          kcsensorsManualTrack(
            { kc_pageid: 'B1EmailAuthorization', spm: ['B1EmailAuthorization', ['restart', '1']] },
            'page_click',
          );
          dispatch({ type: `${NAMESPACE}/resendMail` })
            .then((res) => {
              if (res?.success) {
                message.success(t('voice_send_success'));
                cancelPolling();
                startPolling();
              }
            })
            .catch((e) => {
              // 授权过期, 返回第一步登录
              if (e?.code === MAIL_AUTHORIZE_EXPIRE_CODE || e?.code === TOKEN_INVALID_CODE) {
                onBack?.();
              }
            });
        },
        5000,
        { leading: true },
      ),
    [dispatch, message, t, cancelPolling, startPolling, onBack],
  );

  return (
    <Box display="flex" flexDirection="column" height="100%" data-inspector="signin_mail_authorize">
      <Content flex="1" inDrawer={inDrawer}>
        <NoReceiveMailImgWrap>
          <NoReceiveMailImg
            as="img"
            src={currentTheme === 'dark' ? emailAuthorizeSvgDark : emailAuthorizeSvg}
            alt=""
          />
        </NoReceiveMailImgWrap>
        <Title className={classes.title} theme={theme}>
          {t('rXv9y4kZ7AccZiMLqYTBro')}
        </Title>
        <Guide className={classes.guide} theme={theme}>
          <Trans i18nKey="ciQtQYEL8RXabtae6Khqnq" ns="entrance" values={{ a: email }}>
            _<span className="highlight">_</span>_
          </Trans>
        </Guide>
        <Tip theme={theme} className={classes.tip}>
          {t('fxAot6UBzQXyeX717mTesc')}
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
                onClick={resent}
                data-inspector="signin_mail_authorize-resent"
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
