/**
 * Owner: brick.fan@kupotech.com
 */

import IPRedirectDialog from "./IPRedirectDialog";
import KYCRedirectDialog from "./KYCRedirectDialog";
import NoSSG from 'tools/No-SSG';
interface Props {
  theme: string;
  onOpen?: () => void;
  onIpRedirectDialogOpen?: () => void;
  onKycRedirectDialogOpen?: () => void;
}

const SiteRedirect = ({
  theme,
  onOpen,
  onIpRedirectDialogOpen,
  onKycRedirectDialogOpen,
}: Props) => {
  return (
    <NoSSG>
      <IPRedirectDialog
        theme={theme}
        onOpen={() => {
          onIpRedirectDialogOpen?.();
          onOpen?.();
        }}
      />
      <KYCRedirectDialog
        theme={theme}
        onOpen={() => {
          onKycRedirectDialogOpen?.();
          onOpen?.();
        }}
      />
    </NoSSG>
  );
};

export { IPRedirectDialog, KYCRedirectDialog };

export default SiteRedirect;
