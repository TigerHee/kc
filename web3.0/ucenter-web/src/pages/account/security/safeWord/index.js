/**
 * Owner: sean.shi@kupotech.com
 */
import SafeWordPage from 'routes/AccountPage/Security/SafeWordPage';
import withMultiSiteForbiddenPage from 'src/hocs/withMultiSiteConfig';

const configKey = 'antiPhishingCodeOpt';
export default () => {
  const SafePage = withMultiSiteForbiddenPage(
    SafeWordPage,
    'securityConfig',
    configKey,
    '/account/security',
  );
  return <SafePage />;
};
