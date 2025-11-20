import AccountLayout from '@/components/AccountLayout';
import ErrorBoundary, { SCENE_MAP } from '@/components/common/ErrorBoundary';
import withMultiSiteForbiddenPage from 'src/hocs/withMultiSiteConfig';
import TradePasswordComp from '@/components/SecurityPage/TradePassword/index';

const TradePassword = () => {
  const Page = withMultiSiteForbiddenPage(
    TradePasswordComp,
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


export default function TradePasswordPage() {

  return <AccountLayout><TradePassword /></AccountLayout>;
};
