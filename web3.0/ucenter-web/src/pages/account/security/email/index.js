/**
 * Owner: willen@kupotech.com
 */
import ErrorBoundary, { SCENE_MAP } from 'components/common/ErrorBoundary';
import ModifyEmailPage from 'routes/AccountPage/Security/Email';
import withMultiSiteForbiddenPage from 'src/hocs/withMultiSiteConfig';

export default () => {
  const Page = withMultiSiteForbiddenPage(
    ModifyEmailPage,
    'securityConfig',
    'emailBindOpt',
    '/account/security',
  );
  return (
    <ErrorBoundary scene={SCENE_MAP.accountSecurity.email.index}>
      <Page />
    </ErrorBoundary>
  );
};
