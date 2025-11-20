/**
 * Owner: willen@kupotech.com
 */
import React from "react";
import { getReport } from "gbiz-next/report";

export default () => {
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    window.requestIdleCallback(async () => {
      (await getReport())?.logWebNetwork();
      if (document.referrer) {
        (await getReport())?.logSelfDefined("page-referrer", document.referrer);
      }
    });
  }, []);
};
