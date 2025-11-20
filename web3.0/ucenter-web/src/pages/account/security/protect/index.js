/**
 * Owner: willen@kupotech.com
 */
// import DepositProtectPage from 'routes/AccountPage/Security/DepositProtectPage';
import ErrorBoundary, { SCENE_MAP } from 'components/common/ErrorBoundary';
import TradePasswordPage from 'routes/AccountPage/Security/TradePassword';
import withMultiSiteForbiddenPage from 'src/hocs/withMultiSiteConfig';

export default () => {
  const Page = withMultiSiteForbiddenPage(
    TradePasswordPage,
    'securityConfig',
    'withdrawPwdOpt',
    '/account/security',
  );
  return (
    <ErrorBoundary scene={SCENE_MAP.accountSecurity.tradePassword.index}>
      <Page />
    </ErrorBoundary>
  );
};
