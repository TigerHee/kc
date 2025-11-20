/**
 * Owner: tiger@kupotech.com
 */
import { ICSecurityOutlined } from '@kux/icons';
import { Spin, styled } from '@kux/mui';
import snsWebSdk from '@sumsub/websdk';
import { useEffect, useRef, useState } from 'react';
import { kcsensorsManualTrack } from '@packages/kyc/src/common/tools';
import useLang from '@packages/kyc/src/hookTool/useLang';
import useCommonData from '@kycCompliance/hooks/useCommonData';

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
  pointer-events: none;
`;
const FooterWrapper = styled.div`
  border-top: 1px solid ${(props) => props.theme.colors.divider8};
`;
const Footer = styled.div`
  padding: 20px 32px;
  font-weight: 400;
  font-size: 12px;
  color: ${(props) => props.theme.colors.text60};
  text-align: center;
`;
const SecurityIcon = styled(ICSecurityOutlined)`
  font-size: 16px;
  vertical-align: text-bottom;
  margin-right: 4px;
  color: ${({ theme }) => theme.colors.primary};
`;

export default ({ pageElements, onNext, sumsubToken, sumsubRegionCode, idDocType }) => {
  const { flowData } = useCommonData();
  const { i18n = {} } = useLang();
  const { language: currentLang } = i18n;
  const contentRef = useRef(null);
  const [loading, setLoading] = useState(true);

  // 获取token
  const getNewAccessToken = () => {
    return sumsubToken;
  };

  useEffect(() => {
    const onSensorsSubmit = (v) => {
      try {
        kcsensorsManualTrack('Mkyc_get_liveness', [], {
          liveness_status: 'start',
          liveness_result: '',
          failed_reason: '',
          message: '',
          supplier_name: 'Sumsub',
          method_type: 'now_device',
          supplier_id: 'Sumsub',
          kyc_standard: flowData.complianceStandardAlias,
          ...v,
        });
      } catch (error) {
        console.log(error);
      }
    };

    let canNext = true;
    let snsWebSdkInstance = null;
    const launchWebSdk = (accessToken) => {
      try {
        snsWebSdkInstance = snsWebSdk
          .init(accessToken, getNewAccessToken)
          .withConf({
            lang: currentLang?.split('_')?.[0],
            country: sumsubRegionCode,
            documentDefinitions: {
              IDENTITY: {
                idDocType,
                country: sumsubRegionCode,
              },
            },
            autoSelectDocumentDefinitions: true,
          })
          .withOptions({ addViewportTag: true, adaptIframeHeight: true })
          .on('idCheck.onStepCompleted', (payload) => {
            console.info('sumsub onStepCompleted', payload);
          })
          .on('idCheck.onError', (error) => {
            console.info('sumsub onError ', error);
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
              onSensorsSubmit({ liveness_status: 'start' });
            }

            // https://docs.sumsub.com/docs/handle-messages
            if (payload?.levelName === 'EU_KYC' || !canNext) {
              return;
            }

            if (
              (type === 'idCheck.onApplicantStatusChanged' &&
                ['pending', 'completed', 'onHold'].includes(payload?.reviewStatus)) ||
              type === 'idCheck.onVideoIdentCompleted'
            ) {
              canNext = false;
              onSensorsSubmit({ liveness_status: 'finish' });
              onNext();
            }
          })
          .build();
        snsWebSdkInstance.launch(contentRef.current);
      } catch (error) {
        console.info('sumsub error === ', error);
      }
    };

    if (sumsubToken) {
      launchWebSdk(getNewAccessToken());
    }

    return () => {
      snsWebSdkInstance?.destroy();
    };
  }, [currentLang, sumsubToken, idDocType, sumsubRegionCode, loading]);

  return (
    <Wrapper>
      <StyledSpin spinning={loading} size="large" />
      <IframeWrapper ref={contentRef} />
      <FooterWrapper>
        <Footer>
          <SecurityIcon />
          {pageElements?.pageBotTxt}
        </Footer>
      </FooterWrapper>
    </Wrapper>
  );
};
