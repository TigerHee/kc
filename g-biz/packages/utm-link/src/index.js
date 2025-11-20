/**
 * Owner: iron@kupotech.com
 */
import React from 'react';
import { queryPersistence } from '@kc/gbiz-base/lib/QueryPersistence';

export default React.memo(({ children, href, ...rest }) => {
  const _href = typeof href === 'string' ? queryPersistence.formatUrlWithStore(href) : href;
  return (
    <a href={_href} {...rest}>
      {children}
    </a>
  );
});
