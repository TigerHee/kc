/**
 * Owner: eli.xiang@kupotech.com
 */
import ErrorBoundary, { SCENE_MAP } from 'components/common/ErrorBoundary';
import PasskeyPage from 'routes/AccountPage/Security/PasskeyPage';

export default () => (
  <ErrorBoundary scene={SCENE_MAP.accountSecurity.passkey.index}>
    <PasskeyPage />
  </ErrorBoundary>
);
