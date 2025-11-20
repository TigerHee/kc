import withI18nReady from 'adaptor/tools/withI18nReady';
import SiteRedirect, {
  IPRedirectDialog as IPRedirectDialogOri,
  KYCRedirectDialog as KYCRedirectDialogOri,
} from 'packages/siteRedirect';

export const IPRedirectDialog = withI18nReady(IPRedirectDialogOri, 'siteRedirect');
export const KYCRedirectDialog = withI18nReady(KYCRedirectDialogOri, 'siteRedirect');
export default withI18nReady(SiteRedirect, 'siteRedirect');
