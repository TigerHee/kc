/**
 * Owner: sean.shi@kupotech.com
 */
import SupportBot from 'gbiz-next/bot';
import { useIsMobile } from '@kux/design';
import { IS_CLIENT_ENV } from 'kc-next/env';
import ErrorBoundary, { SCENE_MAP } from '@/components/ErrorBoundary';

const Bot = (props) => {
  const { source } = props;
  const isH5 = useIsMobile();
  return (!IS_CLIENT_ENV ? null :
    <ErrorBoundary scene={SCENE_MAP.root.bot}>
      <SupportBot
        hiddenIcon={isH5}
        source={source}
        iconWrapperStyle={{ right: '48px', bottom: '48px' }}
      />
    </ErrorBoundary>);
};

export default Bot;
