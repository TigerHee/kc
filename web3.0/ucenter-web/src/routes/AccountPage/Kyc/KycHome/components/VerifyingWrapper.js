/**
 * Owner: vijay.zhou@kupotech.com
 * 【状态：认证中】的高阶组件，封装了通用部分的ui
 */
import { useTheme } from '@kux/mui';
import KycIcon from 'components/Account/Kyc3/Home/KycStatusCard/components/KycIcon';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import kyc_unverified from 'static/account/kyc/kyc3/kyc_unverified.png';
import kyc_unverified_dark from 'static/account/kyc/kyc3/kyc_unverified_dark.svg';
import { _t } from 'tools/i18n';

export default function VerifyingWrapper(VerifyingComp) {
  return function KycStatusVerifying({ fake }) {
    const theme = useTheme();
    const kycInfo = useSelector((s) => s.kyc.kycInfo);

    // 是否马来
    const isMY = useMemo(() => kycInfo.regionCode === 'MY', [kycInfo.regionCode]);

    const props = useMemo(
      () => ({
        fake,
        alertMsg: fake
          ? isMY
            ? _t('01d3679db2fc4800abbb')
            : _t('qMtT86sT5eodpqQEM6Wn49')
          : kycInfo?.verifyType === 0 // 0-人工审核
          ? _t('KYC_verifying_manual')
          : _t('kyc_homepage_describe_verifying'),
        rightImg: (
          <KycIcon src={theme.currentTheme === 'light' ? kyc_unverified : kyc_unverified_dark} />
        ),
      }),
      [fake, kycInfo, theme, isMY],
    );

    return <VerifyingComp {...props} />;
  };
}
