/**
 * Owner: sean.shi@kupotech.com
 */
import { renderHook } from '@testing-library/react-hooks';
import { useMarketMultiSiteConfig } from 'src/hooks/useMarketMultiSiteConfig';

describe('useMarketMultiSiteConfig', () => {
  it('render hook', () => {
    renderHook(useMarketMultiSiteConfig);
  });
});
