/**
 * Owner: Lena@kupotech.com
 */
import { useLocale } from '@kucoin-base/i18n';
import { ICRefreshOutlined } from '@kux/icons';
import { Alert, Button, Spin, styled, useResponsive, useSnackbar } from '@kux/mui';
import QRCode from 'qrcode.react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import * as services from 'services/kyc';
import { _t } from 'src/tools/i18n';
import ResetIcon from 'static/account/kyc/reset.svg';
import { getAllLocaleMap } from 'tools/i18n';
import { kcsensorsManualExpose, saTrackForBiz, trackClick } from 'utils/ga';
import siteConfig from 'utils/siteConfig';
import useCountDown from './useCountDown';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const Desc = styled.div`
  width: 100%;
  text-align: left;
  font-weight: 700;
  font-size: 24px;
  line-height: 130%;
  margin-bottom: 64px;
  color: ${(props) => props.theme.colors.text};
  ${(props) => props.theme.breakpoints.down('sm')} {
    margin-bottom: 24px;
    font-size: 16px;
  }
`;
const QRCodeWrapper = styled.div`
  position: relative;
  margin-bottom: 8px;
`;
const ResetQRCode = styled.div`
  font-size: 14px;
  line-height: 130%;
  text-align: center;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  font-weight: ${(props) => (props.second > 0 ? '400' : '400')};
  cursor: ${(props) => (props.second > 0 ? 'auto' : 'pointer')};
  color: ${(props) => props.theme.colors.text60};
  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 14px;
  }
`;
const RefreshIcon = styled(ICRefreshOutlined)`
  font-size: 20px;
  margin-right: 8px;
  color: ${({ theme }) => theme.colors.icon};
`;
const BtnWrapper = styled.div`
  margin-top: 8px;
  padding: 20px 32px;
  width: 100%;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: flex-end;
  border-top: 1px solid ${(props) => props.theme.colors.divider8};
  ${(props) => props.theme.breakpoints.down('sm')} {
    padding: 20px 16px;
  }
  .KuxButton-root {
    &:last-of-type {
      min-width: 160px;
    }
  }
`;
const PreButton = styled(Button)`
  color: ${(props) => props.theme.colors.text60};
  margin-right: 24px;
`;
const Mask = styled.div`
  width: 180px;
  height: 180px;
  background: rgba(255, 255, 255, 0.84);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  cursor: pointer;

  & > img {
    width: 24px;
    height: 24px;
    margin-bottom: 10px;
  }
  & > p {
    margin: 0;
    color: rgba(0, 13, 29, 1);
    font-weight: 500;
    font-size: 14px;
    line-height: 130%;
    text-align: center;
  }
`;

const ScanQRCode = ({ advanceUrl, expireSecond, onOk, onSupplierCallback }) => {
  const rv = useResponsive();
  const isH5 = !rv?.sm;
  const validityPeriod = expireSecond || 3600; // 二维码有效期
  const freezePeriod = 30; // 生成二维码冷却时间
  const [isCompleted, setIsCompleted] = useState(true); //是否完成扫脸
  const [second, setSecond, clearTimerRef, setReset] = useCountDown(freezePeriod);
  const [second1, setSecond1, clearTimerRef1, setReset1] = useCountDown(validityPeriod);
  const [isExpired, setIsExpired] = useState(false);
  const [url, setUrl] = useState(advanceUrl);
  const [loading, setLoading] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const { kyc2ChannelInfo } = useSelector((state) => state.kyc);
  const { KUCOIN_HOST } = siteConfig;
  const { message } = useSnackbar();
  const { currentLang } = useLocale();
  const alllanguage = getAllLocaleMap() || {};
  const language = currentLang === window._DEFAULT_LANG_ ? '' : `/${alllanguage[currentLang]}`;

  useEffect(() => {
    setUrl(advanceUrl);
  }, [advanceUrl]);

  useEffect(() => {
    return () => {
      clearTimerRef();
      clearTimerRef1();
    };
  }, []);

  useEffect(() => {
    kcsensorsManualExpose(
      [],
      {
        liveness_status: 'start',
        liveness_result: '',
        failed_reason: '',
        message: '',
        supplier_name: 'advance_liveness',
        method_type: 'qrcode',
      },
      'kyc2_get_liveness',
    );
    saTrackForBiz({}, ['B1KYCFaceQRcode', '']);
  }, []);
  useEffect(() => {
    if (second1 === 0) {
      setIsExpired(true);
    }
  }, [second1]);

  const getUrl = async () => {
    setLoading(true);
    setIsCompleted(true);
    trackClick(['B1KYCFaceQRcodeReload', '1']);

    try {
      // 手机扫码后，h5扫脸，成功->advacne扫脸结果成功页面，失败->advacne扫脸结果失败页面
      const returnUrl = `${KUCOIN_HOST}${language}/account/kyc`;
      const { success, data } = await services.getLegoAdvanceUrl({
        returnUrl: returnUrl,
        failedReturnUrl: returnUrl,
        ekycFlowId: kyc2ChannelInfo?.ekycflowId,
      });
      setLoading(false);
      setReset(true);
      setReset1(true);

      if (success && data?.url) {
        setUrl(`${data.url}&language=${currentLang}`);
        setIsExpired(false);
      }
    } catch (error) {
      setLoading(false);
      const msg = error?.msg
        ? typeof error?.msg === 'string'
          ? error?.msg
          : 'error'
        : typeof error === 'string'
        ? error
        : 'error';
      message.error(msg);
    }
  };
  const [isCompletedMsg, setIsCompletedMsg] = useState('');

  return (
    <Wrapper>
      <Desc>{_t('vT1BB3roRhCJBAdQU5BsU8')}</Desc>

      <QRCodeWrapper>
        <Spin spinning={loading} size="xsmall">
          <QRCode value={url} size={isH5 ? 120 : 212} level="Q" />
          {isExpired ? (
            <Mask onClick={getUrl}>
              <img src={ResetIcon} alt="result-icon" />
              <p>{_t('mJqSzTRxTNyzdUzcarJ6jv')}</p>
            </Mask>
          ) : null}
        </Spin>
      </QRCodeWrapper>

      <ResetQRCode
        onClick={() => {
          second === 0 && getUrl();
        }}
        second={second}
      >
        {isExpired ? (
          ''
        ) : second > 0 ? (
          _t('kgxxyjPJPBM2N4Z8XbNQS2', { second })
        ) : (
          <>
            <RefreshIcon />
            {_t('mJqSzTRxTNyzdUzcarJ6jv')}
          </>
        )}
      </ResetQRCode>

      {!isCompleted && isCompletedMsg ? (
        <Alert showIcon type="error" title={_t(isCompletedMsg)} />
      ) : null}

      <BtnWrapper>
        <PreButton onClick={() => onOk('facial')} loading={loading} type="default" variant="text">
          <span>{_t('jcrNiqR1ykWLB4AZF9igRS')}</span>
        </PreButton>
        <Button
          onClick={async () => {
            setBtnLoading(true);
            try {
              const { data, success } = await services.getLegoAdvanceResult({
                ekycFlowId: kyc2ChannelInfo?.ekycflowId,
              });
              trackClick(['B1KYCFaceQRcodeDone', data ? '1' : '2']);
              if (data && success) {
                onSupplierCallback(true);
              }
              setBtnLoading(false);
            } catch (error) {
              const { code } = error;
              if (code === '710018' || code === '710019') {
                setIsCompleted(false);
                setIsCompletedMsg(
                  code === '710018' ? '71uR45BMKsNWPSJwYXoRzQ' : '3VJppAp5PxgMaghvz16jQB',
                );
              } else {
                const msg = error?.msg
                  ? typeof error?.msg === 'string'
                    ? error?.msg
                    : 'error'
                  : typeof error === 'string'
                  ? error
                  : 'error';
                message.error(msg);
              }

              setBtnLoading(false);
            }
          }}
          loading={btnLoading}
        >
          <span>{_t('tcJEtepX7qAR9xdFS3Sr6i')}</span>
        </Button>
      </BtnWrapper>
    </Wrapper>
  );
};

export default ScanQRCode;
