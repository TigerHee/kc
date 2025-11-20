/**
 * Owner: lori@kupotech.com
 */
import { Bot } from 'components/common/Bot';
import ErrorBoundary, { SCENE_MAP } from 'components/common/ErrorBoundary';

export default () => {
  return (
    <ErrorBoundary scene={SCENE_MAP.root.ada}>
      <Bot />
    </ErrorBoundary>
  );
};
