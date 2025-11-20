/**
 * Owner: tiger@kupotech.com
 */
import { useTheme } from '@kux/mui';
import KycIcon from 'components/Account/Kyc3/Home/KycStatusCard/components/KycIcon';
import kyc_unverified from 'static/account/kyc/kyc3/kyc_unverified.png';
import kyc_unverified_dark from 'static/account/kyc/kyc3/kyc_unverified_dark.svg';
import safe_dark_icon from 'static/account/kyc/kyc3/safe-dark.png';
import safe_light_icon from 'static/account/kyc/kyc3/safe-light.png';

export const RightImg = () => {
  const theme = useTheme();

  return <KycIcon src={theme.currentTheme === 'light' ? kyc_unverified : kyc_unverified_dark} />;
};

export const VerifiedImg = () => {
  const theme = useTheme();

  return <KycIcon src={theme.currentTheme === 'light' ? safe_light_icon : safe_dark_icon} />;
};
