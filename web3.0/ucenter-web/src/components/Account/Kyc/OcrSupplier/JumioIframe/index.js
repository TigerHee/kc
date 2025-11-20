/**
 * Owner: Lena@kupotech.com
 */
import { useLocale } from '@kucoin-base/i18n';
import { ICSecurityOutlined } from '@kux/icons';
import { Spin, styled, useResponsive } from '@kux/mui';
import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import * as serv from 'services/kyc';
import { _t } from 'tools/i18n';
import { kcsensorsManualExpose, saTrackForBiz } from 'utils/ga';

const Jumio = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;
const IframeWrapper = styled.div`
  width: 100%;
`;
const StyledIframe = styled.iframe`
  object-fit: cover;
  width: 100%;
  border: none;
  min-height: 768px;
`;
const StyledSpin = styled(Spin)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;
const FooterWrapper = styled.div``;
const Footer = styled.div`
  padding: 20px 32px 0;
  font-weight: 400;
  font-size: 12px;
  color: ${(props) => props.theme.colors.text60};
  text-align: center;
`;
const SecurityIcon = styled(ICSecurityOutlined)`
  font-size: 16px;
  vertical-align: text-bottom;
  margin-right: 4px;
  color: ${({ theme }) => theme.colors.icon60};
`;

const JumioIframe = ({ onSupplierCallback }) => {
  const { kyc2ChannelInfo, kycInfo } = useSelector((state) => state.kyc);
  const { web } = kyc2ChannelInfo || {};
  const { currentLang } = useLocale();
  const rv = useResponsive();
  const isH5 = !rv?.sm;

  useEffect(() => {
    saTrackForBiz({}, ['Jumio', '']);
  }, []);

  const src = useMemo(() => {
    if (web?.href && currentLang) {
      const href = web.href.split('&locale=')[0];
      const lang = ['zh_CN', 'zh_HK'].includes(currentLang)
        ? currentLang
        : currentLang.split('_')[0];
      return href + '&locale=' + lang;
    }
  }, [web, currentLang]);

  const [loading, setLoading] = useState(true);
  const [isFinish, setIsFinish] = useState(false);

  const receiveMessage = async (event) => {
    const origin = kyc2ChannelInfo?.web?.href.split('/web/')[0];

    if (event.origin !== origin) return;

    let res = {};
    try {
      res = window.JSON.parse(event.data);
    } catch (error) {
      kcsensorsManualExpose(
        [],
        {
          category: 'KucoinKYCJumioError',
          error_message: event.data,
        },
        'technology_event',
      );
    }

    if (res?.payload?.value === 'success') {
      setIsFinish(true);
      try {
        kcsensorsManualExpose(
          [],
          {
            category: 'JumioWEBTracker',
            name: 'success',
            fail_reason_code: '',
            error_message: '',
          },
          'technology_event',
        );
      } catch (e) {
        console.log('e', e);
      }
      try {
        kcsensorsManualExpose(
          [],
          {
            web_kyc2_status: 'finish',
            web_kyc2_finish_result: 'success',
            fail_reason: '',
            supplier_name: 'jumio',
          },
          'kyc2_web_ekyc',
        );
      } catch (e) {
        console.log('e', e);
      }

      try {
        kcsensorsManualExpose(
          [],
          {
            apply_kyc_level: 'kyc3',
            current_kyc_level: kycInfo?.intermediateVerifyStatus === 0 ? 'kyc1' : 'kyc2',
            kyc_country_type:
              kycInfo?.regionType === 1
                ? '1OT'
                : kycInfo?.regionType === 2
                ? '2OT'
                : kycInfo?.regionType === 3
                ? 'normal'
                : 'unkonw',
            kyc_channel: 'web_jumio',
            kyc_submit_result: 'success',
            kyc_id_photo_front_catch_type: 'jumio',
            kyc_id_photo_back_catch_type: 'jumio',
            kyc_liveness_catch_type: 'jumio',
            kyc_submit_terminal: isH5 ? 'web_mobile' : 'web_pc',
          },
          'kyc_submit_result',
        );
      } catch (error) {}

      try {
        const { data, success } = await serv.finishJumio({
          channel: 'JUMIO',
          ekycflowId: kyc2ChannelInfo?.ekycflowId,
        });

        if (success) {
          if (data.submitSuccess) {
            onSupplierCallback(true);
          } else {
            onSupplierCallback(false);
          }
        } else {
          onSupplierCallback(false);
        }
      } catch (e) {
        console.log('e', e);
      }
    }
    if (res?.payload?.value === 'error') {
      const errorCodeMap = {
        9100: 'Error occurred on our server.',
        9200: 'Authorization token missing, invalid, or expired.',
        9210: 'Session expired after the user journey started.',
        9300: 'Error occurred transmitting image to our server.',
        9400: 'Error occurred during verification step.',
        9800: 'User has no network connection.',
        9801: 'Unexpected error occurred in the client.',
        9810: 'Problem while communicating with our server.',
        9820: 'File upload not enabled and camera unavailable.',
        9821: 'The Biometric Face Capture face capture process failed, e.g. issue with iProov',
        9822: 'Browser does not support camera.',
        9835: 'No acceptable submission in 3 attempts.',
      };
      const errorCode = res?.payload?.metainfo?.code;
      try {
        kcsensorsManualExpose(
          [],
          {
            category: 'JumioWEBTracker',
            name: 'error',
            fail_reason_code: errorCode,
            error_message: errorCodeMap[errorCode] || '',
          },
          'technology_event',
        );
      } catch (e) {
        console.log('e', e);
      }
      try {
        kcsensorsManualExpose(
          [],
          {
            apply_kyc_level: 'kyc3',
            current_kyc_level: kycInfo?.intermediateVerifyStatus === 0 ? 'kyc1' : 'kyc2',
            kyc_country_type:
              kycInfo?.regionType === 1
                ? '1OT'
                : kycInfo?.regionType === 2
                ? '2OT'
                : kycInfo?.regionType === 3
                ? 'normal'
                : 'unkonw',
            kyc_channel: 'web_jumio',
            kyc_submit_result: 'fail',
            kyc_id_photo_front_catch_type: 'jumio',
            kyc_id_photo_back_catch_type: 'jumio',
            kyc_liveness_catch_type: 'jumio',
            kyc_submit_terminal: isH5 ? 'web_mobile' : 'web_pc',
          },
          'kyc_submit_result',
        );
      } catch (error) {}
    }
    if (res?.payload?.value === 'loaded') {
      try {
        kcsensorsManualExpose(
          [],
          {
            category: 'JumioWEBTracker',
            name: 'loaded',
            fail_reason_code: '',
            error_message: '',
          },
          'technology_event',
        );
      } catch (e) {
        console.log('e', e);
      }
    }
  };

  useEffect(() => {
    if (kyc2ChannelInfo?.web?.href && kyc2ChannelInfo?.ekycflowId) {
      if (!isFinish) {
        try {
          kcsensorsManualExpose(
            [],
            {
              web_kyc2_status: 'start',
              web_kyc2_finish_result: '',
              fail_reason: '',
              supplier_name: 'jumio',
            },
            'kyc2_web_ekyc',
          );
        } catch (e) {
          console.log('e', e);
        }

        window.addEventListener('message', receiveMessage, false);
      }
      if (isFinish) {
        window.removeEventListener('message', receiveMessage, false);
      }
    }
  }, [isFinish, kyc2ChannelInfo]);

  return (
    <Jumio>
      <StyledSpin spinning={loading} size="small" />
      <IframeWrapper>
        {src ? (
          <StyledIframe
            onLoad={() => {
              setLoading(false);
            }}
            src={src}
            allow="camera;fullscreen;accelerometer;gyroscope;magnetometer"
            allowFullScreen
            seamless
          />
        ) : null}
      </IframeWrapper>
      <FooterWrapper>
        <Footer>
          <SecurityIcon />
          {_t('kyc_process_encrypted')}
        </Footer>
      </FooterWrapper>
    </Jumio>
  );
};
export default JumioIframe;
