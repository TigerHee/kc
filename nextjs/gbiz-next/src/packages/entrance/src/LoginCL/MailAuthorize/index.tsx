/**
 * Owner: sean.shi@kupotech.com
 */
import React, { useEffect, useCallback, useMemo } from 'react';
import { throttle, noop } from 'lodash-es';
import { useSnackbar, Box, Divider, useTheme } from '@kux/mui';
import clsx from 'clsx';
import { kcsensorsManualTrack } from 'tools/sensors';
import { Trans } from 'tools/i18n';
import { getTrackingSource } from '../../common/tools';
import { useLang } from '../../hookTool';
import { MAIL_AUTHORIZE_EXPIRE_CODE } from '../../common/constants';
import { useLoginStore } from '../../Login/model';
import styles from './index.module.scss';
import { Empty } from '@kux/design';

interface MailAuthorizeProps {
  onSuccess?: () => void;
  trackingConfig?: any;
  classes?: Record<string, string>;
  inDrawer?: boolean;
  onBack?: () => void;
}

const MailAuthorize: React.FC<MailAuthorizeProps> = ({
  onSuccess,
  trackingConfig = {},
  classes = {},
  inDrawer,
  onBack,
}) => {
  const { t } = useLang();
  const { message } = useSnackbar();
  const { currentTheme } = useTheme();
  const email = useLoginStore(state => state.email);
  const riskTag = useLoginStore(state => state.riskTag);
  const isShowMailAuthorizePage = useLoginStore(state => state.isShowMailAuthorizePage);
  const getMailVerifyResult = useLoginStore(state => state.getMailVerifyResult);
  const resendMail = useLoginStore(state => state.resendMail);

  const tracksourceParam = getTrackingSource(trackingConfig);

  const startPolling = useCallback(() => {
    getMailVerifyResult?.({ onSuccess, trackResultParams: { source: tracksourceParam } });

    const timer = setInterval(() => {
      getMailVerifyResult?.({ onSuccess, trackResultParams: { source: tracksourceParam } });
    }, 5000);

    return () => {
      clearInterval(timer);
    };
  }, [onSuccess, tracksourceParam, getMailVerifyResult]);

  useEffect(() => {
    kcsensorsManualTrack({ kc_pageid: 'B1EmailAuthorization', spm: ['B1EmailAuthorization', 1] });
    const cleanup = startPolling();

    return cleanup;
  }, [startPolling]);

  const resent = useMemo(
    () =>
      throttle(
        async () => {
          kcsensorsManualTrack(
            { kc_pageid: 'B1EmailAuthorization', spm: ['B1EmailAuthorization', ['restart', '1']] },
            'page_click'
          );
          try {
            const res = await resendMail?.();
            if (res?.success) {
              message.success(t('voice_send_success'));
              startPolling();
            }
          } catch (e: any) {
            if (e?.code === MAIL_AUTHORIZE_EXPIRE_CODE) {
              onBack?.();
            }
          }
        },
        5000,
        { leading: true }
      ),
    [startPolling, resendMail, message, t, onBack]
  );

  return (
    <Box display="flex" flexDirection="column" height="100%" data-inspector="signin_mail_authorize">
      <div className={clsx(styles.content, inDrawer && styles.inDrawer)}>
        <Empty className={styles.icon} name="warn" size="small" theme="auto" />
        <h2 className={clsx(styles.title, classes.title)}>{t('rXv9y4kZ7AccZiMLqYTBro')}</h2>
        <div className={clsx(styles.guide, classes.guide)}>
          <Trans i18nKey="ciQtQYEL8RXabtae6Khqnq" ns="entrance" values={{ a: email }}>
            _<span className={styles.highlight}>_</span>_
          </Trans>
        </div>
        <div className={clsx(styles.tip, classes.tip)}>{t('fxAot6UBzQXyeX717mTesc')}</div>
        <Divider className={styles.kcDivider} />
        <div className={clsx(styles.noReceiveMail, classes.noReceiveMail)}>
          <div className={clsx(styles.noReceiveMailTitle, classes.noReceiveMailTitle)}>
            {t('pN4HQ7gVKL8y3bJhqERfHF')}
          </div>
          <div>
            <Trans i18nKey="qUDyvur199QMeNMDRT39qb" ns="entrance">
              _<span className={styles.highlight}>_</span>_
            </Trans>
          </div>
          <div>
            <Trans i18nKey="tDWJZxy1MDHzVhmWsg1mdV" ns="entrance">
              _<span className={styles.highlight}>_</span>
            </Trans>
          </div>
          <div>
            <Trans i18nKey="3SUHx4KsXKkvMZw1TgBChZ" ns="entrance">
              _
              <Box
                as="a"
                className={styles.resent}
                onClick={!riskTag && isShowMailAuthorizePage ? noop : resent}
                data-inspector="signin_mail_authorize-resent"
              >
                _
              </Box>
            </Trans>
          </div>
        </div>
      </div>
    </Box>
  );
};

export default MailAuthorize;
