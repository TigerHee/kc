/**
 * Owner: vijay.zhou@kupotech.com
 * 【状态：未认证】的高阶组件，封装了通用部分的ui
 */
import { useTheme } from '@kux/mui';
import KycIcon from 'components/Account/Kyc3/Home/KycStatusCard/components/KycIcon';
import { searchToJson } from 'helper';
import { useCallback, useMemo } from 'react';
import kyc_unverified from 'static/account/kyc/kyc3/kyc_unverified.png';
import kyc_unverified_dark from 'static/account/kyc/kyc3/kyc_unverified_dark.svg';
import { trackClick } from 'utils/ga';

const { soure } = searchToJson();

export default function UnverifiedWrapper(UnverifiedComp) {
  return function KycStatusUnverified({ onClickVerify, sensorStatus }) {
    const theme = useTheme();
    const handleClickVerify = useCallback(() => {
      trackClick(['GoVerify', '1'], {
        soure: soure || '',
        kyc_homepage_status: sensorStatus,
      });
      onClickVerify && onClickVerify();
    }, [onClickVerify, sensorStatus]);

    const props = useMemo(
      () => ({
        /** 右侧认证状态图标 */
        rightImg: (
          <KycIcon src={theme.currentTheme === 'light' ? kyc_unverified : kyc_unverified_dark} />
        ),
        handleClickVerify,
      }),
      [handleClickVerify, theme],
    );

    return <UnverifiedComp {...props} />;
  };
}
