import AccountLayout from '@/components/AccountLayout';
import ErrorBoundary, { SCENE_MAP } from '@/components/common/ErrorBoundary';
import withMultiSiteForbiddenPage from 'src/hocs/withMultiSiteConfig';
import SafeWordComp from '@/components/SecurityPage/SafeWord';

const SafeWord = () => {
  const Page = withMultiSiteForbiddenPage(
    SafeWordComp,
    'securityConfig',
    'antiPhishingCodeOpt',
    '/account/security',
  );
  return (
    <ErrorBoundary scene={SCENE_MAP.accountSecurity.email.index}>
      <Page />
    </ErrorBoundary>
  );
};


export default function SafeWordPage() {

  return <AccountLayout><SafeWord /></AccountLayout>;
};
