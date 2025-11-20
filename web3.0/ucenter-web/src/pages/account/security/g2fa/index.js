/**
 * Owner: willen@kupotech.com
 */
// import BindG2afPage from 'routes/AccountPage/Security/BindG2afPage';
import ErrorBoundary, { SCENE_MAP } from 'components/common/ErrorBoundary';
import G2FAPage from 'routes/AccountPage/Security/G2FA';
import withMultiSiteForbiddenPage from 'src/hocs/withMultiSiteConfig';

export default () => {
  const G2afPage = withMultiSiteForbiddenPage(
    G2FAPage,
    'securityConfig',
    'google2faOpt',
    '/account/security',
  );
  return (
    <ErrorBoundary scene={SCENE_MAP.accountSecurity.g2fa.index}>
      <G2afPage />
    </ErrorBoundary>
  );
};
