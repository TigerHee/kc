// This file configures the initialization of Sentry on the client.
// The added config here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';
import packageInfo from '../package.json';

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN;
const isDev = process.env.NODE_ENV === 'development' || window.location.host.includes('localhost') || window.location.host.includes('127.0.0.1');
const _IS_TEST_ENV_ = window.location.host.includes('kucoin.net');

function monitorResource() {
  if (isDev) return;
  // 资源上报异常
  window.addEventListener(
    'error',
    (event) => {
      try {
        if (!event || !event.target) return;
        let message = '';
        const target = event.target as HTMLElement;
        if (target.tagName === 'IMG') {
          message = `Failed to load image: ${(target as HTMLImageElement).src}`;
        } else if (
          target.tagName === 'LINK' &&
          (target as HTMLLinkElement).href
        ) {
          message = `Failed to load css: ${(target as HTMLLinkElement).href}`;
        } else if (target.tagName === 'SCRIPT') {
          message = `Failed to load script: ${
            (target as HTMLScriptElement).src
          }`;
        }
        if (!message) return;

        Sentry.captureEvent({
          message,
          level: 'warning',
          tags: {
            assetsError: target.tagName,
          },
          fingerprint: [
            '{{ default }}',
            target.tagName === 'LINK'
              ? (target as HTMLLinkElement).href
              : (target as HTMLScriptElement).src,
          ],
        });
      } catch (e) {
        console.log('Error in monitorResource:', e);
      }
    },
    true
  );
}

Sentry.init({
  dsn: SENTRY_DSN,
  // environment: DEPLOY_ENV,
  environment: _IS_TEST_ENV_ ? 'sit' : isDev ? 'dev' : 'prod',
  release: `${packageInfo.name}@${packageInfo.version}`,
  integrations: [
    // 回放功能
    // Sentry.replayIntegration(),
    // Sentry.browserProfilingIntegration()
    // console.error自动上报异常
    // Sentry.captureConsoleIntegration({levels: ['error']}),
    // 300 ~ 599的http状态码上报异常
    Sentry.httpClientIntegration({
      failedRequestStatusCodes: [
        [300, 400],
        [402, 402],
        [404, 428],
        [430, 599],
      ],
    }),
  ],
  tracesSampleRate: 0.001,
  debug: false,
  // 线下环境不上报
  beforeSend: (event) => {
    if (isDev || _IS_TEST_ENV_) {
      return null;
    }
    return event;
  },
});
globalThis.Sentry = Sentry;

monitorResource();

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
