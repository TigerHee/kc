import AccountLayout from '@/components/AccountLayout';
import ErrorBoundary, { SCENE_MAP } from '@/components/common/ErrorBoundary';
import PasskeyComp from '@/components/SecurityPage/PasskeyPage/index';

const Passkey = () => {
  return (
    <ErrorBoundary scene={SCENE_MAP.accountSecurity.passkey.index}>
      <PasskeyComp />
    </ErrorBoundary>
  );
};


export default function PasskeyPage() {

  return <AccountLayout><Passkey /></AccountLayout>;
};
