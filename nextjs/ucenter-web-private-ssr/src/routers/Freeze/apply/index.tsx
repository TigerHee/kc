/**
 * Owner: willen@kupotech.com
 */
import ErrorBoundary, { SCENE_MAP } from '@/components/common/ErrorBoundary';
import ApplyUnfreeze from 'routes/FrozenPage/ApplyUnfreeze';

export default () => (
  <ErrorBoundary scene={SCENE_MAP.freeze.apply}>
    <ApplyUnfreeze />;
  </ErrorBoundary>
);
