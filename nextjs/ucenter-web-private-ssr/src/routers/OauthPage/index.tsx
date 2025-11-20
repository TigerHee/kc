import Oauth from '@/components/Oauth';
import ErrorBoundary, { SCENE_MAP } from '@/components/common/ErrorBoundary';
import 'gbiz-next/entrance.css';

export default function OauthPage() {
  return (
    <ErrorBoundary scene={SCENE_MAP.oauth.index}>
      <Oauth />
    </ErrorBoundary>
  );
}
