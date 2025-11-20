/**
 * Owner: sean.shi@kupotech.com
 */
import React, { useEffect, useState } from 'react';
import { Dialog } from '@kux/mui';
import { Empty } from '@kux/design'
import { useTranslation } from 'tools/i18n';
import { kcsensorsManualTrack } from 'tools/sensors';
import { getTenantConfig } from '../../config/tenant';
import { useCompliantShow } from 'packages/compliantCenter';
import { parseQuery, sentryReport } from '../../common/tools';
import addLangToPath from 'tools/addLangToPath';
import { SIGNUP_KYC_BENEFITS_SPM } from '../constants';
import { configUsingGet } from '../../api/platform-reward'
import styles from './index.module.scss';
import { bootConfig } from 'kc-next/boot';

interface KycGuideDialogProps {
  open: boolean;
  onClose: () => void;
}

const KycGuideDialog: React.FC<KycGuideDialogProps> = ({ open, onClose }) => {
  const { t } = useTranslation('entrance');
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
      'publicGuideEvent'
    );
    kcsensorsManualTrack({ spm: ['GoKyc', '1'] });
  }, []);

  useEffect(() => {
    (async () => {
      try {
        // 只有开启 kyc 福利并且符合展业规则才请求接口
        const tenantConfig = getTenantConfig();
        if (tenantConfig.signup.showKycBenefits && showRegistrationReward) {
          // 注释掉 API 调用，因为 service 文件不存在
          const res = await configUsingGet();
          setContent(
            t('331bb9d5cbbb4000ad45', {
              // 接口不包含资产单位
                        // 接口不包含资产单位
              amount: (res?.data as any)?.kycDisplayAmount
                ? `${(res?.data as any)?.kycDisplayAmount}${bootConfig._BASE_CURRENCY_ || 'USDT'}`
                : '',
            })
          );
        }
      } catch (error) {
        sentryReport({
          level: 'warning',
          message: `fetch signup KYC benefits error: ${(error as Error)?.message || 'Unknown error'}`,
          tags: {
            errorType: 'signup_kyc_benefits_error',
          },
        });
        console.error('getSignupKycBenefits error', error);
      }
    })();
  }, [showRegistrationReward, t]);

  return (
    <Dialog
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
          'publicGuideEvent'
        );
        // 将注册链接的 back 或 backUrl 参数透传到 kyc 页面
        // kyc 页面会在完成后跳回到 backUrl 指定的地址
        const queryParams: { back?: string; backUrl?: string } = parseQuery();
        const { back, backUrl } = queryParams || {};

        const _url = back || backUrl || '';
        const kycPath = getTenantConfig().signup.kycPath;
        window.location.href = addLangToPath(`${kycPath}${_url ? `?backUrl=${encodeURIComponent(_url)}` : ''}`);
      }}
      okText={t('75fd4099da694800ad87')}
      style={{ margin: 28 }}
      centeredFooterButton
      header={null}
      className={styles.extendDialog}
    >
      <div className={styles.wrapper}>
        <Empty name="success" size="auto" theme="auto" />
        <div className={styles.title}>{t('9bd0b7ac651c4800a6d1')}</div>
        <div className={styles.content}>{content}</div>
      </div>
    </Dialog>
  );
};

export default KycGuideDialog;
