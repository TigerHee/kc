import AccountLayout from '@/components/AccountLayout';
import ErrorBoundary, { SCENE_MAP } from '@/components/common/ErrorBoundary';
import withMultiSiteForbiddenPage from 'src/hocs/withMultiSiteConfig';
import PhoneComp from '@/components/SecurityPage/Phone/UnbindPhone';

const Phone = () => {
  const Page = withMultiSiteForbiddenPage(
    PhoneComp,
    'securityConfig',
    'phoneBindOpt',
    '/account/security',
  );
  return (
    <ErrorBoundary scene={SCENE_MAP.accountSecurity.phone.index}>
      <Page />
    </ErrorBoundary>
  );
};


export default function PhonPage() {

  return <AccountLayout><Phone /></AccountLayout>;
};
