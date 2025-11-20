// This file configures the initialization of Sentry for edge features (middleware, edge routes, and so on).
// The config you add here will be used whenever one of the edge features is loaded.
// Note that this config is unrelated to the Vercel Edge Runtime and is also required when running locally.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";
import packageInfo from './package.json'

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN;
const DEPLOY_ENV =  process.env.NEXT_PUBLIC_DEPLOY_ENV
const ENABLE_SENTRY = DEPLOY_ENV === 'pre' || DEPLOY_ENV === 'prod'

Sentry.init({
  dsn: SENTRY_DSN,
  release: `${packageInfo.name}@${packageInfo.version}`,
  sampleRate: 1,
  tracesSampleRate: 0.001,
  debug: false,
  // 线下环境不上报
   beforeSend: (event, hint) => {
      return ENABLE_SENTRY ? event : null
   }
});
globalThis.Sentry = Sentry
