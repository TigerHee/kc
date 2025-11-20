/**
 * Owner: willen@kupotech.com
 */
import ErrorBoundary, { SCENE_MAP } from '@/components/common/ErrorBoundary';
import Frozen from 'routes/FrozenPage/Frozen';

export default () => (
  <ErrorBoundary scene={SCENE_MAP.freeze.index}>
    <Frozen />;
  </ErrorBoundary>
);
