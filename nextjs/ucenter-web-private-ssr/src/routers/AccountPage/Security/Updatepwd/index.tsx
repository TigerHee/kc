import AccountLayout from '@/components/AccountLayout';
import ErrorBoundary, { SCENE_MAP } from '@/components/common/ErrorBoundary';
import withMultiSiteForbiddenPage from 'src/hocs/withMultiSiteConfig';
import PasswordComp from '@/components/SecurityPage/Password/index';

const Password = () => {
  const Page = withMultiSiteForbiddenPage(
    PasswordComp,
    'securityConfig',
    'loginPwdOpt',
    '/account/security',
  );
  return (
    <ErrorBoundary scene={SCENE_MAP.accountSecurity.phone.index}>
      <Page />
    </ErrorBoundary>
  );
};


export default function PasswordPage() {

  return <AccountLayout><Password /></AccountLayout>;
};
