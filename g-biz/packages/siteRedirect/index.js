/**
 * Owner: brick.fan@kupotech.com
 */
import withI18nReady from '@hooks/withI18nReady';
import SiteRedirect from './src/index';
import IPRedirectDialogOri from './src/IPRedirectDialog';
import KYCRedirectDialogOri from './src/KYCRedirectDialog';

export const IPRedirectDialog = withI18nReady(IPRedirectDialogOri, 'siteRedirect');
export const KYCRedirectDialog = withI18nReady(KYCRedirectDialogOri, 'siteRedirect');
export default withI18nReady(SiteRedirect, 'siteRedirect');
