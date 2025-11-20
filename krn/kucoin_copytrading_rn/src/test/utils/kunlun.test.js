import {init} from '@kc/web-kunlun';

import initKunlun from 'utils/kunlun';

// Mock dependencies
jest.mock('@kc/web-kunlun', () => ({
  init: jest.fn(),
}));

describe('kunlun.js', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  describe('initKunlun', () => {
    it('should initialize Kunlun with correct configuration for default site type', () => {
      const host = 'api.example.com';
      const siteType = 'default';

      initKunlun(host, siteType);

      expect(init).toHaveBeenCalledWith({
        host,
        project: 'kucoin_copytrading_rn',
        apis: [],
        site: 'KC',
      });
    });

    it('should format turkey site type to TR', () => {
      const host = 'api.example.com';
      const siteType = 'turkey';

      initKunlun(host, siteType);

      expect(init).toHaveBeenCalledWith({
        host,
        project: 'kucoin_copytrading_rn',
        apis: [],
        site: 'TR',
      });
    });

    it('should format thailand site type to TH', () => {
      const host = 'api.example.com';
      const siteType = 'thailand';

      initKunlun(host, siteType);

      expect(init).toHaveBeenCalledWith({
        host,
        project: 'kucoin_copytrading_rn',
        apis: [],
        site: 'TH',
      });
    });

    it('should handle undefined site type', () => {
      const host = 'api.example.com';

      initKunlun(host);

      expect(init).toHaveBeenCalledWith({
        host,
        project: 'kucoin_copytrading_rn',
        apis: [],
        site: 'KC',
      });
    });

    it('should handle null site type', () => {
      const host = 'api.example.com';
      const siteType = null;

      initKunlun(host, siteType);

      expect(init).toHaveBeenCalledWith({
        host,
        project: 'kucoin_copytrading_rn',
        apis: [],
        site: 'KC',
      });
    });
  });
});
