/**
 * Owner: willen@kupotech.com
 */
import React, { useEffect, useState } from 'react';
import { styled, Dialog } from '@kux/mui';
import { useTranslation } from '@tools/i18n';
import { kcsensorsManualTrack } from '@utils/sensors';
import { tenantConfig } from '@packages/entrance/src/config/tenant';
import { useCompliantShow } from '@packages/compliantCenter';
import storage from '@utils/storage';
import IconDialog from '../../../static/status-success-light.svg';
import IconDialogDark from '../../../static/status-success-dark.svg';
import { addLangToPath, parseQuery, sentryReport } from '../../common/tools';
import { getSignupKycBenefits } from '../service';
import { SIGNUP_KYC_BENEFITS_SPM } from '../constants';
import useThemeImg from '../../hookTool/useThemeImg';

const ExtendDialog = styled(Dialog)`
  .KuxDialog-body {
    max-height: 66.6vh;
    .KuxDialog-content {
      padding: 32px 32px 0;
      overflow: hidden;
    }
    .KuxModalFooter-root {
      word-break: break-word;
      padding: 24px 32px 32px;
    }
  }
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 8px 0 0;
  flex: 1;
  img {
    width: 136px;
    height: 136px;
    margin-bottom: 8px;
  }
`;

const Title = styled.div`
  color: ${({ theme }) => theme.colors.text};
  font-size: 20px;
  font-style: normal;
  font-weight: 600;
  line-height: 130%; /* 26px */
  text-align: center;
  margin-bottom: 8px;
`;

const Content = styled.div`
  color: ${({ theme }) => theme.colors.text60};
  font-weight: 400;
  font-size: 16px;
  line-height: 130%;
  font-weight: 400;
  overflow: auto;
  text-align: center;
`;

export default ({ open, onClose }) => {
  const { t } = useTranslation('entrance');
  const { getThemeImg } = useThemeImg();
  const [content, setContent] = useState(t('67d10e5244a14000a465'));

  const showRegistrationReward = useCompliantShow(SIGNUP_KYC_BENEFITS_SPM);

  useEffect(() => {
    kcsensorsManualTrack(
      {
        spm: ['topMessage', '1'],
        data: {
          // 注册kyc引导固定bizType
          guideType: 'FORCE_KYC_REGISTER',
          name: 'card',
          reportType: 'show',
          guideColor: '',
        },
      },
      'publicGuideEvent',
    );
    kcsensorsManualTrack({ spm: ['GoKyc', '1'] });
  }, []);

  useEffect(() => {
    (async () => {
      try {
        // 只有开启 kyc 福利并且符合展业规则才请求接口
        if (tenantConfig.signup.showKycBenefits && showRegistrationReward) {
          const res = await getSignupKycBenefits();
          setContent(
            t('331bb9d5cbbb4000ad45', {
              // 接口不包含资产单位
              amount: res?.data?.kycDisplayAmount
                ? `${res?.data?.kycDisplayAmount}${window._BASE_CURRENCY_ || 'USDT'}`
                : '',
            }),
          );
        }
      } catch (error) {
        sentryReport({
          level: 'warning',
          message: `fetch signup KYC benefits error: ${error?.message}`,
          tags: {
            errorType: 'signup_kyc_benefits_error',
          },
        });
        console.error('getSignupKycBenefits error', error);
      }
    })();
  }, [showRegistrationReward, t]);

  return (
    <ExtendDialog
      open={open}
      title=""
      onCancel={onClose}
      cancelText={null}
      onOk={() => {
        kcsensorsManualTrack({ spm: ['GoKyc', '1'] }, 'page_click');
        kcsensorsManualTrack(
          {
            spm: ['topMessage', '1'],
            data: {
              // 注册kyc引导固定bizType
              guideType: 'FORCE_KYC_REGISTER',
              name: 'card',
              reportType: 'click',
              guideColor: '',
            },
          },
          'publicGuideEvent',
        );
        // 将注册链接的 back 或 backUrl 参数透传到 kyc 页面
        // kyc 页面会在完成后跳回到 backUrl 指定的地址
        const queryParams = parseQuery();
        const { back, backUrl } = queryParams || {};

        const _url = back || backUrl || '';
        window.location.href = addLangToPath(
          `${tenantConfig.signup.kycPath}${_url ? `?backUrl=${encodeURIComponent(_url)}` : ''}`,
          storage.getItem('kucoinv2_lang'),
        );
      }}
      okText={t('75fd4099da694800ad87')}
      style={{ margin: 28 }}
      centeredFooterButton
      header={null}
    >
      <Wrapper>
        <img src={getThemeImg({ light: IconDialog, dark: IconDialogDark })} alt="logo" />
        <Title>{t('9bd0b7ac651c4800a6d1')}</Title>
        <Content>{content}</Content>
      </Wrapper>
    </ExtendDialog>
  );
};
