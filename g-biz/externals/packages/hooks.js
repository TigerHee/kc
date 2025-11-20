/**
 * Owner: solor@kupotech.com
 */

import useShowHfAccount from '@packages/hooks/src/useShowHfAccount';
import useShowHfAccountWithSub from '@packages/hooks/src/useShowHfAccountWithSub';
import useRealInteraction from '@hooks/useRealInteraction';
import useIpCountryCode from '@hooks/useIpCountryCode';
import useBrandInfo from '@hooks/useBrandInfo';
import useOauthLogin from '@hooks/useOauthLogin';
import useMultiSiteConfig from '@hooks/useMultiSiteConfig';
import useMktVisible from '@hooks/useMktVisible';
import useAccountStatus, { updateAccountStatus, ACCCOUNT_TYPE_ENUM } from '@hooks/useAccountStatus';

export default {
  useShowHfAccount,
  useShowHfAccountWithSub,
};

export {
  useRealInteraction,
  useIpCountryCode,
  useBrandInfo,
  useOauthLogin,
  useMultiSiteConfig,
  useMktVisible,
  useAccountStatus,
  updateAccountStatus,
  ACCCOUNT_TYPE_ENUM,
};
