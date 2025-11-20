/**
 * Owner: Lena@kupotech.com
 */
import React from 'react';
import { styled } from '@kux/mui';
import { Trans } from '@tools/i18n';
import { tenantConfig } from '@packages/kyc/src/config/tenant';
import { USER_KYC_IDENTITY_INFO } from '../../../common/constants';

const Content = styled.div`
  font-weight: 400;
  font-size: 14px;
  line-height: 130%;
  width: 100%;
  color: ${(props) => props.theme.colors.text40};

  & span {
    color: ${(props) => props.theme.colors.text};
    text-decoration: underline;
    cursor: pointer;
  }
`;
const Privacy = ({ showJumio, isCN, ...otherProps }) => {
  return (
    <Content {...otherProps}>
      {showJumio ? (
        <>
          <Trans i18nKey="4vFRNZLYU16sFK66JJQzVL" ns="kyc">
            如需了解您的個人資訊和生物辨識資料是如何儲存以及用於驗證，請閱讀
            <span
              onClick={() => {
                const newWindow = window.open(tenantConfig.kyc1.privacyUrl);
                if (newWindow) newWindow.opener = null;
              }}
            >
              使用者身分驗證聲明
            </span>
            和
            <span
              onClick={() => {
                const newWindow = window.open(
                  'https://www.jumio.com/legal-information/privacy-notices/jumio-corp-privacy-policy-for-online-services/',
                );
                if (newWindow) newWindow.opener = null;
              }}
            >
              Jumio隱私政策
            </span>
            。
          </Trans>
          <br />
          <br />
          <Trans i18nKey="8ca0f480c95e4000ab3f" ns="kyc">
            點擊「繼續」按鈕， 表示我確認已閱讀隱私權聲明並同意按照
            <span
              onClick={() => {
                const newWindow = window.open('/support/33355026776985');
                if (newWindow) newWindow.opener = null;
              }}
            >
              Privacy User Acknowledgement and Consent
            </span>
            所述處理我的個人數據，包括生物識別資訊。
          </Trans>
        </>
      ) : (
        <Trans i18nKey="sB6G6TwjKNQwMD2u1wdY5b" ns="kyc">
          点击继续表示你同意
          <span
            onClick={() => {
              const url = isCN
                ? USER_KYC_IDENTITY_INFO.CN_USER_AUTH
                : USER_KYC_IDENTITY_INFO.EN_USER_AUTH;

              const newWindow = window.open(url);
              if (newWindow) newWindow.opener = null;
            }}
          >
            用户身份认证信息声明
          </span>
        </Trans>
      )}
    </Content>
  );
};
export default Privacy;
