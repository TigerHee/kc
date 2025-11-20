/**
 * Owner: brick.fan@kupotech.com
 */

import { checkAppSiteMatch } from "./checkAppSiteMatch";
import { isInApp } from "./config";
import { getUserSite } from "./getUserSite";
import { goLastSiteIfNoLocale } from "./goLastSiteIfNoLocale";
import { requestIntercept } from "./requestIntercept";

// https://k-devdoc.atlassian.net/wiki/spaces/frontend/pages/797311858/WEB
const init = () => {
  if (isInApp) {
    checkAppSiteMatch();
    requestIntercept();
  } else {
    goLastSiteIfNoLocale();
    requestIntercept();
    getUserSite();
  }
};

export { init };
