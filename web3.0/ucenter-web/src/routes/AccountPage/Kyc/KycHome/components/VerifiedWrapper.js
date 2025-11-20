/**
 * Owner: vijay.zhou@kupotech.com
 * 【状态：认证成功】的高阶组件，封装了通用部分的ui
 */
import { useTheme } from '@kux/mui';
import KycIcon from 'components/Account/Kyc3/Home/KycStatusCard/components/KycIcon';
import { searchToJson } from 'helper';
import { useCallback, useMemo } from 'react';
import kyc_verified from 'static/account/kyc/kyc3/kyc_verified.png';
import kyc_verified_dark from 'static/account/kyc/kyc3/kyc_verified_dark.svg';
import { addLangToPath } from 'tools/i18n';
import { trackClick } from 'utils/ga';

const { soure } = searchToJson();

export default function VerifiedWrapper(VerifiedComp) {
  return function KycStatusVerified({ sensorStatus }) {
    const theme = useTheme();

    const handleDeposit = useCallback(() => {
      trackClick(['Deposit', '1'], {
        soure: soure || '',
        kyc_homepage_status: sensorStatus,
      });
      window.location.href = addLangToPath(`/assets/coin/${window._BASE_CURRENCY_}`);
    }, [sensorStatus]);

    const props = useMemo(
      () => ({
        handleDeposit,
        rightImg: (
          <KycIcon
            size={160}
            src={theme.currentTheme === 'light' ? kyc_verified : kyc_verified_dark}
          />
        ),
      }),
      [handleDeposit, theme],
    );

    return <VerifiedComp {...props} />;
  };
}
