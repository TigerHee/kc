/**
 * Owner: willen@kupotech.com
 */
import ErrorBoundary, { SCENE_MAP } from 'components/common/ErrorBoundary';
import OauthPage from 'routes/OauthPage';

export default () => (
  <ErrorBoundary scene={SCENE_MAP.oauth.index}>
    <OauthPage />
  </ErrorBoundary>
);
