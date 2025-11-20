import AccountLayout from '@/components/AccountLayout';
import OverView from '@/components/Account/Overview';
import ErrorBoundary, { SCENE_MAP } from '@/components/common/ErrorBoundary';

export default function AccountPage() {
  return (
    <ErrorBoundary scene={SCENE_MAP.account.index}>
      <AccountLayout>
        <OverView />
      </AccountLayout>
    </ErrorBoundary>
  );
}
