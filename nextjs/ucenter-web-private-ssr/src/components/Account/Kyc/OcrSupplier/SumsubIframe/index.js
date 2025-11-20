/**
 * Owner: tiger@kupotech.com
 */
import { useLocale } from 'hooks/useLocale';
import { ICSecurityOutlined } from '@kux/icons';
import { Spin, styled, useTheme } from '@kux/mui';
import snsWebSdk from '@sumsub/websdk';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { finishSumsub } from 'services/kyc';
import { _t } from 'tools/i18n';
import { kcsensorsManualExpose, saTrackForBiz } from 'utils/ga';

import useResponsiveSSR from '@/hooks/useResponsiveSSR';

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  -ms-overflow-style: none;
  overflow: -moz-scrollbars-none;
  display: flex;
  flex-direction: column;
  &::-webkit-scrollbar {
    width: 0 !important;
  }
`;
const IframeWrapper = styled.div`
  width: 100%;
  flex: 1;
  position: relative;
  overflow-y: auto;
`;
const StyledSpin = styled(Spin)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;
const FooterWrapper = styled.div`
  margin: 0 -32px;
  flex-shrink: 0;
`;
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

const cardMap = {
  idcard: 'ID_CARD',
  passport: 'PASSPORT',
  drivinglicense: 'DRIVERS',
};

export default ({ onSupplierCallback }) => {
  const { currentTheme } = useTheme();
  const contentRef = useRef(null);
  const { currentLang } = useLocale();
  const kyc2ChannelInfo = useSelector((state) => state.kyc.kyc2ChannelInfo || {});
  const kycInfo = useSelector((state) => state.kyc.kycInfo || {});
  const [loading, setLoading] = useState(true);
  const rv = useResponsiveSSR();
  const isH5 = !rv?.sm;

  // 获取token
  const getNewAccessToken = () => {
    return Promise.resolve(kyc2ChannelInfo?.token);
  };

  useEffect(() => {
    let snsWebSdkInstance = null;
    const launchWebSdk = (accessToken) => {
      try {
        snsWebSdkInstance = snsWebSdk
          .init(accessToken, getNewAccessToken)
          .withConf({
            lang: currentLang?.split('_')?.[0],
            country: kycInfo?.regionCodetrible,
            documentDefinitions: {
              IDENTITY: {
                idDocType: cardMap[kycInfo?.identityType],
                country: kycInfo?.regionCodetrible,
              },
            },
            autoSelectDocumentDefinitions: true,
            theme: currentTheme,
          })
          .withOptions({ addViewportTag: true, adaptIframeHeight: true })
          .on('idCheck.onStepCompleted', (payload) => {
            console.info('sumsub onStepCompleted', payload);
          })
          .on('idCheck.onError', (error) => {
            console.info('sumsub onError ', error);
            kcsensorsManualExpose(
              [],
              {
                category: 'SumsubWEBTracker',
                name: 'getChannel',
                resultType: 'Sumsub',
                fail_reason_code: String(JSON.stringify(error)),
                error_message: String(JSON.stringify(error)),
              },
              'technology_event',
            );
          })
          .onMessage(async (type, payload) => {
            // if (type !== 'idCheck.onResize') {
            //   console.info('==========');
            //   console.info('type ========== ', type);
            //   console.info('payload ========== ', payload);
            // }

            if (type === 'idCheck.onReady' && loading) {
              setLoading(false);
            }

            // 开始活体采集
            if (payload?.idDocSetType === 'SELFIE') {
              saTrackForBiz({ saType: 'kyc2_get_liveness' }, [], {
                liveness_status: 'start',
                liveness_result: '',
                failed_reason: '',
                message: '',
                supplier_name: 'Sumsub',
                method_type: 'now_device',
                supplier_id: 'Sumsub',
              });
            }

            // 活体扫描完成
            if (
              type === 'idCheck.onApplicantStatusChanged' &&
              ['pending', 'completed'].includes(payload?.reviewStatus)
            ) {
              // KYC信息提交结果
              const postResult = (v) => {
                kcsensorsManualExpose(
                  [],
                  {
                    web_kyc2_status: 'finish',
                    web_kyc2_finish_result: v,
                    fail_reason: '',
                    supplier_name: 'Sumsub',
                  },
                  'kyc2_web_ekyc',
                );
                saTrackForBiz({ saType: 'kyc2_get_liveness' }, [], {
                  liveness_status: 'finish',
                  liveness_result: v,
                  failed_reason: '',
                  message: '',
                  supplier_name: 'Sumsub',
                  method_type: 'now_device',
                  supplier_id: 'Sumsub',
                });
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
                    kyc_channel: 'web_sumsub',
                    kyc_submit_result: v,
                    kyc_id_photo_front_catch_type: 'sumsub',
                    kyc_id_photo_back_catch_type: 'sumsub',
                    kyc_liveness_catch_type: 'sumsub',
                    kyc_submit_terminal: isH5 ? 'web_mobile' : 'web_pc',
                  },
                  'kyc_submit_result',
                );
              };

              const res = await finishSumsub({
                channel: kyc2ChannelInfo?.channel,
                ekycflowId: kyc2ChannelInfo?.ekycflowId,
              });
              const { data } = res || {};
              if (data?.submitSuccess) {
                postResult('success');
                onSupplierCallback(true);
              } else {
                postResult('fail');
                onSupplierCallback(false);
              }
            }
          })
          .build();
        snsWebSdkInstance.launch(contentRef.current);
      } catch (error) {
        console.info('sumsub error === ', error);
      }
    };

    if (kycInfo?.identityType) {
      launchWebSdk(kyc2ChannelInfo?.token);
    }

    return () => {
      snsWebSdkInstance?.destroy();
    };
  }, [currentLang, kycInfo, kyc2ChannelInfo]);

  return (
    <Wrapper>
      <StyledSpin spinning={loading} size="small" />
      <IframeWrapper ref={contentRef} />
      {loading ? null : (
        <FooterWrapper>
          <Footer>
            <SecurityIcon />
            {_t('kyc_process_encrypted')}
          </Footer>
        </FooterWrapper>
      )}
    </Wrapper>
  );
};
