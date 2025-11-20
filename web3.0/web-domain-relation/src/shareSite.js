import { init } from "./shareSiteUtils";
import { shareSiteConfig } from "./shareSiteUtils/config";
import { switchSite } from "./shareSiteUtils/switchSite";

init();

window._DEFAULT_LANG_ =
  shareSiteConfig[window._BRAND_SITE_FULL_NAME_].defaultLang;
window._DEFAULT_LOCALE_ =
  shareSiteConfig[window._BRAND_SITE_FULL_NAME_].defaultLocale;
window._BASE_CURRENCY_ =
  shareSiteConfig[window._BRAND_SITE_FULL_NAME_].baseCurrency;
window._DEFAULT_PATH_ =
  shareSiteConfig[window._BRAND_SITE_FULL_NAME_].defaultPath;

window._SWITCH_SITE_ = switchSite;
