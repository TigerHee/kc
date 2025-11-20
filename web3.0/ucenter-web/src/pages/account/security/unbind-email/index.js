/**
 * Owner: willen@kupotech.com
 */
// import UnbindEmailPage from 'routes/AccountPage/Security/UnbindEmailPage';
import ErrorBoundary, { SCENE_MAP } from 'components/common/ErrorBoundary';
import UnbindEmailPage from 'routes/AccountPage/Security/Email/UnbindEmail';
import withMultiSiteForbiddenPage from 'src/hocs/withMultiSiteConfig';

export default () => {
  const Page = withMultiSiteForbiddenPage(
    UnbindEmailPage,
    'securityConfig',
    'emailBindOpt',
    '/account/security',
  );
  return (
    <ErrorBoundary scene={SCENE_MAP.accountSecurity.email.unbindIndex}>
      <Page />
    </ErrorBoundary>
  );
};
