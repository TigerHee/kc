/**
 * Owner: roger@kupotech.com
 */
import { useMemo } from 'react';
import { getSiteConfig } from 'kc-next/boot';

const useSiteConfig = () => {
  const siteConfig = useMemo(() => getSiteConfig(), []);
  return siteConfig;
};

export { getSiteConfig, useSiteConfig };
