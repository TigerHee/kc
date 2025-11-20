import AccountLayout from '@/components/AccountLayout';
import ErrorBoundary, { SCENE_MAP } from '@/components/common/ErrorBoundary';
import withMultiSiteForbiddenPage from 'src/hocs/withMultiSiteConfig';
import UnbindEmailComp from '@/components/SecurityPage/Email/UnbindEmail';

const UnbindEmail = () => {
  const Page = withMultiSiteForbiddenPage(
    UnbindEmailComp,
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


export default function UnbindEmailPage() {

  return <AccountLayout><UnbindEmail /></AccountLayout>;
};
