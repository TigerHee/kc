// This file configures the initialization of Sentry on the client.
// The added config here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";
import packageInfo from '../package.json'
import { IS_CLIENT } from "@/config/env";

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN;
const DEPLOY_ENV =  process.env.NEXT_PUBLIC_DEPLOY_ENV
const ENABLE_SENTRY = DEPLOY_ENV === 'pre' || DEPLOY_ENV === 'prod'

function monitorResource() {
  // 资源上报异常
  if (typeof window === 'undefined') {
    return;
  }

  IS_CLIENT && window.addEventListener(
    "error",
    (event) => {
      if (!event || !event.target) return;
      let message = "";
      const target = event.target as HTMLElement;
      if (target.tagName === "IMG") {
        message = `Failed to load image: ${(target as HTMLImageElement).src}`;
      } else if (target.tagName === "LINK" && (target as HTMLLinkElement).href) {
        message = `Failed to load css: ${(target as HTMLLinkElement).href}`;
      } else if (target.tagName === "SCRIPT") {
        message = `Failed to load script: ${(target as HTMLScriptElement).src}`;
      }
      if (!message) return;

      Sentry.captureEvent({
        message,
        level: "warning",
        tags: {
          assetsError: target.tagName,
        },
        fingerprint: [
          "{{ default }}",
          target.tagName === "LINK"
            ? (target as HTMLLinkElement).href
            : (target as HTMLScriptElement).src,
        ],
      });
    },
    true
  );
}

Sentry.init({
  dsn: SENTRY_DSN,
  environment: DEPLOY_ENV,
  release: `${packageInfo.name}@${packageInfo.version}`,
  integrations: [
    // Sentry.replayIntegration(),
    // Sentry.browserProfilingIntegration()
    // console.error自动上报异常
    // Sentry.captureConsoleIntegration({levels: ['error']}),
    // 300 ~ 599的http状态码上报异常
    Sentry.httpClientIntegration({failedRequestStatusCodes: [[300, 599]]})
  ],
  tracesSampleRate: 0.001,
  debug: false,
  // 线下环境不上报
  beforeSend: (event, hint) => {
    // return ENABLE_SENTRY ? event : null
    return event
 }
});
globalThis.Sentry = Sentry

monitorResource()

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;