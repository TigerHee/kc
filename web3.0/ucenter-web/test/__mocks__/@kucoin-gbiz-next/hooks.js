/**
 * Owner: eli.xiang@kupotech.com
 */
const hooks = {
  useIpCountryCode: jest.fn(() => 'GB'),
  useMultiSiteConfig: jest.fn(() => ({
      multiSiteConfig: {},
    })),
};

module.exports = hooks;
