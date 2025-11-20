/**
 * Owner: tiger@kupotech.com
 */
import { useEffect, useMemo, useState } from 'react';
import { ICSecurityOutlined } from '@kux/icons';
import { Spin, styled } from '@kux/mui';
import { kcsensorsManualTrack } from '@packages/kyc/src/common/tools';
import { useLang } from '../../../../hookTool';
import useCommonData from '../../hooks/useCommonData';

const Jumio = styled.div`
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
`;
const StyledIframe = styled.iframe`
  object-fit: cover;
  width: 100%;
  height: 100% !important;
  border: none;
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

export default ({ jumioHref = '', pageElements, onNext }) => {
  const { i18n = {} } = useLang();
  const { language: currentLang } = i18n;
  const { setInnerPageElements, flowData } = useCommonData();
  const [loading, setLoading] = useState(true);

  const src = useMemo(() => {
    if (jumioHref && currentLang) {
      const href = jumioHref.split('&locale=')[0];
      const lang = ['zh_CN', 'zh_HK'].includes(currentLang)
        ? currentLang
        : currentLang.split('_')[0];
      return `${href}&locale=${lang}`;
    }
  }, [jumioHref, currentLang]);

  const receiveMessage = async (event) => {
    try {
      const origin = jumioHref.split('/web/')[0];

      if (event?.origin?.toLocaleLowerCase() !== origin?.toLocaleLowerCase()) return;
      const res = window.JSON.parse(event.data);

      if (res?.payload?.value === 'success') {
        // 泰国站加埋点
        kcsensorsManualTrack('page_click', [], {
          spm_id: 'kcWeb.B1KYCLifenessComplete.nextButton.1',
          kyc_standard: flowData.complianceStandardAlias,
        });
        onNext();
      }
    } catch (error) {
      console.log('jumio receive err === ', error);
    }
  };

  useEffect(() => {
    window.addEventListener('message', receiveMessage, false);

    return () => {
      window.removeEventListener('message', receiveMessage, false);
    };
  }, [jumioHref]);

  // 设置innerPageElements，顶部返回按钮要用
  useEffect(() => {
    setInnerPageElements(pageElements);
  }, [pageElements]);

  return (
    <Jumio>
      <StyledSpin spinning={loading} size="large" />
      <IframeWrapper>
        {src ? (
          <StyledIframe
            onLoad={() => {
              setLoading(false);
            }}
            src={src}
            allow="camera;fullscreen;accelerometer;gyroscope;magnetometer"
            allowFullScreen="allowFullScreen"
          />
        ) : null}
      </IframeWrapper>
      <FooterWrapper>
        <Footer>
          <SecurityIcon />
          {pageElements?.pageBotTxt}
        </Footer>
      </FooterWrapper>
    </Jumio>
  );
};
