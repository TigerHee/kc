/**
 * Owner: sean.shi@kupotech.com
 */
import SupportBot from '@kucoin-gbiz-next/bot';
import { useIsMobile } from '@kux/design';

export const Bot = (props) => {
  const { source } = props;
  const isH5 = useIsMobile();
  return (
    <SupportBot
      hiddenIcon={isH5}
      source={source}
      iconWrapperStyle={{ right: '48px', bottom: '48px' }}
    />
  );
};
