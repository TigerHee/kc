import AccountLayout from '@/components/AccountLayout';
import ErrorBoundary, { SCENE_MAP } from '@/components/common/ErrorBoundary';
import withMultiSiteForbiddenPage from 'src/hocs/withMultiSiteConfig';
import EmailComp from '@/components/SecurityPage/Email/index';

const Email = () => {
  const Page = withMultiSiteForbiddenPage(
    EmailComp,
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


export default function EmailPage() {

  return <AccountLayout><Email /></AccountLayout>;
};
