/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';

import canUseDom from 'utils/canUseDom';

const defaultContainer = canUseDom() ? window : null;

export default function useSticky(sticky) {
  const { offsetHeader = 0, offsetScroll = 0, getContainer = () => defaultContainer } =
    typeof sticky === 'object' ? sticky : {};

  const container = getContainer() || defaultContainer;
  return React.useMemo(() => {
    const isSticky = !!sticky;
    return {
      isSticky,
      offsetHeader,
      offsetScroll,
      container,
    };
  }, [sticky, offsetHeader, offsetScroll, container]);
}
