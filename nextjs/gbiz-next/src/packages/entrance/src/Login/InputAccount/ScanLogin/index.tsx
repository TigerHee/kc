/**
 * Owner: sean.shi@kupotech.com
 */
import React, { useEffect, useCallback, useRef } from 'react';
import noop from 'lodash-es/noop';
import QrCode from 'qrcode.react';
import clsx from 'clsx';
import { Button, Spin, Box } from '@kux/mui';
import { useTheme } from '@kux/design';
import { ICScanOutlined, ICRefreshOutlined, ICSuccessFilled } from '@kux/icons';
import storage from 'tools/storage';
import { kcsensorsManualTrack } from 'tools/sensors';
import {
  SCAN_AUTHORIZED,
  SCAN_EXPIRED,
  SCAN_CANCELED,
  SCAN_SCANNED,
  SCAN_RISK,
  SCAN_LOGIN_TAB_KEY,
} from '../../constants';
import { useLang } from '../../../hookTool';
import { useLoginStore } from '../../model';
import { getTrackingSource } from '../../../common/tools';
import styles from './index.module.scss';

type Props = {
  onSuccess?: (params?: any) => void;
  forgetBottom?: React.ReactNode;
  trackingConfig?: any;
};

function ScanLogin(props: Props = { onSuccess: noop }) {
  const { onSuccess = noop, forgetBottom, trackingConfig } = props;
  const { t } = useLang();

  const theme = useTheme();

  // zustand
  const status = useLoginStore(state => state.status);
  const initToken = useLoginStore(state => state.initToken);
  const getToken = useLoginStore(state => state.getToken);
  const getStatus = useLoginStore(state => state.getStatus);
  const validateToken = useLoginStore(state => state.validateToken);
  const resetScan = useLoginStore(state => state.resetScan);

  const pollingRef = useRef<number | null>(null);
  const getStatusRef = useRef(getStatus);
  const getTokenRef = useRef(getToken);
  const validateTokenRef = useRef(validateToken);
  const resetScanRef = useRef(resetScan);

  // 更新refs
  getStatusRef.current = getStatus;
  getTokenRef.current = getToken;
  validateTokenRef.current = validateToken;
  resetScanRef.current = resetScan;

  const stopPolling = useCallback(() => {
    if (pollingRef.current) {
      window.clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
  }, []);

  const startPolling = useCallback(() => {
    stopPolling();
    pollingRef.current = window.setInterval(() => {
      getStatusRef.current?.();
    }, 5000);
  }, [stopPolling]);

  // 获取token
  const fetchToken = useCallback(
    async (refresh = false) => {
      kcsensorsManualTrack({
        spm: ['scaneLoginGetToken', '1'],
        data: { type: refresh ? 'refresh' : 'new' },
      });
      await getTokenRef.current?.();
      startPolling();
    },
    [startPolling]
  );

  // 验证token
  const validationToken = useCallback(async () => {
    const source = getTrackingSource(trackingConfig);
    const success = await validateTokenRef.current?.({ trackResultParams: { source } });
    if (success) {
      stopPolling();
      const params = { finishUpgrade: true };
      storage.setItem('kucoinv2_login_key', SCAN_LOGIN_TAB_KEY);
      onSuccess(params);
    }
  }, [onSuccess, stopPolling, trackingConfig]);

  // 刷新token
  const reGetToken = useCallback(() => {
    resetScanRef.current?.();
    fetchToken(true);
  }, [fetchToken]);

  // 监听状态变化
  useEffect(() => {
    switch (status) {
      case SCAN_AUTHORIZED:
        stopPolling();
        validationToken();
        break;
      case SCAN_RISK:
      case SCAN_EXPIRED:
      case SCAN_CANCELED:
        stopPolling();
        break;
      default:
        break;
    }
  }, [status, stopPolling, validationToken]);

  // 初始化
  useEffect(() => {
    fetchToken();
    return () => {
      stopPolling();
      resetScan?.();
    };
  }, []); // 移除不稳定的函数依赖，只在组件挂载时执行一次

  const enCodeToken = encodeURIComponent(`kucoin:///authorizeToken?token=${initToken}`);

  return (
    <>
      <div className={clsx(styles.qrBox)} data-inspector="signin_qrbox">
        {initToken === undefined ? (
          <Box>
            <Spin size="xsmall" spinning />
          </Box>
        ) : (
          <Box data-inspector="signin_qrbox_qrcode">
            <QrCode value={`${typeof window !== 'undefined' ? window.location.origin : ''}?link=${enCodeToken}`} size={220} />
          </Box>
        )}
        {status === SCAN_EXPIRED || status === SCAN_CANCELED ? (
          <div className={clsx(styles.mask)}>
            <div className={clsx(styles.maskContent)}>
              <p>{status === SCAN_EXPIRED ? t('qr_validate') : t('qr_canceled')}</p>
              <Button
                className={clsx(styles.btn, {
                  [styles.btnDark]: theme === 'dark',
                })}
                type="primary"
                size="large"
                onClick={reGetToken}
                startIcon={<ICRefreshOutlined />}
              >
                {t('qr_refresh')}
              </Button>
            </div>
          </div>
        ) : null}
        {status === SCAN_SCANNED || status === SCAN_AUTHORIZED ? (
          <div className={clsx(styles.mask)}>
            <div className={clsx(styles.maskContent)}>
              <ICSuccessFilled color="var(--kux-brandGreen)" size={36} />
              <div className={clsx(styles.scanedText)}>
                {status === SCAN_SCANNED ? t('qr_scanned_text') : t('qr_authorized_text')}
              </div>
            </div>
          </div>
        ) : null}
      </div>
      <p className={clsx(styles.info)}>
        <ICScanOutlined size="24" />
        <span>{t('scan_tip')}</span>
      </p>
      {forgetBottom ? <div className={clsx(styles.forgetBottomBox)}>{forgetBottom}</div> : null}
    </>
  );
}

export default ScanLogin;
