import AccountLayout from '@/components/AccountLayout';
import ErrorBoundary, { SCENE_MAP } from '@/components/common/ErrorBoundary';
import withMultiSiteForbiddenPage from 'src/hocs/withMultiSiteConfig';
import G2FAComp from '@/components/SecurityPage/G2FA/index';

const G2FA = () => {
  const Page = withMultiSiteForbiddenPage(
    G2FAComp,
    'securityConfig',
    'google2faOpt',
    '/account/security',
  );
  return (
    <ErrorBoundary scene={SCENE_MAP.accountSecurity.g2fa.index}>
      <Page />
    </ErrorBoundary>
  );
};


export default function G2FAPage() {

  return <AccountLayout><G2FA /></AccountLayout>;
};
