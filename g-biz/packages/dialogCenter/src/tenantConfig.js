/**
 * Owner: eli.xiang@kupotech.com
 */

const defaultConfig = {
  isShowRegGuide: true,
};

const KC = {
  ...defaultConfig,
};

const TR = {
  ...defaultConfig,
  isShowRegGuide: false,
};

const TH = {
  ...defaultConfig,
  isShowRegGuide: false,
};

const CL = {
  ...defaultConfig,
  isShowRegGuide: false,
};

const tenant = window._BRAND_SITE_;
const tenantConfig =
  {
    KC,
    TR,
    TH,
    CL,
  }[tenant] || KC;

export { tenantConfig, tenant };
