/**
 * Owner: willen@kupotech.com
 */
import ErrorBoundary, { SCENE_MAP } from 'components/common/ErrorBoundary';
import UpdatePasswordPage from 'routes/AccountPage/Security/Password';
import withMultiSiteForbiddenPage from 'src/hocs/withMultiSiteConfig';

export default () => {
  const Page = withMultiSiteForbiddenPage(
    UpdatePasswordPage,
    'securityConfig',
    'loginPwdOpt',
    '/account/security',
  );
  return (
    <ErrorBoundary scene={SCENE_MAP.accountSecurity.loginPassword.index}>
      <Page />
    </ErrorBoundary>
  );
};
