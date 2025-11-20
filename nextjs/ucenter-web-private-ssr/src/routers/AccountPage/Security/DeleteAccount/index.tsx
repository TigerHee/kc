import AccountLayout from '@/components/AccountLayout';
import ErrorBoundary, { SCENE_MAP } from '@/components/common/ErrorBoundary';
import DeleteAccountComp from '@/components/SecurityPage/DeleteAccount/index';

const DeleteAccount = () => {
  return (
    <ErrorBoundary scene={SCENE_MAP.accountSecurity.deleteAccount.index}>
      <DeleteAccountComp />
    </ErrorBoundary>
  );
};


export default function DeleteAccountPage() {

  return <AccountLayout><DeleteAccount /></AccountLayout>;
};
