import { NAMESPACE } from "./config";
import reportResourceLoadException from "./common/report/reportResourceLoadException";
import jsBridge, { getAppVersion } from "@knb/native-bridge";

function init(options = {}) {
  window[NAMESPACE]?.onLoad(async () => {
    const { resourceFaild = true, initialScope = {}, ...rest } = options;
    resourceFaild && reportResourceLoadException();
    let baseOptions;
    if (window[NAMESPACE]?.BrowserTracing) {
      baseOptions = {
        integrations: [new window[NAMESPACE].BrowserTracing()],
      };
    }

    const restTags = {};
    try {
      if (jsBridge.isApp()) {
        restTags.appVersion = await getAppVersion();
      }
    } catch (e) {
      console.error(e);
    }

    window[NAMESPACE]?.init({
      tracesSampleRate: 0.001,
      sampleRate: 1,
      initialScope: {
        ...initialScope,
        tags: {
          site: window._BRAND_SITE_ || "",
          ...restTags,
          ...(initialScope.tags || {}),
        },
      },
      ...baseOptions,
      ...rest,
    });
  });
  window[NAMESPACE]?.forceLoad();
  // ssg 处理
  if (navigator.userAgent?.indexOf("SSG_ENV") !== -1) {
    const tracingScript = document.getElementById("_tracing_");
    if (tracingScript) {
      tracingScript?.remove();
    }
  }
}

export default init;
