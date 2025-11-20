/**
 * Owner: willen@kupotech.com
 */
import React, { useEffect, useCallback } from 'react';
import noop from 'lodash/noop';
import { useSelector, useDispatch } from 'react-redux';
import QrCode from 'qrcode.react';
import { Button, Spin, Box, styled } from '@kux/mui';
import storage from '@utils/storage';
import { kcsensorsManualTrack, getTrackingSource } from '@utils/sensors';
import { ICScanOutlined, ICRefreshOutlined, ICSuccessFilled } from '@kux/icons';

import {
  SCAN_AUTHORIZED,
  SCAN_EXPIRED,
  SCAN_CANCELED,
  SCAN_SCANNED,
  SCAN_RISK,
  NAMESPACE,
  SCAN_LOGIN_TAB_KEY,
} from '../../constants';

import { useLang } from '../../../hookTool';

const QrBox = styled.div`
  width: 260px;
  height: 260px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  border: 1px solid ${({ theme }) => theme.colors.divider8};
  background: #fff;
  box-shadow: 0 0 1px rgba(0, 0, 0, 0.1), 0 8px 16px rgba(0, 0, 0, 0.05);
  border-radius: 8px;
  margin: 0 auto;
  overflow: hidden;
`;

const Mask = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 100;
  background: rgba(255, 255, 255, 0.8);
`;

const MaskContent = styled.div`
  width: 260px;
  height: 260px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 20px;
  button {
    background: ${({ theme }) => (theme.currentTheme === 'light' ? theme.colors.cover : '#00C288')};
    color: ${({ theme }) =>
      theme.currentTheme === 'light' ? theme.colors.textEmphasis : theme.colors.cover};
    :hover {
      background: ${({ theme }) =>
        theme.currentTheme === 'light' ? theme.colors.cover : '#00C288'};
    }
  }
  p {
    font-style: normal;
    font-weight: 600;
    font-size: 18px;
    line-height: 150%;
    text-align: center;
    color: ${({ theme }) => theme.colors.tip};
    margin-bottom: 24px;
  }
  .scanedText {
    width: 210px;
    text-align: center;
    margin-top: 10px;
    font-size: 18px;
    font-weight: 600;
    line-height: 24px;
    color: ${({ theme }) => theme.colors.tip};
  }
`;

const Info = styled.p`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 24px;
  svg {
    color: ${({ theme }) => theme.colors.icon};
  }
  > span {
    font-weight: 500;
    font-size: 16px;
    line-height: 130%;
    color: ${({ theme }) => theme.colors.text60};
    margin-left: 10px;
    .link {
      color: ${(props) => props.theme.colors.primary};
    }
  }
`;

const ForgetBottomBox = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 24px;
`;

function ScanLogin(props = {}) {
  const { onSuccess = noop, forgetBottom, trackingConfig } = props;

  const dispatch = useDispatch();
  const { t } = useLang();

  const { status, initToken } = useSelector((state) => state[NAMESPACE]);

  const watchPolling = useCallback(() => {
    dispatch({
      type: `${NAMESPACE}/watchPolling`,
      payload: { effect: 'getStatus', interval: 5000 },
    });
  }, []);

  // 取消轮训
  const cancelPolling = useCallback(() => {
    dispatch({
      type: `${NAMESPACE}/getStatus@polling:cancel`,
    });
  }, []);

  // 开始轮训
  const startPolling = useCallback(() => {
    dispatch({
      type: `${NAMESPACE}/getStatus@polling`,
    });
  }, []);

  // 获取token
  const getToken = useCallback((refresh = false) => {
    kcsensorsManualTrack({
      spm: ['scaneLoginGetToken', '1'],
      data: { type: refresh ? 'refresh' : 'new' },
    });
    dispatch({
      type: `${NAMESPACE}/getToken`,
    }).then(() => {
      startPolling();
    });
  }, []);

  // 验证token
  const validationToken = useCallback(() => {
    const source = getTrackingSource(trackingConfig);
    dispatch({
      type: `${NAMESPACE}/validateToken`,
      trackResultParams: { source },
    }).then((success) => {
      if (success) {
        cancelPolling();
        const params = { finishUpgrade: true };
        storage.setItem('kucoinv2_login_key', SCAN_LOGIN_TAB_KEY);
        onSuccess(params);
      }
    });
  }, []);

  // reset Token state
  const resetScanState = useCallback(() => {
    dispatch({
      type: `${NAMESPACE}/resetScan`,
    });
  }, []);

  // 刷新token
  const reGetToken = useCallback(() => {
    resetScanState();
    getToken(true);
  }, []);

  useEffect(() => {
    switch (status) {
      case SCAN_AUTHORIZED:
        cancelPolling();
        validationToken();
        break;
      case SCAN_RISK:
        cancelPolling();
        break;
      case SCAN_EXPIRED:
      case SCAN_CANCELED:
        cancelPolling();
        break;
      default:
        break;
    }
  }, [status]);

  useEffect(() => {
    watchPolling();
    getToken();
  }, []);

  useEffect(() => {
    return () => {
      cancelPolling();
      resetScanState();
    };
  }, []);

  const enCodeToken = encodeURIComponent(`kucoin:///authorizeToken?token=${initToken}`);

  return (
    <>
      <QrBox data-inspector="signin_qrbox">
        {initToken === undefined ? (
          <Box>
            <Spin size="xsmall" spinning />
          </Box>
        ) : (
          <Box data-inspector="signin_qrbox_qrcode">
            <QrCode value={`${window.location.origin}?link=${enCodeToken}`} size={220} />
          </Box>
        )}
        {status === SCAN_EXPIRED || status === SCAN_CANCELED ? (
          <Mask>
            <MaskContent>
              <p>{status === SCAN_EXPIRED ? t('qr.validate') : t('qr.canceled')}</p>
              <Button
                type="primary"
                size="large"
                onClick={reGetToken}
                startIcon={<ICRefreshOutlined />}
              >
                {t('qr.refresh')}
              </Button>
            </MaskContent>
          </Mask>
        ) : null}
        {status === SCAN_SCANNED || status === SCAN_AUTHORIZED ? (
          <Mask>
            <MaskContent>
              <ICSuccessFilled color="#01BC8D" size={36} />
              <div className="scanedText">
                {status === SCAN_SCANNED ? t('qr.scanned.text') : t('qr.authorized.text')}
              </div>
            </MaskContent>
          </Mask>
        ) : null}
      </QrBox>
      <Info>
        <ICScanOutlined size="24" />
        <span>{t('scan.tip')}</span>
      </Info>
      {forgetBottom ? <ForgetBottomBox>{forgetBottom}</ForgetBottomBox> : null}
    </>
  );
}

export default ScanLogin;
