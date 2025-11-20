// This file configures the initialization of Sentry on the client.
// The added config here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';
import packageInfo from '../package.json';

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN;
const isDev = process.env.NODE_ENV === 'development';
const _IS_TEST_ENV_ = window.location.host.includes('kucoin.net');

function monitorResource() {
  if (isDev && !process.env.NEXT_PUBLIC_SENTRY_LOCAL) return;
  // 资源上报异常
  window.addEventListener(
    'error',
    event => {
      try {
        console.error('show error event:', event);
        if (!event || !event.target) return;
        let message = '';
        const target = event.target as HTMLElement;
        const tagName = target?.tagName;
        const error = event?.error;
        if (tagName === 'IMG') {
          message = `Failed to load image: ${(target as HTMLImageElement).src}`;
        } else if (tagName === 'LINK' && (target as HTMLLinkElement).href) {
          message = `Failed to load css: ${(target as HTMLLinkElement).href}`;
        } else if (tagName === 'SCRIPT') {
          message = `Failed to load script: ${(target as HTMLScriptElement).src}`;
        }
        if (!message) return;
        const classListText = JSON.stringify(target?.classList);

        Sentry.captureEvent({
          message,
          level: 'warning',
          tags: {
            assetsError: tagName,
          },
          extra: {
            // 额外的调试信息
            classListText,
            stackText: error?.stack,
          },
          fingerprint: [
            '{{ default }}',
            tagName === 'LINK' ? (target as HTMLLinkElement).href : (target as HTMLScriptElement).src,
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
  // 开启 debug 模式，可以看到详细的发送日志
  debug: !!process.env.NEXT_PUBLIC_SENTRY_LOCAL,
  // 线下环境不上报
  beforeSend: event => {
    try {
      let stackText = JSON.stringify(event?.exception) || '';
      const maxLength = 2000;
      stackText = stackText.length > maxLength ? stackText.slice(0, maxLength) + '...' : stackText;
      console.warn('Sentry instrumentation client | 捕获到错误事件:', event, event?.message, stackText);
    } catch (error) {
      console.warn('Sentry instrumentation client | event解析失败', (error as any)?.message);
      console.warn('Sentry instrumentation client | event', event);
    }

    if ((isDev || _IS_TEST_ENV_) && !process.env.NEXT_PUBLIC_SENTRY_LOCAL) {
      return null;
    }
    return event;
  },
});
globalThis.Sentry = Sentry;

monitorResource();

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
