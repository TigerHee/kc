/**
 * Owner: willen@kupotech.com
 */
import ErrorBoundary, { SCENE_MAP } from 'components/common/ErrorBoundary';
import UnbindPhonePage from 'routes/AccountPage/Security/Phone/UnbindPhone';
import withMultiSiteForbiddenPage from 'src/hocs/withMultiSiteConfig';

export default () => {
  const Page = withMultiSiteForbiddenPage(
    UnbindPhonePage,
    'securityConfig',
    'phoneBindOpt',
    '/account/security',
  );
  return (
    <ErrorBoundary scene={SCENE_MAP.accountSecurity.phone.unbindIndex}>
      <Page />
    </ErrorBoundary>
  );
};
