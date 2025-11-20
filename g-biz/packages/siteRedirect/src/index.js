/**
 * Owner: brick.fan@kupotech.com
 */

import IPRedirectDialog from './IPRedirectDialog';
import KYCRedirectDialog from './KYCRedirectDialog';

// 判断SSG环境
export const isSSG = navigator.userAgent.indexOf('SSG_ENV') > -1;

const SiteRedirect = ({
  theme,
  currentLang,
  onOpen,
  onIpRedirectDialogOpen,
  onKycRedirectDialogOpen,
}) => {
  if (isSSG) {
    return null;
  }

  return (
    <>
      <IPRedirectDialog
        theme={theme}
        currentLang={currentLang}
        onOpen={() => {
          onIpRedirectDialogOpen?.();
          onOpen?.();
        }}
      />
      <KYCRedirectDialog
        theme={theme}
        currentLang={currentLang}
        onOpen={() => {
          onKycRedirectDialogOpen?.();
          onOpen?.();
        }}
      />
    </>
  );
};

export default SiteRedirect;
