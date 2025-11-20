/**
 * Owner: willen@kupotech.com
 */
import ErrorBoundary, { SCENE_MAP } from 'components/common/ErrorBoundary';
import withMultiSiteForbiddenPage from 'src/hocs/withMultiSiteConfig';
import PhonePage from 'src/routes/AccountPage/Security/Phone/index.js';

export default () => {
  const Page = withMultiSiteForbiddenPage(
    PhonePage,
    'securityConfig',
    'phoneBindOpt',
    '/account/security',
  );
  return (
    <ErrorBoundary scene={SCENE_MAP.accountSecurity.phone.index}>
      <Page />
    </ErrorBoundary>
  );
};
